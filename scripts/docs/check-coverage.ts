/**
 * check-coverage.ts
 *
 * Post-LLM gate. For every source file, verifies that the corresponding
 * documentation page exists AND contains an `## <SymbolName>` section
 * for every exported symbol detected by the AST. If anything is missing,
 * the script exits non-zero and prints a structured list the workflow
 * uses to re-dispatch the agent against only the missing items.
 *
 * This is what turns "the LLM usually documents most things" into
 * "every exported symbol is documented, guaranteed".
 */

import fs from 'node:fs'
import path from 'node:path'
import { Project } from 'ts-morph'

import { repoRoot, sourceRoots, docsContentRoot } from './config.ts'

const outputRoot = docsContentRoot

interface Missing {
  file: string
  expectedDocPath: string
  reason: 'doc-file-missing' | 'symbol-section-missing'
  symbols: string[]
}

function readDocIfExists(p: string): string | null {
  try {
    return fs.readFileSync(p, 'utf-8')
  } catch {
    return null
  }
}

function expectedSymbolNames(project: Project, filePath: string): string[] {
  const sf = project.getSourceFile(filePath)
  if (!sf) return []
  const out: string[] = []
  for (const [name] of sf.getExportedDeclarations()) {
    if (name === 'default') {
      out.push(path.basename(filePath).replace(/\.[^.]+$/, ''))
    } else {
      out.push(name)
    }
  }
  return out
}

async function run(): Promise<void> {
  const missing: Missing[] = []
  let checked = 0

  for (const root of sourceRoots) {
    const absSourceDir = path.resolve(repoRoot, root.sourceDir)
    if (!fs.existsSync(absSourceDir)) continue
    const tsConfigPath = root.tsConfig ? path.resolve(repoRoot, root.tsConfig) : undefined
    const project = new Project({
      tsConfigFilePath: tsConfigPath,
      skipAddingFilesFromTsConfig: !!tsConfigPath ? false : true,
    })
    project.addSourceFilesAtPaths([
      path.join(absSourceDir, '**/*.ts'),
      path.join(absSourceDir, '**/*.tsx'),
    ])
    for (const sf of project.getSourceFiles()) {
      const fp = sf.getFilePath()
      if (!fp.startsWith(absSourceDir + path.sep)) continue
      const base = path.basename(fp)
      if (
        base.endsWith('.test.ts') ||
        base.endsWith('.test.tsx') ||
        base.endsWith('.spec.ts') ||
        base.endsWith('.spec.tsx') ||
        base.endsWith('.d.ts') ||
        fp.includes('/__tests__/')
      ) {
        continue
      }
      const expected = expectedSymbolNames(project, fp)
      if (expected.length === 0) continue
      const relInRoot = path.relative(absSourceDir, fp)
      const docPath = path.join(
        outputRoot,
        root.outDir,
        relInRoot.replace(/\.(tsx?|jsx?|mjs)$/, '.md').toLowerCase(),
      )
      const doc = readDocIfExists(docPath)
      checked++
      if (doc === null) {
        missing.push({
          file: path.relative(repoRoot, fp),
          expectedDocPath: path.relative(repoRoot, docPath),
          reason: 'doc-file-missing',
          symbols: expected,
        })
        continue
      }
      const lacking: string[] = []
      for (const sym of expected) {
        const re = new RegExp(`^##\\s+${sym}\\b`, 'm')
        if (!re.test(doc)) lacking.push(sym)
      }
      if (lacking.length) {
        missing.push({
          file: path.relative(repoRoot, fp),
          expectedDocPath: path.relative(repoRoot, docPath),
          reason: 'symbol-section-missing',
          symbols: lacking,
        })
      }
    }
  }

  console.log(`Checked ${checked} source file${checked === 1 ? '' : 's'}.`)
  if (missing.length === 0) {
    console.log(`✓ All exported symbols have a documentation section.`)
    return
  }
  console.error(`\n✗ Coverage gaps detected:`)
  for (const m of missing) {
    console.error(`  ${m.file}`)
    console.error(`    → expected doc: ${m.expectedDocPath}`)
    console.error(`    → reason: ${m.reason}`)
    console.error(`    → missing: ${m.symbols.join(', ')}`)
  }
  // Emit a machine-readable file the workflow can feed back to the agent.
  // Kept outside the docs content tree so Astro never picks it up as a page.
  const reportPath = path.resolve(repoRoot, 'scripts', 'docs', '_coverage-report.json')
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, JSON.stringify(missing, null, 2), 'utf-8')
  console.error(`\n  (structured report: ${path.relative(repoRoot, reportPath)})`)
  process.exit(1)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
