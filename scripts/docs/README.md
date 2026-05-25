# Docs agent — deterministic toolchain

Self-contained workspace for the auto-documentation pipeline. Everything in
this folder is run by CI before (and after) the LLM agent step. The LLM only
fills in prose; structure, signatures, types, and diagrams come from here.

## What's in here

| Script | Purpose |
| --- | --- |
| `extract-skeleton.ts` | Walks the source trees with the TypeScript compiler API and emits one Markdown skeleton per file. Every exported symbol gets a `## <Name>` section with the real signature, params table, return type, and `<FILL: ...>` markers for prose. |
| `extract-diagrams.ts` | Generates Mermaid diagrams directly from code: module dependency graphs via `dependency-cruiser` and a React component tree via `ts-morph`. No LLM. |
| `check-coverage.ts` | Post-LLM gate. Re-walks the source tree and verifies every exported symbol has a `## <Name>` section in the corresponding doc. Exits non-zero with a structured report if anything is missing. |
| `config.ts` | Source roots, output location, ignore globs. |

## Usage

```bash
cd scripts/docs
npm install
npm run extract:all     # skeleton + diagrams
npm run check:coverage  # post-LLM gate (no-op until the agent has run)
```

Output lands under `_docs-out/` at the repo root for Phase-1 review.
The workflow will later point it at `docs-site/src/content/docs/`.

## Why this exists

Single-pass LLM documentation drifts: the agent forgets functions, invents
parameters, and writes plausible-but-wrong signatures. The two-pass
architecture splits the work:

1. **Deterministic pass (this folder)** extracts everything that can be wrong:
   symbols, signatures, types, props, parameters, dependencies, component
   tree, test list. Output is correct by construction.
2. **LLM pass** receives the skeleton plus the source and only adds prose,
   walkthroughs, examples, and per-function flow diagrams.
3. **Validation pass** (`check-coverage`) enforces that no symbol was lost.

This is what gets you "every exported function is documented" as a hard
guarantee rather than an aspiration.
