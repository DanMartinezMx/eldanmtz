# eldanmtz.com


## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Content:** MDX files with gray-matter frontmatter
- **Styling:** CSS custom properties + Tailwind (coming soon)
- **CMS:** TinaCMS (local dev editing)
- **Hosting:** Vercel
- **Domain:** eldanmtz.com

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server (with TinaCMS local editing)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── blog/           # Blog listing + individual posts
│   ├── about/          # About page
│   ├── now/            # Now page
│   ├── feed.xml/       # RSS feed
│   ├── sitemap.ts      # Auto-generated sitemap
│   ├── robots.ts       # robots.txt
│   ├── not-found.tsx   # Custom 404
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   └── globals.css     # All styles
├── components/
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   ├── BlogFilters.tsx
│   └── ContributionsCalendar.tsx
content/
├── posts/              # Blog posts (MDX)
└── microblog/          # Microblog entries (MDX)
```

## Content

Blog posts live in `content/posts/` as `.mdx` files with frontmatter:

```yaml
---
title: "Post Title"
description: "Short description"
category: "tech"
createdAt: "2025-06-15"
draft: false
---
```

## Deployment

Push to `main` → Vercel auto-deploys.

## License

MIT
