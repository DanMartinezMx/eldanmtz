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
