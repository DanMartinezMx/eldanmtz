# Architecture

A tour of how **eldanmtz.com** is built, for anyone picking the project up. Pair
this with the [README](../README.md) (quick start) and [CONTRIBUTING](../CONTRIBUTING.md)
(day-to-day workflow).

## The idea in one paragraph

It's a **statically-generated personal blog**. All content (blog posts +
microblog notes) lives as **MDX files in [`content/`](../content/)** with
gray-matter frontmatter. At build time, [`src/lib/content.ts`](../src/lib/content.ts)
reads and parses those files into typed objects that the pages render. Editing
happens either by hand or through **TinaCMS** (`/admin`). There's no database for
content — the Git repo *is* the CMS.

> ⚠️ **This repo pins a customized build of Next.js.** Some APIs differ from the
> public docs. Before touching framework-level code, read the relevant guide in
> `node_modules/next/dist/docs/`. See [AGENTS.md](../AGENTS.md). Known differences
> we already hit: `revalidateTag(tag, profile)` (2-arg), `error.tsx` uses
> `unstable_retry` (not `reset`), and `Response.json(body, init)` wants the init arg.

## Tech stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router) + **React 19** | SSG-first; client components only where interactivity is needed |
| Content | **MDX** + `gray-matter` | rendered with `next-mdx-remote/rsc` |
| Markdown plugins | `remark-gfm`, `rehype-slug`, `rehype-pretty-code` (Shiki) | tables/footnotes, heading IDs, syntax highlighting |
| CMS | **TinaCMS** | local editing in dev; cloud editing in prod (`/admin`) |
| Styling | Plain **CSS** with custom properties | one file: [`globals.css`](../src/app/globals.css) |
| Analytics | Vercel Analytics + Speed Insights | |
| Hosting | **Vercel** | auto-deploy on push to `main` |

## Rendering model

- **Static by default.** Pages are prerendered at build time. `generateStaticParams`
  enumerates blog posts ([blog/[filename]](../src/app/blog/[filename]/page.tsx)) and
  category pages ([category](../src/app/blog/category/[category]/page.tsx)).
- **Server Components** do the data work (reading MDX from disk). **Client Components**
  (`"use client"`) handle interactivity (search, theme, TOC scroll-spy, etc.) and
  fetch any dynamic data from route handlers so pages stay static.
- Content reads are wrapped in React's `cache()` so a single render reads the
  content directory **once**, even though many helpers call `getPosts()`.

## Directory layout

```
content/                 MDX content (the "database")
  posts/*.mdx            Blog posts
  microblog/*.mdx        Short timeline notes
src/
  app/                   App Router routes (see "Routes" below)
  components/            UI components (see "Components" below)
  lib/
    content.ts           Read/parse MDX → typed Post objects (cached)
    headings.ts          TOC heading extraction + markdown stripping (pure, tested)
    config.ts            SITE_URL, CATEGORIES, WORDS_PER_MINUTE, categoryToSlug
scripts/
  validate-content.mjs   Frontmatter validation (runs on prebuild + in CI)
tests/
  headings.test.ts       Unit tests for headings.ts (node:test)
tina/                    TinaCMS schema (config.ts) + generated client (__generated__)
docs/                    This documentation
```

## Content pipeline (the heart of the app)

```
content/posts/*.mdx
   │  fs.readFileSync + gray-matter
   ▼
src/lib/content.ts  ──► readPostFiles() [cache()]  ──► Post[]  (getPosts / getDrafts / …)
   │                                                     │
   │ getPostBySlug(slug) → { data, content, wordCount, readingTime }
   ▼
blog/[filename]/page.tsx
   │  <MDXRemote source={content} components={mdxComponents}
   │     options={ remarkGfm, rehypeSlug, rehypePrettyCode } />
   ▼
rendered HTML  (+ TOC from extractHeadings, + copy buttons, + reading progress)
```

Key points:

- **One source of truth for parsing:** everything funnels through
  [`content.ts`](../src/lib/content.ts). `getPosts()` excludes drafts; `getDrafts()`
  returns only drafts; `getPostBySlug()` returns a single post's body + stats.
- **Headings/TOC contract:** [`headings.ts`](../src/lib/headings.ts) generates anchor
  IDs with `github-slugger` — the *same* library `rehype-slug` uses — so the TOC
  links match the rendered heading IDs (including accented Spanish text). This is
  covered by [`tests/headings.test.ts`](../tests/headings.test.ts); don't break it.
- **Drafts** (`draft: true`) are excluded from `getPosts()`, the sitemap, RSS, and
  search. They're previewable at `/drafts` (which is `noindex`), and `/blog/<slug>`
  hard-404s a draft so it can't leak onto the public URL.
- **Custom MDX components** are registered in
  [`components/mdx/index.tsx`](../src/components/mdx/index.tsx): `<Callout>` /
  `<Tip>` / `<Note>` / `<Warning>` / `<Danger>` and an image wrapper.

## Data layer — `src/lib/`

| Export (content.ts) | Returns |
| --- | --- |
| `getPosts()` | Published posts, newest first |
| `getDrafts()` | Draft posts, newest first |
| `getPostBySlug(slug)` | `{ data, content, wordCount, readingTime }` or `null` |
| `getAdjacentPosts(slug)` | `{ previous, next }` for post navigation |
| `getRelatedPosts(slug, category, n)` | Same-category posts |
| `getPostsInSeries(series)` / `getConnieSeries()` | Series ordering |
| `getMicroblog()` | Microblog entries, newest first |
| `getAllDates()` | All post + microblog dates (for the activity calendar) |
| `getSearchIndex()` | Lightweight `{title, description, category, slug}[]` |
| `extractHeadings(md)` / `stripInlineMarkdown(s)` | Re-exported from `headings.ts` |

`config.ts` holds the shared constants — notably **`CATEGORIES`**, which must stay
in sync with the `category` field options in [`tina/config.ts`](../tina/config.ts).

## Routes (`src/app/`)

| Route | File | Kind | Purpose |
| --- | --- | --- | --- |
| `/` | `page.tsx` | static | Home: recent posts, microblog, Connie series |
| `/blog` | `blog/page.tsx` | static | Index: category filter + posts grouped by year |
| `/blog/[filename]` | `blog/[filename]/page.tsx` | static (SSG) | A post: MDX, TOC, series, related, nav, share, subscribe |
| `/blog/[filename]` (OG) | `blog/[filename]/opengraph-image.tsx` | dynamic image | Per-post social card |
| `/blog/category/[category]` | `blog/category/[category]/page.tsx` | static (SSG) | Category archive |
| `/blog` (error) | `blog/error.tsx` | client | Error boundary (`unstable_retry`) |
| `/drafts`, `/drafts/[filename]` | `drafts/*` | static, `noindex` | Local draft previews |
| `/about` | `about/page.tsx` | static | Bio + "stack" |
| `/now` | `now/page.tsx` | static | "Enfoque" + activity calendar |
| `/feed.xml` | `feed.xml/route.ts` | route handler | RSS feed (published only) |
| `/sitemap.xml` | `sitemap.ts` | metadata route | Sitemap |
| `/robots.txt` | `robots.ts` | metadata route | Robots |
| `/search-index.json` | `search-index.json/route.ts` | route handler | Search index, fetched lazily by the search dialog |
| OG (site) | `opengraph-image.tsx` | dynamic image | Default social card |
| 404 | `not-found.tsx` | static | Not-found page |
| (layout) | `layout.tsx` | — | `<html>`, nav, footer, **pre-paint theme script**, analytics, site metadata |

## Components (`src/components/`)

| Component | Client? | Purpose |
| --- | --- | --- |
| `Navigation` | ✅ | Header: links, mobile menu, socials, search trigger |
| `ThemeToggle` | ✅ | Dark/light toggle (reads/writes the `data-theme` attribute) |
| `SearchDialog` | ✅ | ⌘K search; lazily fetches `/search-index.json`; keyboard-navigable |
| `BlogFilters` | ✅ | Category chips + year-grouped post grid |
| `ContributionsCalendar` | ✅ | GitHub-style activity heatmap (real calendar weeks) |
| `TableOfContents` | ✅ | TOC with IntersectionObserver scroll-spy |
| `ReadingProgress` | ✅ | Top scroll-progress bar |
| `CodeCopyButtons` | ✅ | Injects "copy" buttons into rendered code blocks |
| `PostNavigation` | server | Previous/next post links |
| `ConnieSection` | server | "Connie" series cards on the home page |
| `SubscribeCTA` | server | Buttondown newsletter form |
| `Footer` | server | Footer + RSS link |
| `mdx/index` | server | The `mdxComponents` map passed to `<MDXRemote>` |
| `mdx/Callout` | server | Callout/admonition boxes |
| `mdx/MDXImage` | server | `next/image` for local images, `<img>` for external |

## Styling & theming

- **One stylesheet:** [`globals.css`](../src/app/globals.css), organized by section
  with comment banners. Colors/spacing come from CSS custom properties on `:root`;
  light mode overrides via `[data-theme="light"]`.
- **No theme flash:** an inline script in [`layout.tsx`](../src/app/layout.tsx) sets
  `data-theme` from `localStorage` (or OS preference) *before paint*. `ThemeToggle`
  reads/writes that attribute via `useSyncExternalStore` (no `useEffect` setState).
- **Reduced motion:** a global `@media (prefers-reduced-motion: reduce)` block
  disables transitions/animations.

## SEO & metadata

- Site-wide defaults + Open Graph/Twitter in [`layout.tsx`](../src/app/layout.tsx);
  per-page `generateMetadata`.
- **JSON-LD** structured data on the home page (`WebSite`) and posts (`BlogPosting`
  + `BreadcrumbList`).
- Dynamic **OG images** via `next/og`. **Sitemap**, **robots**, and an **RSS feed**
  are all generated from `getPosts()`.

## Quality gates & CI

- [`scripts/validate-content.mjs`](../scripts/validate-content.mjs) checks frontmatter
  (required `title`/`createdAt`, valid dates). Runs automatically on **`prebuild`**,
  so a bad post fails the build early.
- **ESLint** (`eslint-config-next`), with generated output ignored
  ([`eslint.config.mjs`](../eslint.config.mjs): `tina/__generated__/**`, `public/**`).
- **Type-check:** `tsc --noEmit`. **Tests:** `node:test` via `npm test` (no test
  framework dependency).
- **GitHub Actions** ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)) runs
  validate → lint → typecheck → test on every push/PR.

## Security headers (`next.config.ts`)

A strict **Content-Security-Policy** plus `X-Frame-Options`, HSTS, etc. The public
site gets a tight CSP (no `unsafe-eval`); `/admin` gets a looser one TinaCMS needs,
layered as a later rule (last matching header wins). In `development` the permissive
policy applies everywhere so local Tina editing works. `form-action` allows
`buttondown.email` for the newsletter.

## Gotchas / things a newcomer should know

1. **Customized Next.js** — read `node_modules/next/dist/docs/` before framework
   changes (see the warning at the top).
2. **`CATEGORIES` lives in two places** — [`config.ts`](../src/lib/config.ts) and
   [`tina/config.ts`](../tina/config.ts). Keep them in sync.
3. **Heading slug contract** — keep `extractHeadings` using `github-slugger` so the
   TOC matches `rehype-slug`'s IDs. Tests guard this.
4. **Generated files** — `tina/__generated__/**` and `public/admin/**` are
   build/Tina output; they're git-/lint-ignored. Don't hand-edit.
5. **`.env` files** are git-ignored; document new vars in [`.env.example`](../.env.example)
   and the README.
6. After `next.config.ts` changes, **restart `npm run dev`** (config isn't hot-reloaded).
