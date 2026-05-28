# Auto-updating, versioned documentation — setup guide

How to give any GitHub project the same documentation system as this repo:
a Starlight docs site that **documents your code automatically**, embeds
**Figma designs**, deploys to **GitHub Pages**, and keeps **frozen versions**.

---

## What you're building

| Piece | What it does |
|-------|--------------|
| `docs-site/` | The Starlight (Astro) documentation website |
| `.github/workflows/docs.yml` | The AI docs agent — reads your code, writes the docs, builds & deploys |
| `.github/workflows/trigger-docs.yml` | Fires the docs agent whenever you push code |
| `.github/workflows/version-docs.yml` | Freezes a version snapshot (on a `v*` tag, every 10 days, or manually) |
| `.github/workflows/figma-pr-check.yml` | *(Optional)* Requires a Figma link in every PR |

The live docs are plain Markdown in `docs-site/src/content/docs/`. The agent
rewrites them; the site builds them into HTML on GitHub Pages.

---

## Prerequisites

- A GitHub repo for the project you want to document.
- A **Claude Code OAuth token** for the `CLAUDE_CODE_OAUTH_TOKEN` secret — the
  docs agent runs on `anthropics/claude-code-action`. Follow that action's
  README to generate the token (typically `claude setup-token` in the Claude
  Code CLI).
- *(Optional)* A **Figma API key**, if you want designs pulled into the docs.
- Node 22 locally, if you want to preview the site before pushing.

---

## Step 1 — Copy the docs site

Copy the whole `docs-site/` folder from this repo into the **root** of your new
project, then clear this project's content so you start clean:

- Delete everything inside `docs-site/src/content/docs/` **except** a minimal
  `index.mdx` (Starlight needs a homepage so the site builds; the agent refills
  the rest).
- Delete `docs-site/src/content/versions/` and any numbered version folders
  like `docs-site/src/content/docs/2.0/` if present.
- Empty `docs-site/public/figma/`.
- Keep `docs-site/versions.json` as exactly `[]`.
- Delete the build junk: `docs-site/node_modules/`, `docs-site/dist/`,
  `docs-site/.astro/`.

---

## Step 2 — Point the docs site at your project

Edit `docs-site/astro.config.mjs`:

```js
site: 'https://<your-github-username>.github.io',
base: '/<your-repo-name>',
```

Inside the `starlight({ ... })` block also update `title`, `description`, the
`social` GitHub `href`, and `editLink.baseUrl`.

This repo uses a custom stylesheet (`customCss: ['./src/styles/snabbit.css']`).
Either copy `docs-site/src/styles/` across too, or remove that line.

Edit `docs-site/package.json` → change `name`.

> If your site is a **user site** (`https://username.github.io`, no repo path),
> set `base: '/'` instead.

---

## Step 3 — Copy the workflows

Copy these from `.github/workflows/` into the new repo's `.github/workflows/`:

- `docs.yml`
- `trigger-docs.yml`
- `version-docs.yml`
- `figma-pr-check.yml` — skip if you don't want the Figma gate.

**Do not copy** `.github/docs-agent-state` or `.github/docs-version-state`.
Those are state markers tied to this repo; starting without them makes the
first docs run a full build.

---

## Step 4 — Point the workflows at your source code

This is the most important retargeting. The workflows assume your code lives in
`src/` and `server/`. Change that to wherever **your** code actually lives.

**`trigger-docs.yml`** — the `paths:` filter decides what counts as a code
change worth re-documenting:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/**'        # <- change to your source folders
      - 'server/**'
```

**`docs.yml`** — three places:

1. The *"Determine documentation scope"* step:
   `git diff --name-only "$LAST_SHA" HEAD -- src server` — change `src server`
   to your source folders.
2. The agent **prompt** — it describes the project as a "React frontend /
   Express API" and refers to `src/` and `server/src/`. Rewrite that
   description to match your stack and folder layout.
3. The Figma image URL in the prompt
   (`https://gunashekharp.github.io/sdlc-sample-worflow/figma/...`) — change to
   your Pages URL. *(Skip if not using Figma.)*

`version-docs.yml` and `figma-pr-check.yml` need **no changes** — they're
generic.

---

## Step 5 — Add the secrets

In the new repo: **Settings → Secrets and variables → Actions → New repository
secret**.

- `CLAUDE_CODE_OAUTH_TOKEN` — required. Powers the docs agent.
- `FIGMA_API_KEY` — only if you're using Figma.
- `GITHUB_TOKEN` is provided automatically — nothing to add.

---

## Step 6 — Enable GitHub Pages

**Settings → Pages → Build and deployment → Source: GitHub Actions.**

Confirm `site` + `base` in `astro.config.mjs` match the URL Pages assigns you.

---

## Step 7 — First run

Push everything to `main`, then:

1. Go to **Actions → "Docs agent — update and deploy" → Run workflow**, and
   tick **full_rebuild** so the agent documents the whole codebase the first
   time.
2. It reads your code, writes the docs, commits them, builds the site, and
   deploys to Pages.
3. After that it runs on its own — every 4 hours, and on every push to your
   source folders (via `trigger-docs.yml`).

---

## Step 8 — *(Optional)* Figma designs

Already wired if you copied `figma-pr-check.yml` and set `FIGMA_API_KEY`. How it
works: put a `figma.com` link in a PR description; when the PR merges, the docs
agent exports that design into `docs-site/public/figma/` and embeds it on the
docs page for the code that PR changed.

One rule to keep: Figma images must be embedded with a **full `https://` URL**,
not a root-relative path — otherwise versioning can't relocate them. The prompt
already does this; just keep your Pages URL correct.

---

## Step 9 — *(Optional)* Branch protection

To actually *enforce* the Figma check: **Settings → Rules / Branch protection**
→ require the status check from `figma-pr-check.yml` (it appears as
`figma-link`). Add `github-actions` to the bypass list so the docs-bot can
still push its automated commits.

---

## Step 10 — Versioning — how to use it

Versioning is active as soon as `version-docs.yml` is in place. The live docs
in `src/content/docs/` are **"Latest"**. To freeze a snapshot:

- **Release tag:** `git tag v1.0 && git push origin v1.0`
- **Automatic:** it self-freezes every 10 days.
- **Manual:** Actions → "Freeze docs version" → Run workflow.

Each freeze adds an entry to the version-picker dropdown on the site. Frozen
versions are never modified again — the docs agent only ever touches "Latest".

---

## Quick checklist

- [ ] `docs-site/` copied, old content cleared, `versions.json` = `[]`
- [ ] `astro.config.mjs`: `site`, `base`, `title`, `editLink`, etc. updated
- [ ] 4 workflows copied; marker files **not** copied
- [ ] `trigger-docs.yml` paths + `docs.yml` scope/prompt retargeted to your source folders
- [ ] `CLAUDE_CODE_OAUTH_TOKEN` (and `FIGMA_API_KEY`) secrets set
- [ ] Pages → Source = GitHub Actions
- [ ] First run done with **full_rebuild** ticked

---

## Gotchas — things that bite people

- **`site` / `base` must match the repo name**, or every link 404s.
- **Scheduled and versioning workflows only run from the default branch**
  (`main`) — they do nothing on feature branches.
- **The docs agent prompt is project-specific.** Skip retargeting it and it
  will describe the wrong stack.
- **Don't copy the marker files.** A stale `docs-agent-state` SHA from this
  repo would confuse the scope step in the new project.
- **Node 22** — the workflows pin it; keep it.
- `docs.yml` and `version-docs.yml` share `concurrency: group: docs` so they
  never push to `main` at the same time — keep that as-is.
- The docs agent only documents code under the source folders you configured —
  if a folder isn't listed, its code won't be documented.
