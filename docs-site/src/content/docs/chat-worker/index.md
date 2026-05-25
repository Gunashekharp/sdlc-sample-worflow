---
title: index
description: Reference for `chat-worker/src/index.js`
---

**File:** `chat-worker/src/index.js` · **Lines:** 157

> Cloudflare Worker — the chatbot backend for the Snabbit docs site.
> Stateless: it receives a question (plus recent chat history for context),
> keyword-searches the bundled docs index, asks the Anthropic API (Claude
> Haiku 4.5) to answer using only the matched docs, and returns the answer +

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `../docs-index.json` | `default as INDEX` | internal |


:::caution
No exported symbols detected by the AST. This file is likely a side-effect entrypoint, re-export barrel, or runtime bootstrap. The source appendix below contains the full file.
:::

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->

## Source

Full file source for `chat-worker/src/index.js` (157 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (157 lines)</summary>

````js
/**
 * Cloudflare Worker — the chatbot backend for the Snabbit docs site.
 *
 * Stateless: it receives a question (plus recent chat history for context),
 * keyword-searches the bundled docs index, asks the Anthropic API (Claude
 * Haiku 4.5) to answer using only the matched docs, and returns the answer +
 * source links.
 *
 * The conversation is NOT stored here — the browser keeps it (session memory)
 * and sends recent turns with each request. The Anthropic API key lives only
 * as a Wrangler secret on the Worker; it never reaches the browser.
 *
 * Deploy:           npm install && npm run deploy
 * Set the key once: npx wrangler secret put ANTHROPIC_API_KEY
 */
import INDEX from '../docs-index.json';

// Anthropic model that writes the answers.
const MODEL = 'claude-haiku-4-5-20251001';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

// How many doc chunks to feed the model as grounding context.
const TOP_K = 6;

const SYSTEM_PROMPT = `You are the documentation assistant for the Snabbit Agent Console.
Answer the user's question using ONLY the documentation excerpts provided below.
If the answer is not in the excerpts, say you could not find it in the docs and
suggest rephrasing. Be concise and accurate. Never invent APIs or behaviour.`;

const STOP_WORDS = new Set(
  'a an the of to in is are and or for on at it this that with as be by from how what when which do does'.split(' '),
);

function tokenize(s) {
  return (s.toLowerCase().match(/[a-z0-9]+/g) || []).filter(
    (w) => w.length > 1 && !STOP_WORDS.has(w),
  );
}

/** Keyword-score every chunk against the question; return the best TOP_K. */
function search(question) {
  const terms = tokenize(question);
  if (!terms.length) return [];
  const scored = INDEX.map((chunk) => {
    const text = (chunk.title + ' ' + chunk.heading + ' ' + chunk.text).toLowerCase();
    const titleText = (chunk.title + ' ' + chunk.heading).toLowerCase();
    let score = 0;
    for (const t of terms) {
      score += text.split(t).length - 1; // matches anywhere
      score += (titleText.split(t).length - 1) * 4; // weight title/heading
    }
    return { chunk, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K)
    .map((s) => s.chunk);
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405);

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const question = (payload.question || '').toString().trim();
    if (!question) return json({ error: 'Missing "question"' }, 400);

    // Recent conversation turns sent by the browser (session memory).
    const history = Array.isArray(payload.history) ? payload.history.slice(-6) : [];

    const hits = search(question);
    if (!hits.length) {
      return json({
        answer:
          "I couldn't find anything about that in the documentation. Try rephrasing your question.",
        sources: [],
      });
    }

    const context = hits
      .map((c, i) => `[Doc ${i + 1}] ${c.title} — ${c.heading}\n${c.text}\n(URL: ${c.url})`)
      .join('\n\n');

    // Anthropic keeps the system prompt separate from the message turns.
    const system = `${SYSTEM_PROMPT}\n\nDOCUMENTATION EXCERPTS:\n${context}`;

    const messages = [
      ...history
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && m.content)
        .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) })),
      { role: 'user', content: question },
    ];
    // The Messages API requires the first turn to come from the user.
    while (messages.length && messages[0].role === 'assistant') messages.shift();

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'Server is missing its ANTHROPIC_API_KEY secret' }, 500);
    }

    let answer;
    try {
      const resp = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': ANTHROPIC_VERSION,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ model: MODEL, max_tokens: 600, system, messages }),
      });
      if (!resp.ok) {
        const detail = await resp.text();
        return json({ error: 'AI request failed', detail }, 502);
      }
      const result = await resp.json();
      answer =
        (result.content?.[0]?.text || '').trim() ||
        "I couldn't generate an answer just now.";
    } catch (err) {
      return json({ error: 'AI request failed', detail: String(err) }, 502);
    }

    // De-duplicate sources by URL, preserving relevance order.
    const seen = new Set();
    const sources = [];
    for (const c of hits) {
      if (seen.has(c.url)) continue;
      seen.add(c.url);
      sources.push({ title: c.title, url: c.url });
    }

    return json({ answer, sources });
  },
};

````

</details>
