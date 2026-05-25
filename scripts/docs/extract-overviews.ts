/**
 * extract-overviews.ts
 *
 * Generates the overview pages that sit above per-file documentation:
 *
 *   - <root>/overview.md           (e.g. frontend/overview.md)
 *   - <root>/<folder>/overview.md  (e.g. frontend/components/overview.md)
 *
 * Each overview lists every file in scope (sorted), embeds the
 * deterministic Mermaid dependency graph for that scope, and leaves
 * <FILL: ...> markers for the LLM to write architectural prose. The file
 * lists and diagrams are correct by construction — the LLM cannot drop a
 * file from an overview because the row is already in the table.
 *
 * Runs AFTER extract-skeleton.ts so the per-file pages it links to already
 * exist on disk.
 */

import fs from 'node:fs'
import path from 'node:path'

import {
  repoRoot,
  sourceRoots,
  docsContentRoot,
  sourceFileGlobs,
  ignorePatterns,
  configFilePatterns,
  type SourceRoot,
} from './config.ts'

import {
  buildRootDepGraph,
  buildFolderDepGraph,
  buildComponentTree,
  topLevelFolders,
} from './extract-diagrams.ts'

const skipSet = new Set(configFilePatterns)

interface FileEntry {
  /** absolute path */
  abs: string
  /** path relative to source root (e.g. components/AgentCard.tsx) */
  relInRoot: string
  /** doc slug under the docs section (e.g. components/agentcard) */
  docSlug: string
}

function listSourceFiles(absSourceDir: string): FileEntry[] {
  const out: FileEntry[] = []
  function walk(dir: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '__tests__') continue
        walk(full)
        continue
      }
      const base = entry.name
      if (skipSet.has(base) || base.startsWith('.')) continue
      if (
        base.endsWith('.test.ts') ||
        base.endsWith('.test.tsx') ||
        base.endsWith('.spec.ts') ||
        base.endsWith('.spec.tsx') ||
        base.endsWith('.d.ts')
      ) {
        continue
      }
      const ext = path.extname(base)
      if (!['.ts', '.tsx', '.js', '.mjs', '.jsx'].includes(ext)) continue
      const relInRoot = path.relative(absSourceDir, full)
      out.push({
        abs: full,
        relInRoot,
        docSlug: relInRoot.replace(/\.(tsx?|jsx?|mjs)$/, '').toLowerCase(),
      })
    }
  }
  walk(absSourceDir)
  return out.sort((a, b) => a.relInRoot.localeCompare(b.relInRoot))
}

function readSummaryHint(absPath: string): string {
  const source = fs.readFileSync(absPath, 'utf-8')
  // First leading block comment becomes the one-line description hint.
  const m = source.match(/^\/\*+([\s\S]*?)\*+\//)
  if (m) {
    return m[1]
      .replace(/^\s*\*\s?/gm, '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)[0] || ''
  }
  return ''
}

function renderTable(headers: string[], rows: string[][]): string {
  const sep = headers.map(() => '---').join(' | ')
  const head = headers.join(' | ')
  return `| ${head} |\n| ${sep} |\n${rows.length ? rows.map((r) => '| ' + r.join(' | ') + ' |').join('\n') : '| ' + headers.map(() => '_(none)_').join(' | ') + ' |'}`
}

function embedMermaid(title: string, mermaid: string | null, emptyNote: string): string {
  const lines: string[] = []
  lines.push(`### ${title}`)
  lines.push('')
  if (!mermaid) {
    lines.push(`:::note`)
    lines.push(emptyNote)
    lines.push(`:::`)
    lines.push('')
    return lines.join('\n')
  }
  lines.push('```mermaid')
  lines.push(mermaid)
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}

function renderRootOverview(root: SourceRoot): string {
  const absSourceDir = path.resolve(repoRoot, root.sourceDir)
  const files = listSourceFiles(absSourceDir)
  const folderSet = new Set<string>()
  for (const f of files) {
    const parts = f.relInRoot.split(path.sep)
    if (parts.length > 1) folderSet.add(parts[0])
  }
  const folders = Array.from(folderSet).sort()

  const fm = ['---', `title: ${root.name}`, `description: ${root.blurb}`, '---']
  const lines: string[] = [fm.join('\n'), '']
  lines.push(`**Section root:** \`${root.sourceDir}\``)
  lines.push('')
  lines.push(`> ${root.blurb}`)
  lines.push('')
  lines.push('<FILL: 3-5 sentences on what this subsystem owns, the runtime boundaries, and the data it produces or consumes. Reference the diagrams below by name.>')
  lines.push('')

  lines.push('## Top-level structure')
  lines.push('')
  if (folders.length) {
    lines.push(
      renderTable(
        ['Folder', 'Purpose'],
        folders.map((f) => [`[\`${f}/\`](./${root.outDir}/${f}/overview/)`, `<FILL: one line on what lives in ${f}/ and when to add a file here.>`]),
      ),
    )
    lines.push('')
  }
  const looseFiles = files.filter((f) => !f.relInRoot.includes(path.sep))
  if (looseFiles.length) {
    lines.push('### Files at the root of this section')
    lines.push('')
    lines.push(
      renderTable(
        ['File', 'Hint'],
        looseFiles.map((f) => [
          `[\`${f.relInRoot}\`](./${f.docSlug})`,
          readSummaryHint(f.abs) || `<FILL: one-line purpose for ${f.relInRoot}>`,
        ]),
      ),
    )
    lines.push('')
  }

  lines.push('## Architecture')
  lines.push('')
  lines.push(embedMermaid(
    'Module dependency graph',
    buildRootDepGraph(root),
    `Dependency graph could not be generated for ${root.name} (no modules detected).`,
  ))
  if (root.name === 'frontend') {
    lines.push(embedMermaid(
      'React component tree',
      buildComponentTree(root),
      `No JSX-rendered children were detected.`,
    ))
  }
  lines.push('## Key flows')
  lines.push('')
  lines.push('<FILL: 2-3 short flow descriptions — the most important runtime sequences in this subsystem. Reference symbols by their documented file (use relative links).>')
  lines.push('')
  lines.push('## When to add code here')
  lines.push('')
  lines.push('<FILL: practical guidance for someone deciding whether a new module belongs in this subsystem or somewhere else.>')
  lines.push('')
  return lines.join('\n')
}

function renderFolderOverview(root: SourceRoot, folder: string): string {
  const absSourceDir = path.resolve(repoRoot, root.sourceDir)
  const files = listSourceFiles(absSourceDir).filter(
    (f) => f.relInRoot.startsWith(folder + path.sep) && !f.relInRoot.slice(folder.length + 1).includes(path.sep),
  )
  // Files in this exact folder; nested-folder files belong to their own overview.
  const fm = ['---', `title: ${folder}`, `description: Files under ${root.sourceDir}/${folder}/`, '---']
  const lines: string[] = [fm.join('\n'), '']
  lines.push(`**Folder:** \`${root.sourceDir}/${folder}/\``)
  lines.push('')
  lines.push('<FILL: 2-4 sentences on what this folder is for, what kinds of modules belong here, and what does NOT belong here.>')
  lines.push('')

  lines.push('## Files')
  lines.push('')
  if (files.length) {
    lines.push(
      renderTable(
        ['File', 'Hint'],
        files.map((f) => [
          `[\`${path.basename(f.relInRoot)}\`](../${f.docSlug})`,
          readSummaryHint(f.abs) || `<FILL: one-line purpose for ${path.basename(f.relInRoot)}>`,
        ]),
      ),
    )
    lines.push('')
  }
  lines.push('## Dependencies')
  lines.push('')
  lines.push(embedMermaid(
    'Module dependency subgraph',
    buildFolderDepGraph(root, folder),
    `No internal dependencies detected for this folder.`,
  ))
  lines.push('## Key flows')
  lines.push('')
  lines.push('<FILL: 1-3 short descriptions of how modules in this folder cooperate at runtime.>')
  lines.push('')
  return lines.join('\n')
}

function writeIfChanged(p: string, content: string): boolean {
  const cur = fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : null
  if (cur === content) return false
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content, 'utf-8')
  return true
}

async function run(): Promise<void> {
  let written = 0
  for (const root of sourceRoots) {
    const absSourceDir = path.resolve(repoRoot, root.sourceDir)
    if (!fs.existsSync(absSourceDir)) continue
    const rootOverviewPath = path.join(docsContentRoot, root.outDir, 'overview.md')
    if (writeIfChanged(rootOverviewPath, renderRootOverview(root))) written++
    console.log(`✓ ${path.relative(docsContentRoot, rootOverviewPath)}`)
    for (const folder of topLevelFolders(root)) {
      const folderOverviewPath = path.join(docsContentRoot, root.outDir, folder, 'overview.md')
      if (writeIfChanged(folderOverviewPath, renderFolderOverview(root, folder))) written++
      console.log(`✓ ${path.relative(docsContentRoot, folderOverviewPath)}`)
    }
  }
  console.log(`\nWrote ${written} overview page${written === 1 ? '' : 's'}.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
