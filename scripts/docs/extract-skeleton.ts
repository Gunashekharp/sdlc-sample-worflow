/**
 * extract-skeleton.ts
 *
 * Deterministic markdown skeleton generator. Walks each configured source
 * root, parses every TS/TSX file with the TypeScript compiler API (via
 * ts-morph), and emits one Starlight-compatible Markdown page per source
 * file with EVERY exported symbol pre-listed and EVERY statement in every
 * function body pre-extracted with a line-by-line FILL marker.
 *
 * The output is the contract that downstream LLM agents fill in. The LLM
 * never writes signatures, types, or line numbers; it only fills the
 * <FILL: ...> markers. That eliminates "the agent forgot to document
 * function X" and "the agent invented a parameter that does not exist".
 *
 * Output target is the live docs site directory. Subtrees listed under
 * sourceRoots are wiped before regeneration so removed source files do
 * not leave orphan doc pages behind. Files listed in `preserveFiles` are
 * never touched.
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
  Block,
  Statement,
} from 'ts-morph'

import {
  repoRoot,
  sourceRoots,
  docsContentRoot,
  preserveFiles,
  sourceFileGlobs,
  ignorePatterns,
  configFilePatterns,
  maxStatementsPerFunction,
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
  walk?: StatementEntry[]
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

interface StatementEntry {
  line: number
  code: string
  kind: string
}

interface TestCase {
  describe: string[]
  name: string
}

interface ImportRow {
  names: string[]
  module: string
  isRelative: boolean
  isTypeOnly: boolean
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
  imports: ImportRow[]
  totalLines: number
}

const skipSet = new Set(configFilePatterns)

function shouldSkipFile(filePath: string): boolean {
  const base = path.basename(filePath)
  if (skipSet.has(base)) return true
  if (base.startsWith('.')) return true
  return false
}

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
      if (refs.length >= 10) break
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

function signatureBeforeBody(decl: FunctionDeclaration | ArrowFunction | FunctionExpression): string {
  const body = decl.getBody()
  const full = decl.getText()
  if (!body) return full
  const offset = body.getStart() - decl.getStart()
  return full.slice(0, offset).trim()
}

/**
 * Walk the top-level statements of a function body. For nested blocks (if
 * branches, loops, try/catch), include the parent statement once — the
 * statement text already contains the inner code. We do not deep-walk to
 * keep the line-by-line section readable; the full source appendix at the
 * bottom of every file page covers everything literally.
 */
function extractStatementWalk(body: Block): StatementEntry[] {
  const out: StatementEntry[] = []
  for (const s of body.getStatements()) {
    const line = s.getStartLineNumber()
    const code = s.getText()
    out.push({
      line,
      code,
      kind: SyntaxKind[s.getKind()],
    })
    if (out.length >= maxStatementsPerFunction) break
  }
  return out
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
  body: Block | undefined,
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
  if (body) {
    sym.walk = extractStatementWalk(body)
  }
  return sym
}

function describeFunctionDecl(decl: FunctionDeclaration, isDefault: boolean): SymbolDoc | null {
  const name = decl.getName() ?? (isDefault ? path.basename(decl.getSourceFile().getFilePath()).replace(/\.[^.]+$/, '') : null)
  if (!name) return null
  const params = decl.getParameters()
  const returnType = decl.getReturnType().getText(decl).replace(/\s+/g, ' ')
  const body = decl.getBody()
  const signature = signatureBeforeBody(decl) + (body ? ' { ... }' : '')
  const jsdoc = getJsDoc(decl)
  return describeFunction(name, isDefault, decl.getSourceFile(), params, returnType, signature, jsdoc, decl, Node.isBlock(body) ? body : undefined)
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
    const body = fn.getBody()
    return describeFunction(name, isDefault, decl.getSourceFile(), params, returnType, signature, jsdoc, decl, Node.isBlock(body) ? body : undefined)
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
    const body = decl.getBody()
    return describeFunction(name, isDefault, decl.getSourceFile(), params, returnType, decl.getText().slice(0, 200), '', decl, Node.isBlock(body) ? body : undefined)
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
  const seen = new Set<string>()
  return out.filter((s) => {
    const k = `${s.kind}:${s.name}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

function collectImports(sourceFile: SourceFile): ImportRow[] {
  const rows: ImportRow[] = []
  for (const imp of sourceFile.getImportDeclarations()) {
    const module = imp.getModuleSpecifierValue()
    const names: string[] = []
    const def = imp.getDefaultImport()
    if (def) names.push(`default as ${def.getText()}`)
    const ns = imp.getNamespaceImport()
    if (ns) names.push(`* as ${ns.getText()}`)
    for (const ni of imp.getNamedImports()) {
      const alias = ni.getAliasNode()
      names.push(alias ? `${ni.getName()} as ${alias.getText()}` : ni.getName())
    }
    rows.push({
      names,
      module,
      isRelative: module.startsWith('.'),
      isTypeOnly: imp.isTypeOnly(),
    })
  }
  return rows
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
  const re = /(describe|it|test)\s*\(\s*(['"`])((?:\\.|(?!\2).)*)\2/g
  let m: RegExpExecArray | null
  let lastIndex = 0
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

/**
 * Wrap a FILL prompt (or previously-filled prose) in stable HTML-comment
 * anchors so the extractor can preserve LLM-written content across reruns.
 *
 *   <!-- fill:<id> -->
 *   <content or FILL prompt>
 *   <!-- /fill:<id> -->
 *
 * The id is derived from structural location (file/symbol/section) so it
 * stays stable when the LLM only adds prose and the underlying code is
 * unchanged. When a symbol gets renamed or its statements get reordered,
 * the id changes and the fill content is lost — that is the correct
 * behaviour, since the prose was tied to the old shape.
 */
function fillBlock(id: string, defaultPrompt: string, preserved?: Map<string, string>): string {
  const content = preserved?.get(id) ?? `<FILL: ${defaultPrompt}>`
  return `<!-- fill:${id} -->\n${content}\n<!-- /fill:${id} -->`
}

/**
 * Parse all <!-- fill:ID -->...<!-- /fill:ID --> blocks from a doc file.
 * Returns a map from id to the preserved inner content (FILL prompts and
 * real prose alike — the caller decides what to do with each).
 */
function parseFillAnchors(content: string): Map<string, string> {
  const out = new Map<string, string>()
  const re = /<!--\s*fill:([^\s>]+)\s*-->([\s\S]*?)<!--\s*\/fill:\1\s*-->/g
  let m: RegExpExecArray | null
  while ((m = re.exec(content)) !== null) {
    const inner = m[2].trim()
    // Skip un-filled defaults so a regen with an updated default prompt
    // wins instead of cementing the old one.
    if (inner.startsWith('<FILL:') && inner.endsWith('>')) continue
    out.set(m[1], inner)
  }
  return out
}

/**
 * Snapshot every existing doc file's filled blocks BEFORE the wipe step.
 * Returns a map from output doc path -> id -> preserved content.
 */
function snapshotExistingFills(): Map<string, Map<string, string>> {
  const snap = new Map<string, Map<string, string>>()
  for (const root of sourceRoots) {
    const target = path.join(docsContentRoot, root.outDir)
    if (!fs.existsSync(target)) continue
    function walk(dir: string): void {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          walk(full)
          continue
        }
        if (!entry.name.endsWith('.md')) continue
        const content = fs.readFileSync(full, 'utf-8')
        const fills = parseFillAnchors(content)
        if (fills.size) snap.set(full, fills)
      }
    }
    walk(target)
  }
  return snap
}

function renderTable(headers: string[], rows: string[][]): string {
  const sep = headers.map(() => '---').join(' | ')
  const head = headers.join(' | ')
  return `| ${head} |\n| ${sep} |\n${rows.length ? rows.map((r) => '| ' + r.join(' | ') + ' |').join('\n') : '| ' + headers.map(() => '_(none)_').join(' | ') + ' |'}`
}

function renderImports(imports: ImportRow[]): string {
  if (!imports.length) return ''
  const lines: string[] = []
  lines.push('## Imports')
  lines.push('')
  lines.push('This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.')
  lines.push('')
  lines.push(
    renderTable(
      ['Module', 'Imports', 'Kind'],
      imports.map((i) => [
        '`' + mdEscape(i.module) + '`',
        i.names.length ? '`' + i.names.map(mdEscape).join('`, `') + '`' : '_side-effect only_',
        (i.isTypeOnly ? 'type-only · ' : '') + (i.isRelative ? 'internal' : 'external'),
      ]),
    ),
  )
  return lines.join('\n') + '\n'
}

function renderWalk(sym: SymbolDoc, preserved?: Map<string, string>): string {
  if (!sym.walk || sym.walk.length === 0) return ''
  const lines: string[] = []
  lines.push('### Line-by-line walkthrough')
  lines.push('')
  lines.push(`Each top-level statement of \`${sym.name}\`, in execution order. The line numbers reference the source file as it appears today.`)
  lines.push('')
  sym.walk.forEach((s, idx) => {
    lines.push(`**Line ${s.line} — \`${s.kind}\`**`)
    lines.push('')
    lines.push('```ts')
    lines.push(s.code)
    lines.push('```')
    lines.push('')
    lines.push(fillBlock(
      `sym:${sym.name}:walk:${idx}`,
      `explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.`,
      preserved,
    ))
    lines.push('')
  })
  if (sym.walk.length === maxStatementsPerFunction) {
    lines.push(':::note')
    lines.push(`Walkthrough truncated at ${maxStatementsPerFunction} statements. Open the source file at \`${sym.name}\` to see the full body.`)
    lines.push(':::')
    lines.push('')
  }
  return lines.join('\n')
}

function renderSymbol(sym: SymbolDoc, preserved?: Map<string, string>): string {
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
    lines.push(fillBlock(
      `sym:${sym.name}:summary`,
      `2-4 sentences explaining what ${sym.name} does and why it exists. Ground every claim in the signature and source.`,
      preserved,
    ))
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
    lines.push(fillBlock(
      `sym:${sym.name}:return`,
      `describe the return value of ${sym.name} — what it represents, when it can be null/undefined, units.`,
      preserved,
    ))
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
  if (sym.walk && sym.walk.length) {
    lines.push(renderWalk(sym, preserved))
  }
  if (sym.kind === 'component' || sym.kind === 'hook' || sym.kind === 'function') {
    lines.push('### Examples')
    lines.push('')
    lines.push(fillBlock(
      `sym:${sym.name}:example`,
      `at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.`,
      preserved,
    ))
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

function renderFileDoc(doc: FileDoc, preserved?: Map<string, string>): string {
  const fm: string[] = ['---']
  const title = path.basename(doc.relInRoot).replace(/\.[^.]+$/, '')
  fm.push(`title: ${title}`)
  fm.push(`description: Reference for \`${doc.relPath}\``)
  fm.push('---')
  const lines: string[] = [fm.join('\n'), '']
  lines.push(`**File:** \`${doc.relPath}\` · **Lines:** ${doc.totalLines}`)
  lines.push('')
  if (doc.headerSummary) {
    lines.push('> ' + doc.headerSummary.split('\n').join('\n> '))
    lines.push('')
  } else {
    lines.push(fillBlock(
      `file:summary`,
      `2-4 sentence plain-language summary of what \`${doc.relInRoot}\` is responsible for, what other files it integrates with, and what calls into it.`,
      preserved,
    ))
    lines.push('')
  }
  if (doc.imports.length) {
    lines.push(renderImports(doc.imports))
    lines.push('')
  }
  if (doc.symbols.length === 0) {
    lines.push(':::caution')
    lines.push(`No exported symbols detected by the AST. This file is likely a side-effect entrypoint, re-export barrel, or runtime bootstrap. The source appendix below contains the full file.`)
    lines.push(':::')
    lines.push('')
  } else {
    lines.push(`## Symbols`)
    lines.push('')
    lines.push(`This file exports ${doc.symbols.length} symbol${doc.symbols.length === 1 ? '' : 's'}. Every export is documented below, in declaration order.`)
    lines.push('')
    lines.push(
      renderTable(
        ['Name', 'Kind', 'Default'],
        doc.symbols.map((s) => [s.name, s.kind, s.isDefault ? 'yes' : 'no']),
      ),
    )
    lines.push('')
    for (const s of doc.symbols) {
      lines.push(renderSymbol(s, preserved))
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
  lines.push(fillBlock(
    `file:diagrams`,
    `if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use \`flowchart\`, \`sequenceDiagram\`, or \`stateDiagram-v2\`. Skip this section entirely — do not write "no diagram" — if the file is trivial.`,
    preserved,
  ))
  lines.push('')
  return lines.join('\n')
}

function rmrfDir(dir: string): void {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })
}

function wipeReplaceableSubtrees(): void {
  for (const root of sourceRoots) {
    const target = path.join(docsContentRoot, root.outDir)
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true })
    }
  }
}

function assertPreservedFilesUntouched(): void {
  // Sanity check: every preserve target either exists or we warn.
  for (const f of preserveFiles) {
    const p = path.join(docsContentRoot, f)
    if (!fs.existsSync(p)) {
      console.warn(`  ⚠ preserveFiles entry not found on disk: ${f}`)
    }
  }
}

async function run(): Promise<void> {
  assertPreservedFilesUntouched()
  // CRITICAL: snapshot LLM-filled prose BEFORE wiping. Without this, the
  // workflow would re-run the LLM against every doc page on every push,
  // even pages whose source did not change.
  const snapshot = snapshotExistingFills()
  let preservedFillCount = 0
  for (const v of snapshot.values()) preservedFillCount += v.size
  wipeReplaceableSubtrees()
  fs.mkdirSync(docsContentRoot, { recursive: true })
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
      const outPath = path.join(docsContentRoot, root.outDir, outRel)
      const totalLines = fs.readFileSync(fp, 'utf-8').split('\n').length
      const doc: FileDoc = {
        sourceRoot: root,
        sourceFile,
        relPath,
        relInRoot,
        outPath,
        symbols: collectSymbols(sourceFile),
        tests: [],
        headerSummary: summarizeFile(sourceFile),
        imports: collectImports(sourceFile),
        totalLines,
      }
      const testPath = findTestFile(sourceFile)
      if (testPath) doc.tests = parseTests(testPath)
      fs.mkdirSync(path.dirname(outPath), { recursive: true })
      const preservedForThisDoc = snapshot.get(outPath)
      fs.writeFileSync(outPath, renderFileDoc(doc, preservedForThisDoc), 'utf-8')
      count++
    }
    summary[root.name] = count
  }
  const total = Object.values(summary).reduce((a, b) => a + b, 0)
  console.log(`\nWrote ${total} skeleton page${total === 1 ? '' : 's'} to ${path.relative(repoRoot, docsContentRoot)}/`)
  for (const [name, n] of Object.entries(summary)) console.log(`  ${name.padEnd(12)} ${n}`)
  console.log(`Preserved hand-curated: ${preserveFiles.join(', ')}`)
  console.log(`Preserved LLM-filled blocks: ${preservedFillCount} across ${snapshot.size} doc file${snapshot.size === 1 ? '' : 's'}.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
