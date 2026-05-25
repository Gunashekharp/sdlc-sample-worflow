/**
 * check-mermaid.ts
 *
 * Post-LLM Mermaid syntax gate. Walks every `.md` file under the docs
 * content tree, extracts every ```mermaid block, and validates each one
 * with Mermaid's own parser — the same Jison-based parser the browser
 * uses at render time. If `parse()` accepts a block here, the browser
 * will accept it there.
 *
 * Implementation note: Mermaid is browser-targeted and expects DOM
 * globals on import. We attach a minimal jsdom DOM to globalThis BEFORE
 * dynamic-importing mermaid. No headless Chromium, no Puppeteer — ~20×
 * faster than mmdc-based validation and ~200 MB lighter on dependencies.
 */

import fs from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'

import { repoRoot, docsContentRoot } from './config.ts'

/* ------------------------------------------------------------------ */
/* DOM shim — must run before `import('mermaid')`                      */

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  pretendToBeVisual: true,
  url: 'http://localhost/',
})
const win = dom.window as unknown as Record<string, unknown>
// Attach the handful of globals Mermaid's parser touches on import.
// Avoid replacing existing Node globals (e.g. `globalThis.navigator`
// exists in Node 20+).
const globals: Record<string, unknown> = globalThis as unknown as Record<string, unknown>
for (const key of [
  'window',
  'document',
  'HTMLElement',
  'SVGElement',
  'Node',
  'Element',
  'DOMParser',
  'XMLSerializer',
  'getComputedStyle',
  'NodeFilter',
]) {
  if (globals[key] === undefined && win[key] !== undefined) {
    globals[key] = win[key]
  }
}

/* ------------------------------------------------------------------ */

const mermaidMod = await import('mermaid')
const mermaid = mermaidMod.default
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })

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

async function validateBlock(block: MermaidBlock): Promise<Failure | null> {
  try {
    // `parse` returns a Promise in mermaid v11 and resolves on valid input.
    // It throws (sync or async, depending on the diagram type's parser) on
    // any syntax error, with `err.message` containing the parse-error line.
    await mermaid.parse(block.content)
    return null
  } catch (err) {
    const rawMessage = err instanceof Error ? err.message : String(err)
    // Mermaid wraps multi-line errors; the first non-empty line is the
    // most informative summary for the report.
    const message = rawMessage.split('\n').find((l) => l.trim().length > 0) ?? 'unknown mermaid error'
    return { block, message: message.trim() }
  }
}

async function run(): Promise<void> {
  const blocks = extractMermaidBlocks()
  if (blocks.length === 0) {
    console.log('No mermaid blocks found.')
    return
  }
  const failures: Failure[] = []
  let n = 0
  for (const b of blocks) {
    n++
    process.stdout.write(`\r  checking ${n}/${blocks.length}…  `)
    const f = await validateBlock(b)
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
