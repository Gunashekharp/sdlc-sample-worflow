/**
 * /llms.txt — agent-readable discovery file (https://llmstxt.org).
 * Lists every page on the docs site as a Markdown link table grouped by
 * top-level section.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://gunashekharp.github.io';
const BASE = '/sdlc-sample-worflow';

export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');
  const groups = new Map<string, Array<{ title: string; href: string; description?: string }>>();
  for (const entry of docs) {
    if (entry.data.draft) continue;
    const slug = entry.id.replace(/\.(md|mdx)$/, '');
    if (/^\d/.test(slug)) continue;
    const top = slug.includes('/') ? slug.split('/')[0] : '';
    const cleanSlug = slug === 'index' ? '' : slug;
    const href = `${SITE}${BASE}/${cleanSlug}${cleanSlug ? '/' : ''}`;
    const title = entry.data.title ?? slug;
    const description = entry.data.description;
    if (!groups.has(top)) groups.set(top, []);
    groups.get(top)!.push({ title, href, description });
  }

  const sectionOrder = ['', 'frontend', 'backend', 'chat-worker'];
  const sectionLabels: Record<string, string> = {
    '': 'Overview',
    frontend: 'Frontend',
    backend: 'Backend',
    'chat-worker': 'Chat worker',
  };

  const lines: string[] = [
    '# Snabbit Agent Console',
    '',
    '> Internal AI workflow console for Snabbit\'s ops team. Dense, dark, Linear-grade dashboard for running SDLC agents (PR review, deploys, RCAs, alert triage), backed by a REST API and a live CI/CD integration.',
    '',
    'Source: https://github.com/Gunashekharp/sdlc-sample-worflow',
    '',
    `Full corpus (single file): ${SITE}${BASE}/llms-full.txt`,
    '',
  ];

  const ordered = [
    ...sectionOrder.filter((k) => groups.has(k)),
    ...Array.from(groups.keys()).filter((k) => !sectionOrder.includes(k)),
  ];

  for (const key of ordered) {
    lines.push(`## ${sectionLabels[key] ?? key.replace(/-/g, ' ')}`);
    lines.push('');
    const entries = groups.get(key)!.sort((a, b) => a.title.localeCompare(b.title));
    for (const p of entries) {
      const desc = p.description ? `: ${p.description}` : '';
      lines.push(`- [${p.title}](${p.href})${desc}`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
