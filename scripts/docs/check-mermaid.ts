/**
 * check-mermaid.ts
 *
 * Post-LLM Mermaid gate. Walks every `.md` file under the docs content
 * tree, extracts every ```mermaid block, and validates each one by piping
 * it through `mmdc` (mermaid-cli). Exits non-zero on the first parse
 * failure with a structured report (file, line, parse-error excerpt) so
 * the workflow knows exactly which block to fix.
 *
 * This catches the class of bug that the docs site only surfaces at
 * render time in the browser — invalid arrow syntax, unquoted special
 * characters in node labels, mismatched diamond/bracket pairs. Without
 * this gate the docs build is "green" but pages render with "Syntax
 * error in text" placeholders.
 */

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawnSync } from 'node:child_process'

import { repoRoot, docsContentRoot } from './config.ts'

interface MermaidBlock {
  file: string       // absolute path to the .md
  index: number      // 1-based, position of this block within its file
  line: number       // 1-based line number of the opening ```mermaid fence
  content: string    // the mermaid source between the fences
}

interface Failure {
  block: MermaidBlock
  message: string
}

function* walkMarkdown(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walkMarkdown(full)
    } else if (entry.name.endsWith('.md')) {
      yield full
    }
  }
}

function extractMermaidBlocks(): MermaidBlock[] {
  const blocks: MermaidBlock[] = []
  const re = /```mermaid\n([\s\S]*?)\n```/g
  for (const md of walkMarkdown(docsContentRoot)) {
    const text = fs.readFileSync(md, 'utf-8')
    let m: RegExpExecArray | null
    let index = 0
    while ((m = re.exec(text)) !== null) {
      index++
      const line = text.slice(0, m.index).split('\n').length
      blocks.push({ file: md, index, line, content: m[1] })
    }
  }
  return blocks
}

function locateMmdc(): string {
  // Prefer the project-local install so CI gets the version we pinned.
  const local = path.resolve(repoRoot, 'scripts', 'docs', 'node_modules', '.bin', 'mmdc')
  if (fs.existsSync(local)) return local
  // Fall back to PATH (the dev may have it installed globally).
  return 'mmdc'
}

const puppeteerConfigPath = path.resolve(repoRoot, 'scripts', 'docs', 'puppeteer-config.json')

function validateBlock(mmdc: string, block: MermaidBlock, tmpDir: string): Failure | null {
  const inPath = path.join(tmpDir, `block-${block.index}.mmd`)
  const outPath = path.join(tmpDir, `block-${block.index}.svg`)
  fs.writeFileSync(inPath, block.content, 'utf-8')
  // --puppeteerConfigFile passes `--no-sandbox` to Chromium, required when
  // running under GitHub Actions (Linux container without setuid bits).
  // The same config is harmless on dev machines.
  const args = ['-i', inPath, '-o', outPath, '--quiet']
  if (fs.existsSync(puppeteerConfigPath)) {
    args.push('--puppeteerConfigFile', puppeteerConfigPath)
  }
  const result = spawnSync(mmdc, args, {
    encoding: 'utf-8',
    timeout: 60_000,
  })
  if (result.status === 0) return null
  const stderr = result.stderr || ''
  // Pull the most informative line out of mmdc's stderr.
  const parseLine = stderr.split('\n').find((l) => /Parse error|Expecting|Lexical/.test(l)) ?? ''
  const summary = parseLine || stderr.split('\n').find((l) => l.trim().length > 0) || 'unknown mermaid error'
  return { block, message: summary.trim() }
}

async function run(): Promise<void> {
  const blocks = extractMermaidBlocks()
  if (blocks.length === 0) {
    console.log('No mermaid blocks found.')
    return
  }
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mermaid-check-'))
  const mmdc = locateMmdc()
  const failures: Failure[] = []
  let n = 0
  for (const b of blocks) {
    n++
    process.stdout.write(`\r  checking ${n}/${blocks.length}…  `)
    const f = validateBlock(mmdc, b, tmpDir)
    if (f) failures.push(f)
  }
  process.stdout.write('\r' + ' '.repeat(60) + '\r')
  if (failures.length === 0) {
    console.log(`✓ ${blocks.length} mermaid block${blocks.length === 1 ? '' : 's'} parse cleanly.`)
    return
  }
  console.error(`\n✗ ${failures.length} mermaid block${failures.length === 1 ? '' : 's'} failed to parse:\n`)
  for (const { block, message } of failures) {
    const rel = path.relative(repoRoot, block.file)
    const preview = block.content.split('\n').slice(0, 2).join(' / ')
    console.error(`  ${rel}:${block.line}  (block #${block.index})`)
    console.error(`    error : ${message}`)
    console.error(`    starts: ${preview}`)
    console.error('')
  }
  // Machine-readable report so a downstream step (or the LLM retry loop)
  // can target the broken blocks without re-parsing this console output.
  const reportPath = path.resolve(repoRoot, 'scripts', 'docs', '_mermaid-failures.json')
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      failures.map((f) => ({
        file: path.relative(repoRoot, f.block.file),
        line: f.block.line,
        blockIndex: f.block.index,
        error: f.message,
        content: f.block.content,
      })),
      null,
      2,
    ),
    'utf-8',
  )
  console.error(`  (structured report: ${path.relative(repoRoot, reportPath)})`)
  process.exit(1)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
