#!/usr/bin/env node
/**
 * build-index.mjs — builds docs-index.json, the search index the chatbot
 * Worker uses to answer questions.
 *
 * It reads every Markdown page under docs-site/src/content/docs/, splits
 * each page into heading-sized chunks, and records, for each chunk, the
 * page title, the on-site URL, the heading, and the chunk text.
 *
 * Re-run this whenever the docs change, then redeploy the Worker:
 *   node build-index.mjs   (or: npm run index)
 *   npm run deploy
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const DOCS_DIR = join(here, '..', 'docs-site', 'src', 'content', 'docs');
const OUT = join(here, 'docs-index.json');

// Must match `base` in docs-site/astro.config.mjs so the source links work.
const SITE_BASE = '/sdlc-sample-worflow';

const MAX_CHUNK = 1500; // characters per chunk

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      // Skip numbered version archives (e.g. 2.0/) — index "Latest" only.
      if (/^\d/.test(name)) continue;
      out.push(...walk(p));
    } else if (/\.mdx?$/.test(name)) {
      out.push(p);
    }
  }
  return out;
}

function pageUrl(file) {
  let rel = relative(DOCS_DIR, file).split(sep).join('/').replace(/\.mdx?$/, '');
  if (rel === 'index' || rel.endsWith('/index')) rel = rel.replace(/\/?index$/, '');
  return (SITE_BASE + '/' + rel + '/').replace(/\/{2,}/g, '/');
}

function frontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { title: null, body: src };
  const tm = m[1].match(/^title:\s*(.+)$/m);
  const title = tm ? tm[1].trim().replace(/^['"]|['"]$/g, '') : null;
  return { title, body: src.slice(m[0].length) };
}

function clean(text) {
  return text
    .replace(/```mermaid[\s\S]*?```/g, ' ') // drop diagram source — it's noise
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function chunkPage(title, url, body) {
  const chunks = [];
  for (const part of body.split(/\n(?=## )/)) {
    const hm = part.match(/^##\s+(.+)/);
    const heading = hm ? hm[1].trim() : title;
    const nl = part.indexOf('\n');
    let text = clean(hm ? (nl === -1 ? '' : part.slice(nl + 1)) : part);
    if (!text) continue;
    while (text.length > MAX_CHUNK) {
      chunks.push({ title, heading, url, text: text.slice(0, MAX_CHUNK) });
      text = text.slice(MAX_CHUNK);
    }
    chunks.push({ title, heading, url, text });
  }
  return chunks;
}

const files = walk(DOCS_DIR);
const index = [];
for (const file of files) {
  const { title, body } = frontmatter(readFileSync(file, 'utf-8'));
  const url = pageUrl(file);
  index.push(...chunkPage(title || url, url, body));
}

writeFileSync(OUT, JSON.stringify(index));
console.log(`Indexed ${files.length} pages -> ${index.length} chunks -> ${OUT}`);
