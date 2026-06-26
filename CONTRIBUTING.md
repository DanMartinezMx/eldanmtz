# Contributing / Working on this blog

Practical, day-to-day guide. For *how the system fits together*, read
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md); for the stack/quick-start, the
[README](README.md).

## Setup

```bash
npm install
cp .env.example .env   # fill in only if you need Tina Cloud editing
npm run dev            # http://localhost:3000  (admin at /admin)
```

Requires Node 18.18+ (Node 20+ recommended; CI uses 22). For local-only editing
the `.env` values can stay empty.

## Everyday commands

| Command | What it does |
| --- | --- |
| `npm run dev` | TinaCMS + Next dev server |
| `npm run validate` | Validate post/microblog frontmatter |
| `npm run lint` | ESLint over the project |
| `npm test` | Unit tests (`node:test`) |
| `npm run build` | `validate` (prebuild) → build Tina → build Next |

Before pushing, the quickest confidence check mirrors CI:

```bash
npm run validate && npm run lint && npx tsc --noEmit && npm test
```

## Adding content

### A blog post

Create `content/posts/<slug>.mdx` (the filename becomes the URL slug) — or use the
Tina admin at `/admin`. Frontmatter:

```yaml
---
title: "Título del post"          # required
description: "Resumen para SEO"   # recommended
category: "Tech"                  # required — must be one of CATEGORIES (see below)
createdAt: 2026-06-20T00:00:00.000Z  # required (ISO)
updatedAt: 2026-06-21T00:00:00.000Z  # optional — shows "Actualizado el…"
image: "/uploads/cover.png"          # optional cover
series: "Mi Serie"                   # optional — groups related posts
seriesOrder: 1                       # optional — order within the series
draft: false                         # true = hidden from the public site
---

Cuerpo en MDX.
```

The body supports:

- **GFM**: tables, footnotes, strikethrough, task lists, autolinks.
- **Code blocks** with syntax highlighting + an automatic "Copiar" button.
- **Callouts**: `<Tip>`, `<Note>`, `<Warning>`, `<Danger>`, or `<Callout type="…">`.
- Headings `##`/`###` automatically build the table of contents (shown at 3+).

Reading time and word count are derived automatically.

### A microblog note

Create `content/microblog/<name>.mdx` with `title` + `createdAt` and a short body.
It appears in the homepage timeline (inline markdown is stripped in the preview).

### Adding a category

Categories are defined in **two** places that must match:

1. [`src/lib/config.ts`](src/lib/config.ts) → `CATEGORIES`
2. [`tina/config.ts`](tina/config.ts) → the `category` field `options`

Add the label to both; the slug is derived automatically (`categoryToSlug`).

### Images

Put images under `public/uploads/` (or upload via Tina) and reference them by
path (`/uploads/foo.png`). Local images render through `next/image`; external
`http(s)` images fall back to a plain `<img>`. See
[`mdx/MDXImage`](src/components/mdx/MDXImage.tsx).

### Drafts

Set `draft: true`. The post is hidden from the public site, sitemap, RSS, and
search, but previewable at `/drafts` (and `/drafts/<slug>`), which are `noindex`.
Flip to `draft: false` to publish.

## Code conventions

- **TypeScript**, strict. No `any` (ESLint enforces it).
- **Server components by default**; add `"use client"` only for interactivity, and
  fetch any dynamic data from a route handler so pages stay static.
- Match the surrounding style (indentation, naming). Keep content parsing in
  [`src/lib/content.ts`](src/lib/content.ts) rather than re-reading files in pages.
- ⚠️ **Customized Next.js** — before changing framework-level code, read the relevant
  guide in `node_modules/next/dist/docs/` (see [AGENTS.md](AGENTS.md)). After editing
  `next.config.ts`, restart the dev server.

## CI & deploy

- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs validate →
  lint → typecheck → test on every push and PR. Keep it green.
- **Deploy** is automatic on Vercel when `main` is pushed. `npm run build` validates
  content, builds the Tina admin into `public/admin`, then builds Next.js.
- New environment variables: add them (empty) to [`.env.example`](.env.example) and
  document them in the [README](README.md); set real values in the Vercel dashboard.
