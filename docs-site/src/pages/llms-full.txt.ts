/**
 * /llms-full.txt — the complete documentation corpus as plain text.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://gunashekharp.github.io';
const BASE = '/sdlc-sample-worflow';

function stripMermaid(md: string) { return md.replace(/```mermaid[\s\S]*?```/g, ''); }
function stripFrontmatter(md: string) { return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ''); }
function stripLeadingImports(md: string) { return md.replace(/^(\s*import\s+[^;]+;\s*\r?\n)+/g, '').trimStart(); }

export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');
  docs.sort((a, b) => a.id.localeCompare(b.id));

  const chunks: string[] = [
    '# Snabbit Agent Console — full documentation corpus',
    '',
    `Source: https://github.com/Gunashekharp/sdlc-sample-worflow`,
    `Discovery: ${SITE}${BASE}/llms.txt`,
    '',
    '---',
    '',
  ];

  for (const entry of docs) {
    if (entry.data.draft) continue;
    const slug = entry.id.replace(/\.(md|mdx)$/, '');
    if (/^\d/.test(slug)) continue;
    const cleanSlug = slug === 'index' ? '' : slug;
    const url = `${SITE}${BASE}/${cleanSlug}${cleanSlug ? '/' : ''}`;
    const title = entry.data.title ?? slug;
    const body = stripLeadingImports(stripMermaid(stripFrontmatter(entry.body ?? '')));

    chunks.push(`# ${title}`); chunks.push('');
    chunks.push(`Source: ${url}`);
    if (entry.data.description) { chunks.push(''); chunks.push(`> ${entry.data.description}`); }
    chunks.push(''); chunks.push(body.trim()); chunks.push(''); chunks.push('---'); chunks.push('');
  }

  return new Response(chunks.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
