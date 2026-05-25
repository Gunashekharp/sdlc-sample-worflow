/**
 * extract-diagrams.ts
 *
 * Library + CLI for deterministic architecture diagrams. Used by the
 * overview generator and by `npm run extract:diagrams` (debug). Same
 * code path for both, so the rendered diagrams in the docs cannot drift
 * from the debug output.
 *
 *   - Module dependency graph (per source root)
 *   - Per-folder dependency subgraphs
 *   - React component tree (frontend only)
 *
 * All extraction is done via the TypeScript compiler API (ts-morph).
 * Imports are resolved with the project's own tsconfig, so bundler-mode
 * resolution and JSX extensions work out of the box. No LLM, ever.
 */

import fs from 'node:fs'
import path from 'node:path'
import { Project, Node, SyntaxKind, type SourceFile } from 'ts-morph'

import { repoRoot, sourceRoots, type SourceRoot } from './config.ts'

interface ResolvedDep {
  from: string  // relative to source root
  to: string    // relative to source root
}

const projectCache = new Map<string, Project>()

function projectFor(root: SourceRoot): Project {
  const key = root.name
  const cached = projectCache.get(key)
  if (cached) return cached
  const absSourceDir = path.resolve(repoRoot, root.sourceDir)
  const tsConfigPath = root.tsConfig ? path.resolve(repoRoot, root.tsConfig) : undefined
  const project = new Project({
    tsConfigFilePath: tsConfigPath,
    skipAddingFilesFromTsConfig: !!tsConfigPath ? false : true,
  })
  project.addSourceFilesAtPaths([
    path.join(absSourceDir, '**/*.ts'),
    path.join(absSourceDir, '**/*.tsx'),
    path.join(absSourceDir, '**/*.js'),
    path.join(absSourceDir, '**/*.mjs'),
  ])
  projectCache.set(key, project)
  return project
}

function isInternalSource(sf: SourceFile, absSourceDir: string): boolean {
  const fp = sf.getFilePath()
  if (!fp.startsWith(absSourceDir + path.sep)) return false
  const base = path.basename(fp)
  if (
    base.endsWith('.test.ts') ||
    base.endsWith('.test.tsx') ||
    base.endsWith('.spec.ts') ||
    base.endsWith('.spec.tsx') ||
    base.endsWith('.d.ts')
  ) return false
  if (fp.includes('/__tests__/')) return false
  return true
}

function collectInternalDeps(root: SourceRoot): ResolvedDep[] {
  const absSourceDir = path.resolve(repoRoot, root.sourceDir)
  const project = projectFor(root)
  const deps: ResolvedDep[] = []
  for (const sf of project.getSourceFiles()) {
    if (!isInternalSource(sf, absSourceDir)) continue
    const from = path.relative(absSourceDir, sf.getFilePath())
    for (const imp of sf.getImportDeclarations()) {
      const resolved = imp.getModuleSpecifierSourceFile()
      if (!resolved) continue
      if (!isInternalSource(resolved, absSourceDir)) continue
      const to = path.relative(absSourceDir, resolved.getFilePath())
      if (to === from) continue
      deps.push({ from, to })
    }
  }
  return deps
}

function mermaidId(p: string): string {
  return p.replace(/[^a-zA-Z0-9_]/g, '_')
}

const DO_NOT_EDIT_BANNER =
  '%% Auto-generated from source by scripts/docs/extract-diagrams.ts. Do not edit by hand — changes will be overwritten on the next docs-agent run.'

/** Full dependency graph for an entire source root. */
export function buildRootDepGraph(root: SourceRoot): string | null {
  const deps = collectInternalDeps(root)
  if (deps.length === 0) return null
  const nodes = new Set<string>()
  for (const d of deps) {
    nodes.add(d.from)
    nodes.add(d.to)
  }
  const lines: string[] = []
  lines.push(`%% Module dependency graph for ${root.name}`)
  lines.push(DO_NOT_EDIT_BANNER)
  lines.push('flowchart LR')
  for (const n of [...nodes].sort()) lines.push(`  ${mermaidId(n)}["${n}"]`)
  for (const d of deps) lines.push(`  ${mermaidId(d.from)} --> ${mermaidId(d.to)}`)
  return lines.join('\n')
}

/** Sub-graph showing dependencies of files inside one folder. */
export function buildFolderDepGraph(root: SourceRoot, folder: string): string | null {
  const all = collectInternalDeps(root)
  const inFolder = (rel: string) => rel === folder || rel.startsWith(folder + path.sep)
  const relevant = all.filter((d) => inFolder(d.from))
  if (relevant.length === 0) return null
  const nodes = new Set<string>()
  for (const d of relevant) {
    nodes.add(d.from)
    nodes.add(d.to)
  }
  const lines: string[] = []
  lines.push(`%% Subgraph for ${root.name}/${folder}`)
  lines.push(DO_NOT_EDIT_BANNER)
  lines.push('flowchart LR')
  for (const n of [...nodes].sort()) {
    const label = inFolder(n) ? n : `external: ${n}`
    lines.push(`  ${mermaidId(n)}["${label}"]`)
  }
  for (const d of relevant) lines.push(`  ${mermaidId(d.from)} --> ${mermaidId(d.to)}`)
  return lines.join('\n')
}

/** React component tree. Parent renders child, derived from JSX usage. */
export function buildComponentTree(root: SourceRoot): string | null {
  const absSourceDir = path.resolve(repoRoot, root.sourceDir)
  if (!fs.existsSync(absSourceDir)) return null
  const project = projectFor(root)
  const tsxFiles = project
    .getSourceFiles()
    .filter((sf) => sf.getFilePath().endsWith('.tsx') && isInternalSource(sf, absSourceDir))
  if (tsxFiles.length === 0) return null

  function fileComponentName(filePath: string): string {
    return path.basename(filePath).replace(/\.tsx$/, '')
  }

  const edges = new Set<string>()
  const nodes = new Set<string>()
  for (const sf of tsxFiles) {
    const parent = fileComponentName(sf.getFilePath())
    nodes.add(parent)
    const localImports = new Map<string, string>()
    for (const imp of sf.getImportDeclarations()) {
      const mod = imp.getModuleSpecifierValue()
      if (!mod.startsWith('.')) continue
      const resolvedFile = imp.getModuleSpecifierSourceFile()
      const importedFromBase = resolvedFile
        ? fileComponentName(resolvedFile.getFilePath())
        : path.basename(mod)
      const def = imp.getDefaultImport()
      if (def) localImports.set(def.getText(), importedFromBase)
      for (const ni of imp.getNamedImports()) {
        localImports.set(ni.getName(), importedFromBase)
      }
    }
    sf.forEachDescendant((node) => {
      if (
        node.getKind() === SyntaxKind.JsxOpeningElement ||
        node.getKind() === SyntaxKind.JsxSelfClosingElement
      ) {
        const name = (node as unknown as { getTagNameNode(): Node }).getTagNameNode().getText()
        if (/^[A-Z]/.test(name) && localImports.has(name)) {
          const child = localImports.get(name)!
          if (child !== parent) {
            nodes.add(child)
            edges.add(`${parent}-->${child}`)
          }
        }
      }
    })
  }
  if (edges.size === 0) return null
  const lines: string[] = []
  lines.push('%% React component tree (parent renders child)')
  lines.push(DO_NOT_EDIT_BANNER)
  lines.push('flowchart TD')
  for (const n of [...nodes].sort()) lines.push(`  ${mermaidId(n)}["${n}"]`)
  for (const e of edges) {
    const [from, to] = e.split('-->')
    lines.push(`  ${mermaidId(from)} --> ${mermaidId(to)}`)
  }
  return lines.join('\n')
}

/** Top-level folders inside a source root, used to drive subgraph generation. */
export function topLevelFolders(root: SourceRoot): string[] {
  const absSourceDir = path.resolve(repoRoot, root.sourceDir)
  if (!fs.existsSync(absSourceDir)) return []
  return fs
    .readdirSync(absSourceDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== '__tests__')
    .map((e) => e.name)
    .sort()
}

/* ------------------------------------------------------------------ */
/* CLI: `npm run extract:diagrams` writes debug copies of the same artifacts */

const isCli = import.meta.url === `file://${process.argv[1]}`
if (isCli) {
  const debugDir = path.resolve(repoRoot, 'scripts', 'docs', '_diagrams')
  fs.rmSync(debugDir, { recursive: true, force: true })
  fs.mkdirSync(debugDir, { recursive: true })
  for (const root of sourceRoots) {
    const full = buildRootDepGraph(root)
    if (full) {
      fs.writeFileSync(path.join(debugDir, `${root.name}.deps.mmd`), full, 'utf-8')
      const edges = full.split('\n').filter((l) => l.includes(' --> ')).length
      console.log(`✓ ${root.name}.deps.mmd  (${edges} edges)`)
    }
    for (const folder of topLevelFolders(root)) {
      const sub = buildFolderDepGraph(root, folder)
      if (sub) {
        fs.writeFileSync(path.join(debugDir, `${root.name}.${folder}.deps.mmd`), sub, 'utf-8')
        console.log(`✓ ${root.name}.${folder}.deps.mmd`)
      }
    }
    if (root.name === 'frontend') {
      const tree = buildComponentTree(root)
      if (tree) {
        fs.writeFileSync(path.join(debugDir, `${root.name}.component-tree.mmd`), tree, 'utf-8')
        console.log(`✓ ${root.name}.component-tree.mmd`)
      }
    }
  }
  console.log(`\nDebug copies in ${path.relative(repoRoot, debugDir)}/`)
  console.log(`The docs build inlines the same diagrams into overview pages.`)
}
