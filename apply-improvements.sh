#!/bin/bash
# eldanmtz improvements — run from the root of your project
# Usage: bash apply-improvements.sh

set -e

echo "🚀 Applying improvements to eldanmtz..."

# Create new files/directories
mkdir -p src/app/blog/\[filename\]
mkdir -p src/components

echo "📄 Writing src/app/layout.tsx..."
cat > src/app/layout.tsx << 'ENDOFFILE'
import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://eldanmtz.com"),
  title: {
    default: "Dan Mtz.",
    template: "%s",
  },
  description: "Blog personal — Tech, Cocina, Gaming y la vida.",
  openGraph: {
    title: "Dan Mtz.",
    description: "Blog personal — Tech, Cocina, Gaming y la vida.",
    url: "https://eldanmtz.com",
    siteName: "Dan Mtz.",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Dan Mtz.",
    description: "Blog personal — Tech, Cocina, Gaming y la vida.",
    creator: "@eldanmtz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://eldanmtz.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="site-wrapper">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
ENDOFFILE

echo "📄 Writing src/app/page.tsx..."
cat > src/app/page.tsx << 'ENDOFFILE'
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ContributionsCalendar } from "@/components/ContributionsCalendar";
import Link from "next/link";

function getPosts() {
  const postsDir = path.join(process.cwd(), "content/posts");
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data } = matter(raw);
    return {
      title: data.title || "",
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : "",
      slug: file.replace(/\.(mdx|md)$/, ""),
      draft: data.draft || false,
    };
  });

  return posts
    .filter((p) => !p.draft && p.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function getMicroblog() {
  const dir = path.join(process.cwd(), "content/microblog");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      title: data.title || "",
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : "",
      body: content.trim(),
    };
  });

  return posts
    .filter((p) => p.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export default function Home() {
  const allPosts = getPosts();
  const allMicroblog = getMicroblog();
  const recentPosts = allPosts.slice(0, 5);
  const recentMicroblog = allMicroblog.slice(0, 5);

  const allDates = [
    ...allPosts.map((p) => p.createdAt),
    ...allMicroblog.map((p) => p.createdAt),
  ].filter(Boolean);

  return (
    <div className="home">
      <section className="intro">
        <h1>Daniel Martinez</h1>
        <p>Support Engineer @ Atlassian</p>
      </section>

      <section className="recent-posts">
        <h2>Blog</h2>
        {recentPosts.length > 0 ? (
          recentPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="post-link">
              <span>{post.title}</span>
              <time>{new Date(post.createdAt).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}</time>
            </Link>
          ))
        ) : (
          <p className="empty">Próximamente...</p>
        )}
        <Link href="/blog" className="see-all">Ver todos →</Link>
      </section>

      <section className="microblog">
        <h2>Microblog</h2>
        {recentMicroblog.length > 0 ? (
          recentMicroblog.map((post, i) => (
            <div key={i} className="micro-entry">
              <strong>{post.title}</strong>
              <p>{post.body}</p>
              <time>{new Date(post.createdAt).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}</time>
            </div>
          ))
        ) : (
          <p className="empty">Próximamente...</p>
        )}
      </section>

      <ContributionsCalendar postDates={allDates} />
    </div>
  );
}
ENDOFFILE

echo "📄 Writing src/app/blog/page.tsx..."
cat > src/app/blog/page.tsx << 'ENDOFFILE'
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { BlogFilters } from "@/components/BlogFilters";

export const metadata: Metadata = {
  title: "Blog — Dan Mtz.",
  description: "Posts sobre tech, cocina, gaming, viajes y la vida.",
  openGraph: {
    title: "Blog — Dan Mtz.",
    description: "Posts sobre tech, cocina, gaming, viajes y la vida.",
    type: "website",
    url: "https://eldanmtz.com/blog",
  },
};

interface Post {
  title: string;
  description: string;
  category: string;
  createdAt: string;
  slug: string;
  draft: boolean;
}

function getPosts(): Post[] {
  const postsDir = path.join(process.cwd(), "content/posts");
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data } = matter(raw);
    return {
      title: data.title || "",
      description: data.description || "",
      category: data.category || "",
      createdAt: data.createdAt || "",
      slug: file.replace(/\.(mdx|md)$/, ""),
      draft: data.draft || false,
    };
  });

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export default function BlogPage() {
  const posts = getPosts();

  const grouped = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = new Date(post.createdAt).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const sortedYears = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="blog-page">
      <div className="blog-layout">
        <BlogFilters posts={posts} grouped={grouped} sortedYears={sortedYears} />
      </div>
    </div>
  );
}
ENDOFFILE

echo "📄 Writing src/app/blog/[filename]/page.tsx..."
cat > 'src/app/blog/[filename]/page.tsx' << 'ENDOFFILE'
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ filename: string }>;
}

const postsDir = path.join(process.cwd(), "content/posts");

export async function generateStaticParams() {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  return files.map((f) => ({ filename: f.replace(/\.mdx$/, "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { filename } = await params;
  const filePath = path.join(postsDir, `${filename}.mdx`);

  if (!fs.existsSync(filePath)) {
    return { title: "Post no encontrado — Dan Mtz." };
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  return {
    title: `${data.title} — Dan Mtz.`,
    description: data.description || `${data.title} — Blog de Dan Mtz.`,
    openGraph: {
      title: data.title,
      description: data.description || `${data.title} — Blog de Dan Mtz.`,
      type: "article",
      publishedTime: data.createdAt,
      url: `https://eldanmtz.com/blog/${filename}`,
      ...(data.image && { images: [{ url: data.image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description || `${data.title} — Blog de Dan Mtz.`,
      ...(data.image && { images: [data.image] }),
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { filename } = await params;
  const filePath = path.join(postsDir, `${filename}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description || "",
    datePublished: data.createdAt,
    author: {
      "@type": "Person",
      name: "Daniel Martinez",
      url: "https://eldanmtz.com",
    },
    publisher: {
      "@type": "Person",
      name: "Daniel Martinez",
    },
    url: `https://eldanmtz.com/blog/${filename}`,
    ...(data.image && { image: data.image }),
  };

  return (
    <article className="blog-post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/blog" className="back-link">← Volver al blog</Link>

      {data.image && <img src={data.image} alt={data.title} className="post-image" />}

      <h1>{data.title}</h1>

      <div className="post-meta">
        <time dateTime={data.createdAt}>
          {new Date(data.createdAt).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {data.category && <span className="post-category">{data.category}</span>}
      </div>

      <div className="post-content">
        <MDXRemote source={content} />
      </div>

      <section className="comments">
        <h3>Comentarios</h3>
        <p className="comments-placeholder">Coming soon...</p>
      </section>

      <nav className="post-nav">
        <Link href="/blog">← Todos los posts</Link>
        <a href="#top">↑ Subir</a>
      </nav>
    </article>
  );
}
ENDOFFILE

echo "📄 Writing src/app/sitemap.ts..."
cat > src/app/sitemap.ts << 'ENDOFFILE'
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eldanmtz.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/now`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const postsDir = path.join(process.cwd(), "content/posts");
  let blogPages: MetadataRoute.Sitemap = [];

  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
    blogPages = files.map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const { data } = matter(raw);
      const slug = file.replace(/\.(mdx|md)$/, "");
      return {
        url: `${baseUrl}/blog/${slug}`,
        lastModified: data.createdAt ? new Date(data.createdAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    });
  }

  return [...staticPages, ...blogPages];
}
ENDOFFILE

echo "📄 Writing src/app/robots.ts..."
cat > src/app/robots.ts << 'ENDOFFILE'
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: "https://eldanmtz.com/sitemap.xml",
  };
}
ENDOFFILE

echo "📄 Writing src/components/BlogFilters.tsx..."
cat > src/components/BlogFilters.tsx << 'ENDOFFILE'
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Post {
  title: string;
  description: string;
  category: string;
  createdAt: string;
  slug: string;
  draft: boolean;
}

interface BlogFiltersProps {
  posts: Post[];
  grouped: Record<string, Post[]>;
  sortedYears: string[];
}

const categories = [
  "Todas",
  "Recomendaciones",
  "Random",
  "Personal",
  "Cine y TV",
  "Juegos",
  "Viajes",
  "Tech",
  "Foodies",
  "Coding",
  "Connie",
];

function BlogFiltersInner({ posts }: BlogFiltersProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "Todas";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filtered =
    selectedCategory === "Todas"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const filteredGrouped = filtered.reduce<Record<string, Post[]>>((acc, post) => {
    const year = new Date(post.createdAt).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const filteredYears = Object.keys(filteredGrouped).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <aside className="blog-filters">
        <h3>Categorías</h3>
        <div className="category-list">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </aside>

      <div className="blog-posts">
        <h1>Blog</h1>
        {filteredYears.map((year) => (
          <div key={year} className="year-group">
            <h2 className="year-heading">{year}</h2>
            <div className="year-posts">
              {filteredGrouped[year].map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-post-item">
                  <div className="post-info">
                    <span className="post-title">{post.title}</span>
                    <span className="post-category">{post.category}</span>
                  </div>
                  <time>
                    {new Date(post.createdAt).toLocaleDateString("es-MX", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="empty">No hay posts en esta categoría.</p>}
      </div>
    </>
  );
}

export function BlogFilters(props: BlogFiltersProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogFiltersInner {...props} />
    </Suspense>
  );
}
ENDOFFILE

echo "📄 Writing src/components/Sidebar.tsx..."
cat > src/components/Sidebar.tsx << 'ENDOFFILE'
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MicroblogFeed } from "./MicroblogFeed";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/now", label: "Now", icon: "⚡" },
    { href: "/blog", label: "Blog", icon: "✍️" },
    { href: "/about", label: "About", icon: "👤" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <Link href="/" className="logo">
          Dan Mtz.
        </Link>

        <nav className="nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-heading">Microblog</h3>
        <MicroblogFeed />
      </div>

      <div className="sidebar-section socials">
        <a href="https://github.com/DanMartinezMx" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://x.com/eldanmtz" target="_blank" rel="noopener noreferrer">X</a>
      </div>
    </aside>
  );
}
ENDOFFILE

echo "📄 Writing src/components/ContributionsCalendar.tsx..."
cat > src/components/ContributionsCalendar.tsx << 'ENDOFFILE'
"use client";

import { useMemo } from "react";

interface CalendarProps {
  postDates: string[];
}

export function ContributionsCalendar({ postDates }: CalendarProps) {
  const { weekColumns } = useMemo(() => {
    const today = new Date();
    const weeks = 52;
    const days: { date: string; count: number }[] = [];

    for (let i = weeks * 7 - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = postDates.filter((d) => d.startsWith(dateStr)).length;
      days.push({ date: dateStr, count });
    }

    const weekColumns: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekColumns.push(days.slice(i, i + 7));
    }

    return { weekColumns };
  }, [postDates]);

  const getColor = (count: number) => {
    if (count === 0) return "var(--bg-tertiary)";
    if (count === 1) return "#2d5a3f";
    if (count === 2) return "#3d7a52";
    return "#4a9c6d";
  };

  return (
    <div className="calendar-wrapper">
      <h3 className="calendar-title">Actividad</h3>
      <div className="calendar-grid">
        {weekColumns.map((week, wi) => (
          <div key={wi} className="calendar-week">
            {week.map((day) => (
              <div
                key={day.date}
                className="calendar-day"
                title={`${day.date}: ${day.count} post${day.count !== 1 ? "s" : ""}`}
                style={{ background: getColor(day.count) }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
ENDOFFILE

echo "📄 Writing src/components/MicroblogFeed.tsx..."
cat > src/components/MicroblogFeed.tsx << 'ENDOFFILE'
"use client";

import { useEffect, useState } from "react";

interface MicroblogEntry {
  title: string;
  createdAt: string;
  slug: string;
}

export function MicroblogFeed() {
  const [entries, setEntries] = useState<MicroblogEntry[]>([]);

  useEffect(() => {
    fetch("/api/microblog")
      .then((res) => res.json())
      .then((data) => setEntries(data.slice(0, 10)))
      .catch(() => {});
  }, []);

  if (entries.length === 0) {
    return <p className="microblog-empty">No entries yet...</p>;
  }

  return (
    <div className="microblog-feed">
      {entries.map((entry) => (
        <div key={entry.slug} className="microblog-entry">
          <p className="microblog-text">{entry.title}</p>
          <time className="microblog-time">
            {new Date(entry.createdAt).toLocaleDateString("es-MX", {
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      ))}
    </div>
  );
}
ENDOFFILE

echo "📄 Writing src/components/Footer.tsx..."
cat > src/components/Footer.tsx << 'ENDOFFILE'
export function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} Dan Mtz.</p>
    </footer>
  );
}
ENDOFFILE

echo "📄 Writing src/app/api/posts/route.ts..."
cat > src/app/api/posts/route.ts << 'ENDOFFILE'
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");

export async function GET() {
  if (!fs.existsSync(postsDir)) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data } = matter(raw);
    return {
      title: data.title || "",
      description: data.description || "",
      category: data.category || "",
      createdAt: data.createdAt || "",
      slug: file.replace(/\.(mdx|md)$/, ""),
      draft: data.draft || false,
    };
  });

  const published = posts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(published, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
ENDOFFILE

echo "📄 Writing src/app/api/microblog/route.ts..."
cat > src/app/api/microblog/route.ts << 'ENDOFFILE'
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const microblogDir = path.join(process.cwd(), "content/microblog");

export async function GET() {
  if (!fs.existsSync(microblogDir)) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  }

  const files = fs.readdirSync(microblogDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(microblogDir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      title: data.title || "",
      createdAt: data.createdAt || "",
      body: content.trim(),
      slug: file.replace(/\.(mdx|md)$/, ""),
    };
  });

  posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(posts, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
ENDOFFILE

echo "📄 Writing next.config.ts..."
cat > next.config.ts << 'ENDOFFILE'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/index.html",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|gif|svg|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
ENDOFFILE

echo "📄 Writing package.json..."
cat > package.json << 'ENDOFFILE'
{
  "name": "eldanmtz",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "TINA_PUBLIC_IS_LOCAL=true tinacms dev -c \"next dev\"",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "date-fns": "^4.4.0",
    "gray-matter": "^4.0.3",
    "next": "16.2.9",
    "next-mdx-remote": "^6.0.0",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@tinacms/cli": "^2.5.1",
    "@types/node": "^20.19.43",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.9",
    "tailwindcss": "^4",
    "tinacms": "^3.9.3",
    "typescript": "^5"
  },
  "overrides": {
    "react-final-form": {
      "react": "$react",
      "react-dom": "$react-dom"
    }
  }
}
ENDOFFILE

echo ""
echo "✅ All files written!"
echo ""
echo "Now run:"
echo "  rm -rf node_modules package-lock.json .next"
echo "  npm install"
echo "  npm run build"
echo ""
echo "If the build passes:"
echo "  git add -A"
echo "  git commit -m 'feat: SEO, security headers, performance improvements'"
echo "  git push"
