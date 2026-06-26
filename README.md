# eldanmtz.com

Personal blog — _Lo que pasa cuando cierras la laptop._

A statically-generated Next.js blog. Posts and microblog entries are MDX files
in [`content/`](content/), edited either by hand or through TinaCMS.

> **New here?** Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the whole
> thing fits together, and [CONTRIBUTING.md](CONTRIBUTING.md) for the day-to-day
> workflow (adding posts, running checks, deploying).

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Content:** MDX files with gray-matter frontmatter, rendered via `next-mdx-remote`
- **CMS:** TinaCMS (cloud + local editing)
- **Syntax highlighting:** `rehype-pretty-code` + Shiki
- **Styling:** plain CSS with custom properties (`src/app/globals.css`)
- **Analytics:** Vercel Analytics + Speed Insights
- **Hosting:** Vercel — **Domain:** eldanmtz.com

> **Note:** This project pins a customized build of Next.js. Before changing
> framework-level code, read the relevant guide under `node_modules/next/dist/docs/`
> (see [AGENTS.md](AGENTS.md)).

## Getting Started

### Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- npm

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root. For local-only editing (no Tina Cloud)
the defaults are fine and these can be left empty:

| Variable                     | Used by                | Notes                                              |
| ---------------------------- | ---------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_TINA_BRANCH`    | TinaCMS                | Git branch Tina edits. Defaults to `main`.         |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | TinaCMS Cloud          | Required for cloud editing / production admin.     |
| `TINA_TOKEN`                 | TinaCMS Cloud          | Required for cloud editing / production admin.     |
| `TINA_PUBLIC_IS_LOCAL`       | `dev` script           | Set automatically to `true` by `npm run dev`.      |

`.env` is git-ignored — never commit tokens.

### Develop

```bash
npm run dev
```

Runs the TinaCMS dev server wrapping `next dev`. The site is at
http://localhost:3000 and the editing UI at http://localhost:3000/admin.
Draft posts (`draft: true`) are previewable at `/drafts` (excluded from the
public site, sitemap, RSS, and search).

## Scripts

| Command            | What it does                                                             |
| ------------------ | ------------------------------------------------------------------------ |
| `npm run dev`      | Tina + Next dev server with local editing.                               |
| `npm run validate` | Validate post/microblog frontmatter (`scripts/validate-content.mjs`).    |
| `npm run build`    | Validate content (via `prebuild`), build Tina, then build Next.          |
| `npm start`        | Serve the production build.                                              |
| `npm run lint`     | Run ESLint.                                                              |

`prebuild` runs `validate` automatically, so a build fails fast on malformed
content (missing `title`/`createdAt`, invalid dates).

## Content Model

Content lives in [`content/`](content/) and is read at build time by
[`src/lib/content.ts`](src/lib/content.ts).

### Posts — `content/posts/*.mdx`

```yaml
---
title: "My Post"          # required
description: "Short SEO summary"
category: "Tech"          # required — one of the CATEGORIES in src/lib/config.ts
createdAt: 2026-06-20T00:00:00.000Z  # required (ISO date)
updatedAt: 2026-06-21T00:00:00.000Z  # optional
image: "/uploads/cover.png"          # optional cover image
series: "My Series"                  # optional — groups posts
seriesOrder: 1                       # optional — order within a series
draft: false                         # optional — true hides from the public site
---

MDX body. Supports `<Callout>`, `<Tip>`, `<Note>`, `<Warning>`, `<Danger>`
components and fenced code blocks with syntax highlighting.
```

Reading time and word count are derived automatically.

### Microblog — `content/microblog/*.mdx`

```yaml
---
title: "Quick thought"    # required
createdAt: 2026-06-19T10:00:00.000Z  # required
---

Short body shown in the homepage timeline.
```

The category list is the single source of truth in
[`src/lib/config.ts`](src/lib/config.ts) and must stay in sync with the
`category` field options in [`tina/config.ts`](tina/config.ts).

## Project Structure

```
src/
  app/            App Router routes (home, /blog, /now, /about, /drafts,
                  feed.xml, sitemap, robots, OG images)
  components/     UI components (Navigation, Search, TOC, calendar, MDX, …)
  lib/
    content.ts    Reads & parses MDX, derives posts/series (cached)
    headings.ts   TOC heading extraction + markdown stripping (pure, tested)
    config.ts     SITE_URL, CATEGORIES, reading-speed constants
content/          MDX posts + microblog entries
scripts/          validate-content.mjs (frontmatter checks)
tests/            Unit tests (node:test)
tina/             TinaCMS schema & generated client
docs/             ARCHITECTURE.md and other deep-dive docs
```

For the full picture — data flow, every route/component, conventions, and
gotchas — see **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

## Deployment

Deployed on Vercel. The default build command (`npm run build`) validates
content, builds the Tina admin into `public/admin`, then builds Next.js. Set the
Tina Cloud env vars in the Vercel project for production editing.
