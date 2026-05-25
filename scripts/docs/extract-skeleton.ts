/**
 * extract-skeleton.ts
 *
 * Deterministic markdown skeleton generator. Walks each configured source
 * root, parses every TS/TSX file with the TypeScript compiler API (via
 * ts-morph), and emits one Starlight-compatible Markdown page per source
 * file with EVERY exported symbol pre-listed.
 *
 * The output is the contract that downstream LLM agents fill in. The LLM
 * never writes signatures or types; it only fills <FILL: ...> prose blocks.
 * That eliminates the "agent forgot to document function X" failure mode
 * and the "agent hallucinated a parameter that does not exist" failure mode.
 */

import fs from 'node:fs'
import path from 'node:path'
import {
  Project,
  Node,
  SourceFile,
  SyntaxKind,
  type ExportedDeclarations,
  FunctionDeclaration,
  VariableDeclaration,
  ClassDeclaration,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  ParameterDeclaration,
  ArrowFunction,
  FunctionExpression,
  PropertySignature,
} from 'ts-morph'

import {
  repoRoot,
  sourceRoots,
  outputRoot,
  sourceFileGlobs,
  ignorePatterns,
  configFilePatterns,
  type SourceRoot,
} from './config.ts'

interface SymbolDoc {
  name: string
  kind: 'function' | 'component' | 'hook' | 'class' | 'interface' | 'type' | 'const' | 'default'
  signature: string
  jsdoc: string
  params: ParamRow[]
  returnType?: string
  propsTable?: ParamRow[]
  members?: MemberRow[]
  usedBy: string[]
  isDefault: boolean
}

interface ParamRow {
  name: string
  type: string
  default?: string
  optional: boolean
  description?: string
}

interface MemberRow {
  name: string
  type: string
  description?: string
}

interface TestCase {
  describe: string[]
  name: string
}

interface FileDoc {
  sourceRoot: SourceRoot
  sourceFile: SourceFile
  relPath: string         // relative to repoRoot
  relInRoot: string       // relative to sourceRoot.sourceDir
  outPath: string         // absolute path to output .md
  symbols: SymbolDoc[]
  tests: TestCase[]
  headerSummary: string
}

const skipSet = new Set(configFilePatterns)

function shouldSkipFile(filePath: string): boolean {
  const base = path.basename(filePath)
  if (skipSet.has(base)) return true
  if (base.startsWith('.')) return true
  return false
}

/** ts-morph's `findReferencesAsNodes` is expensive; cap and dedupe. */
function findCallers(node: Node, ownFile: string): string[] {
  const refs: string[] = []
  if (!('findReferencesAsNodes' in node)) return refs
  try {
    const found = (node as unknown as { findReferencesAsNodes(): Node[] }).findReferencesAsNodes()
    const seen = new Set<string>()
    for (const r of found) {
      const f = r.getSourceFile().getFilePath()
      if (f === ownFile) continue
      const rel = path.relative(repoRoot, f)
      if (seen.has(rel)) continue
      seen.add(rel)
      refs.push(rel)
      if (refs.length >= 8) break
    }
  } catch {
    // ts-morph can throw on synthetic nodes; treat as "no callers found".
  }
  return refs
}

function getJsDoc(node: Node): string {
  if (!('getJsDocs' in node)) return ''
  try {
    const docs = (node as unknown as { getJsDocs(): Array<{ getDescription(): string }> }).getJsDocs()
    return docs.map((d) => d.getDescription().trim()).filter(Boolean).join('\n\n')
  } catch {
    return ''
  }
}

function paramRows(params: ParameterDeclaration[]): ParamRow[] {
  return params.map((p) => ({
    name: p.getName(),
    type: p.getType().getText(p).replace(/\s+/g, ' '),
    default: p.getInitializer()?.getText(),
    optional: p.isOptional() || p.hasInitializer(),
  }))
}

/**
 * Heuristic: a function is a React component if it starts with an uppercase
 * letter and (a) returns JSX or (b) is exported from a `.tsx` file with a
 * single object-typed parameter. We use a simple structural check rather
 * than relying on JSX detection (which requires emit), since this is
 * deterministic enough for skeleton generation.
 */
function looksLikeComponent(name: string, sourceFile: SourceFile, params: ParameterDeclaration[]): boolean {
  if (!/^[A-Z]/.test(name)) return false
  if (!sourceFile.getFilePath().endsWith('.tsx')) return false
  if (params.length > 1) return false
  if (params.length === 0) return true
  const t = params[0].getType()
  return t.isObject() || t.isAnonymous()
}

function looksLikeHook(name: string): boolean {
  return /^use[A-Z]/.test(name)
}

function propsFromParam(p: ParameterDeclaration): ParamRow[] {
  const type = p.getType()
  const props = type.getProperties()
  const rows: ParamRow[] = []
  for (const prop of props) {
    const decls = prop.getDeclarations()
    const decl = decls[0]
    let typeText = '`unknown`'
    let optional = false
    let description: string | undefined
    if (decl && Node.isPropertySignature(decl)) {
      const ps = decl as PropertySignature
      typeText = ps.getType().getText(ps).replace(/\s+/g, ' ')
      optional = ps.hasQuestionToken()
      const j = getJsDoc(ps)
      if (j) description = j
    } else if (decl) {
      typeText = prop.getTypeAtLocation(decl).getText(decl).replace(/\s+/g, ' ')
    }
    rows.push({
      name: prop.getName(),
      type: typeText,
      optional,
      description,
    })
  }
  return rows
}

function describeFunction(
  name: string,
  isDefault: boolean,
  sourceFile: SourceFile,
  params: ParameterDeclaration[],
  returnType: string,
  signature: string,
  jsdoc: string,
  node: Node,
): SymbolDoc {
  const isHook = looksLikeHook(name)
  const isComponent = !isHook && looksLikeComponent(name, sourceFile, params)
  const sym: SymbolDoc = {
    name,
    kind: isComponent ? 'component' : isHook ? 'hook' : 'function',
    signature,
    jsdoc,
    params: paramRows(params),
    returnType,
    usedBy: findCallers(node, sourceFile.getFilePath()),
    isDefault,
  }
  if (isComponent && params[0]) {
    sym.propsTable = propsFromParam(params[0])
  }
  return sym
}

function signatureBeforeBody(decl: FunctionDeclaration | ArrowFunction | FunctionExpression): string {
  // Slice the declaration text up to the body opening brace using compiler
  // positions so destructured parameter braces are not mistaken for the body.
  const body = decl.getBody()
  const full = decl.getText()
  if (!body) return full
  const offset = body.getStart() - decl.getStart()
  return full.slice(0, offset).trim()
}

function describeFunctionDecl(decl: FunctionDeclaration, isDefault: boolean): SymbolDoc | null {
  const name = decl.getName() ?? (isDefault ? path.basename(decl.getSourceFile().getFilePath()).replace(/\.[^.]+$/, '') : null)
  if (!name) return null
  const params = decl.getParameters()
  const returnType = decl.getReturnType().getText(decl).replace(/\s+/g, ' ')
  const signature = signatureBeforeBody(decl) + (decl.getBody() ? ' { ... }' : '')
  const jsdoc = getJsDoc(decl)
  return describeFunction(name, isDefault, decl.getSourceFile(), params, returnType, signature, jsdoc, decl)
}

function describeVariable(decl: VariableDeclaration, isDefault: boolean): SymbolDoc | null {
  const name = decl.getName()
  const init = decl.getInitializer()
  const jsdoc = getJsDoc(decl.getVariableStatementOrThrow())
  if (init && (Node.isArrowFunction(init) || Node.isFunctionExpression(init))) {
    const fn = init as ArrowFunction | FunctionExpression
    const params = fn.getParameters()
    const returnType = fn.getReturnType().getText(fn).replace(/\s+/g, ' ')
    const signature = `const ${name} = ${signatureBeforeBody(fn)} { ... }`
    return describeFunction(name, isDefault, decl.getSourceFile(), params, returnType, signature, jsdoc, decl)
  }
  const type = decl.getType().getText(decl).replace(/\s+/g, ' ')
  return {
    name,
    kind: 'const',
    signature: `const ${name}: ${type}`,
    jsdoc,
    params: [],
    usedBy: findCallers(decl, decl.getSourceFile().getFilePath()),
    isDefault,
  }
}

function describeClass(decl: ClassDeclaration, isDefault: boolean): SymbolDoc | null {
  const name = decl.getName()
  if (!name) return null
  const members: MemberRow[] = []
  for (const m of decl.getMembers()) {
    if (Node.isMethodDeclaration(m) || Node.isPropertyDeclaration(m)) {
      members.push({
        name: m.getName(),
        type: m.getType().getText(m).replace(/\s+/g, ' '),
        description: getJsDoc(m) || undefined,
      })
    }
  }
  const heritage = decl.getHeritageClauses().map((h) => h.getText()).join(' ')
  return {
    name,
    kind: 'class',
    signature: `class ${name}${heritage ? ' ' + heritage : ''} { ... }`,
    jsdoc: getJsDoc(decl),
    params: [],
    members,
    usedBy: findCallers(decl, decl.getSourceFile().getFilePath()),
    isDefault,
  }
}

function describeInterface(decl: InterfaceDeclaration, isDefault: boolean): SymbolDoc {
  const name = decl.getName()
  const members: MemberRow[] = decl.getProperties().map((p) => ({
    name: p.getName() + (p.hasQuestionToken() ? '?' : ''),
    type: p.getType().getText(p).replace(/\s+/g, ' '),
    description: getJsDoc(p) || undefined,
  }))
  return {
    name,
    kind: 'interface',
    signature: decl.getText().split('{')[0].trim() + ' { ... }',
    jsdoc: getJsDoc(decl),
    params: [],
    members,
    usedBy: findCallers(decl, decl.getSourceFile().getFilePath()),
    isDefault,
  }
}

function describeTypeAlias(decl: TypeAliasDeclaration, isDefault: boolean): SymbolDoc {
  return {
    name: decl.getName(),
    kind: 'type',
    signature: decl.getText().replace(/\s+/g, ' '),
    jsdoc: getJsDoc(decl),
    params: [],
    usedBy: findCallers(decl, decl.getSourceFile().getFilePath()),
    isDefault,
  }
}

function describeExport(name: string, decl: ExportedDeclarations, isDefault: boolean): SymbolDoc | null {
  if (Node.isFunctionDeclaration(decl)) return describeFunctionDecl(decl, isDefault)
  if (Node.isVariableDeclaration(decl)) return describeVariable(decl, isDefault)
  if (Node.isClassDeclaration(decl)) return describeClass(decl, isDefault)
  if (Node.isInterfaceDeclaration(decl)) return describeInterface(decl, isDefault)
  if (Node.isTypeAliasDeclaration(decl)) return describeTypeAlias(decl, isDefault)
  if (Node.isArrowFunction(decl) || Node.isFunctionExpression(decl)) {
    const params = decl.getParameters()
    const returnType = decl.getReturnType().getText(decl).replace(/\s+/g, ' ')
    return describeFunction(name, isDefault, decl.getSourceFile(), params, returnType, decl.getText().slice(0, 200), '', decl)
  }
  return null
}

function collectSymbols(sourceFile: SourceFile): SymbolDoc[] {
  const out: SymbolDoc[] = []
  const exports = sourceFile.getExportedDeclarations()
  for (const [name, decls] of exports) {
    for (const d of decls) {
      const isDefault = name === 'default'
      const doc = describeExport(name, d, isDefault)
      if (doc) {
        if (isDefault && doc.name === 'default') {
          doc.name = path.basename(sourceFile.getFilePath()).replace(/\.[^.]+$/, '')
        }
        out.push(doc)
      }
    }
  }
  // De-duplicate by name+kind (default + named alias of same symbol).
  const seen = new Set<string>()
  return out.filter((s) => {
    const k = `${s.kind}:${s.name}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

function findTestFile(sourceFile: SourceFile): string | null {
  const fp = sourceFile.getFilePath()
  const dir = path.dirname(fp)
  const base = path.basename(fp).replace(/\.[^.]+$/, '')
  const ext = path.extname(fp)
  const candidates = [
    path.join(dir, `${base}.test${ext}`),
    path.join(dir, `${base}.spec${ext}`),
    path.join(dir, '__tests__', `${base}.test${ext}`),
    path.join(dir, '__tests__', `${base}.spec${ext}`),
  ]
  for (const c of candidates) if (fs.existsSync(c)) return c
  return null
}

function parseTests(testPath: string): TestCase[] {
  const source = fs.readFileSync(testPath, 'utf-8')
  const cases: TestCase[] = []
  const stack: string[] = []
  // Naive but works for vitest/jest style. We tokenize on `describe('...'` /
  // `it('...'` / `test('...'`. A real implementation would use ts-morph again
  // but this is fast and sufficient for the skeleton.
  const re = /(describe|it|test)\s*\(\s*(['"`])((?:\\.|(?!\2).)*)\2/g
  let m: RegExpExecArray | null
  let lastIndex = 0
  // Track block nesting roughly by braces between matches.
  let depth = 0
  while ((m = re.exec(source)) !== null) {
    const between = source.slice(lastIndex, m.index)
    for (const ch of between) {
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth < stack.length) stack.pop()
      }
    }
    lastIndex = m.index
    if (m[1] === 'describe') {
      stack.push(m[3])
    } else {
      cases.push({ describe: [...stack], name: m[3] })
    }
  }
  return cases
}

function summarizeFile(sourceFile: SourceFile): string {
  // Prefer a top-of-file JSDoc/block comment summary if present.
  const firstNode = sourceFile.getStatementsWithComments()[0]
  if (firstNode) {
    const leading = firstNode.getLeadingCommentRanges()
    if (leading && leading.length) {
      const text = leading[0].getText().replace(/^\s*\/\*+|\*+\/\s*$|^\s*\*\s?/gm, '').trim()
      if (text) return text.split('\n').slice(0, 4).join('\n')
    }
  }
  return ''
}

function mdEscape(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n+/g, ' ')
}

function renderTable(headers: string[], rows: string[][]): string {
  const sep = headers.map(() => '---').join(' | ')
  const head = headers.join(' | ')
  const body = rows.map((r) => r.join(' | ')).join('\n')
  return `| ${head} |\n| ${sep} |\n${rows.length ? rows.map((r) => '| ' + r.join(' | ') + ' |').join('\n') : '| ' + headers.map(() => '_(none)_').join(' | ') + ' |'}`
}

function renderSymbol(sym: SymbolDoc): string {
  const lines: string[] = []
  const titleSuffix = sym.isDefault ? ' (default export)' : ''
  lines.push(`## ${sym.name}${titleSuffix}`)
  lines.push('')
  lines.push(`**Kind:** \`${sym.kind}\``)
  lines.push('')
  lines.push('```ts')
  lines.push(sym.signature)
  lines.push('```')
  lines.push('')
  if (sym.jsdoc) {
    lines.push('> ' + sym.jsdoc.split('\n').join('\n> '))
    lines.push('')
  } else {
    lines.push(`<FILL: 2-4 sentences explaining what ${sym.name} does and why it exists. Ground every claim in the signature and source.>`)
    lines.push('')
  }
  if (sym.propsTable && sym.propsTable.length) {
    lines.push('### Props')
    lines.push('')
    lines.push(
      renderTable(
        ['Name', 'Type', 'Required', 'Description'],
        sym.propsTable.map((p) => [
          mdEscape(p.name),
          '`' + mdEscape(p.type) + '`',
          p.optional ? 'no' : 'yes',
          p.description ? mdEscape(p.description) : `<FILL: what does ${p.name} control?>`,
        ]),
      ),
    )
    lines.push('')
  } else if (sym.params.length) {
    lines.push('### Parameters')
    lines.push('')
    lines.push(
      renderTable(
        ['Name', 'Type', 'Default', 'Required', 'Purpose'],
        sym.params.map((p) => [
          mdEscape(p.name),
          '`' + mdEscape(p.type) + '`',
          p.default ? '`' + mdEscape(p.default) + '`' : '—',
          p.optional ? 'no' : 'yes',
          `<FILL: purpose of ${p.name}>`,
        ]),
      ),
    )
    lines.push('')
  }
  if (sym.returnType && sym.kind !== 'component' && sym.kind !== 'class') {
    lines.push(`**Returns:** \`${sym.returnType}\``)
    lines.push('')
    lines.push(`<FILL: describe the return value of ${sym.name} — what it represents, when it can be null/undefined, units.>`)
    lines.push('')
  }
  if (sym.members && sym.members.length) {
    const heading = sym.kind === 'class' ? 'Members' : 'Shape'
    lines.push(`### ${heading}`)
    lines.push('')
    lines.push(
      renderTable(
        ['Name', 'Type', 'Description'],
        sym.members.map((m) => [
          mdEscape(m.name),
          '`' + mdEscape(m.type) + '`',
          m.description ? mdEscape(m.description) : `<FILL: ${m.name}>`,
        ]),
      ),
    )
    lines.push('')
  }
  if (sym.kind === 'function' || sym.kind === 'component' || sym.kind === 'hook') {
    lines.push('### Walkthrough')
    lines.push('')
    lines.push(`<FILL: numbered step-by-step walkthrough of what ${sym.name} does. Reference real line behaviour, not abstractions.>`)
    lines.push('')
    lines.push('### Examples')
    lines.push('')
    lines.push(`<FILL: at least one concrete input → output example. For components, a JSX usage snippet. Pull from tests when available.>`)
    lines.push('')
  }
  if (sym.usedBy.length) {
    lines.push('### Used by')
    lines.push('')
    for (const u of sym.usedBy) lines.push(`- \`${u}\``)
    lines.push('')
  }
  return lines.join('\n')
}

function renderFileDoc(doc: FileDoc): string {
  const fm: string[] = ['---']
  const title = path.basename(doc.relInRoot).replace(/\.[^.]+$/, '')
  fm.push(`title: ${title}`)
  fm.push(`description: Reference for \`${doc.relPath}\``)
  fm.push('---')
  const lines: string[] = [fm.join('\n'), '']
  lines.push(`**File:** \`${doc.relPath}\``)
  lines.push('')
  if (doc.headerSummary) {
    lines.push('> ' + doc.headerSummary.split('\n').join('\n> '))
    lines.push('')
  } else {
    lines.push(`<FILL: 2-4 sentence plain-language summary of what \`${doc.relInRoot}\` is responsible for.>`)
    lines.push('')
  }
  if (doc.symbols.length === 0) {
    lines.push(':::caution')
    lines.push(`No exported symbols detected by the AST. This file may be an entrypoint, a side-effect-only module, or re-exports only.`)
    lines.push(':::')
    lines.push('')
  } else {
    lines.push(`## Symbols`)
    lines.push('')
    lines.push(`This file exports ${doc.symbols.length} symbol${doc.symbols.length === 1 ? '' : 's'}.`)
    lines.push('')
    lines.push(
      renderTable(
        ['Name', 'Kind', 'Default'],
        doc.symbols.map((s) => [s.name, s.kind, s.isDefault ? 'yes' : 'no']),
      ),
    )
    lines.push('')
    for (const s of doc.symbols) {
      lines.push(renderSymbol(s))
    }
  }
  if (doc.tests.length) {
    lines.push('## Tests')
    lines.push('')
    lines.push(
      renderTable(
        ['Suite', 'Test', 'Asserts'],
        doc.tests.map((t) => [
          t.describe.join(' › ') || '_(top-level)_',
          mdEscape(t.name),
          `<FILL: assertion summary>`,
        ]),
      ),
    )
    lines.push('')
  }
  lines.push('## Diagrams')
  lines.push('')
  lines.push(`<FILL: include a Mermaid diagram if the file has non-trivial control flow, async sequences, or state transitions. Use \`flowchart\`, \`sequenceDiagram\`, or \`stateDiagram-v2\`. Skip this section if the file is trivial — do not invent flow.>`)
  lines.push('')
  return lines.join('\n')
}

function rmrfDir(dir: string): void {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })
}

async function run(): Promise<void> {
  rmrfDir(outputRoot)
  fs.mkdirSync(outputRoot, { recursive: true })
  const summary: Record<string, number> = {}
  for (const root of sourceRoots) {
    const absSourceDir = path.resolve(repoRoot, root.sourceDir)
    if (!fs.existsSync(absSourceDir)) continue
    const tsConfigPath = root.tsConfig ? path.resolve(repoRoot, root.tsConfig) : undefined
    const project = new Project({
      tsConfigFilePath: tsConfigPath,
      skipAddingFilesFromTsConfig: !!tsConfigPath ? false : true,
    })
    project.addSourceFilesAtPaths(
      sourceFileGlobs.map((g) => path.join(absSourceDir, g)),
    )
    const sourceFiles = project.getSourceFiles().filter((sf) => {
      const fp = sf.getFilePath()
      if (!fp.startsWith(absSourceDir + path.sep) && fp !== absSourceDir) return false
      if (shouldSkipFile(fp)) return false
      for (const pattern of ignorePatterns) {
        // Cheap glob: only support **/ prefix and trailing extension match.
        const trimmed = pattern.replace(/^\*\*\//, '').replace(/\*\*\/?$/, '')
        if (fp.includes(trimmed.replace(/\*/g, ''))) return false
      }
      return true
    })

    let count = 0
    for (const sourceFile of sourceFiles) {
      const fp = sourceFile.getFilePath()
      const relInRoot = path.relative(absSourceDir, fp)
      const relPath = path.relative(repoRoot, fp)
      const outRel = relInRoot.replace(/\.(tsx?|jsx?|mjs)$/, '.md').toLowerCase()
      const outPath = path.join(outputRoot, root.outDir, outRel)
      const doc: FileDoc = {
        sourceRoot: root,
        sourceFile,
        relPath,
        relInRoot,
        outPath,
        symbols: collectSymbols(sourceFile),
        tests: [],
        headerSummary: summarizeFile(sourceFile),
      }
      const testPath = findTestFile(sourceFile)
      if (testPath) doc.tests = parseTests(testPath)
      fs.mkdirSync(path.dirname(outPath), { recursive: true })
      fs.writeFileSync(outPath, renderFileDoc(doc), 'utf-8')
      count++
    }
    summary[root.name] = count
  }
  const total = Object.values(summary).reduce((a, b) => a + b, 0)
  console.log(`\nWrote ${total} skeleton page${total === 1 ? '' : 's'} to ${path.relative(repoRoot, outputRoot)}/`)
  for (const [name, n] of Object.entries(summary)) console.log(`  ${name.padEnd(12)} ${n}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
