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
