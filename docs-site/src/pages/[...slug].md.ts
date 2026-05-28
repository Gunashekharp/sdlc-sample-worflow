/**
 * /<slug>.md — serves any documentation page as plain Markdown for AI tools.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getCollection('docs');
  return docs.map((entry) => {
    const slug = entry.id.replace(/\.(md|mdx)$/, '');
    return { params: { slug }, props: { entry } };
  });
};

function stripFrontmatter(s: string) { return s.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ''); }
function stripLeadingImports(s: string) { return s.replace(/^(\s*import\s+[^;]+;\s*\r?\n)+/g, '').trimStart(); }

export const GET: APIRoute = ({ props }) => {
  const entry = props.entry as Awaited<ReturnType<typeof getCollection<'docs'>>>[number];
  const fm = [
    '---',
    `title: ${JSON.stringify(entry.data.title ?? '')}`,
    entry.data.description ? `description: ${JSON.stringify(entry.data.description)}` : '',
    '---',
    '',
  ].filter(Boolean).join('\n');
  const body = stripLeadingImports(stripFrontmatter(entry.body ?? ''));
  return new Response(fm + '\n' + body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
