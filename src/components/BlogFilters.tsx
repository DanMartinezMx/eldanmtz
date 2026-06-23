"use client";

import { useState } from "react";
import Link from "next/link";

interface Post {
  title: string;
  description: string;
  category: string;
  createdAt: string;
  slug: string;
  readingTime: number;
}

interface BlogFiltersProps {
  posts: Post[];
  grouped: Record<string, Post[]>;
  sortedYears: string[];
}

export function BlogFilters({ posts, grouped, sortedYears }: BlogFiltersProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique categories from posts
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  // Filter posts by category
  const filteredGrouped = activeCategory
    ? Object.fromEntries(
      Object.entries(grouped).map(([year, yearPosts]) => [
        year,
        yearPosts.filter((p) => p.category === activeCategory),
      ]).filter(([, yearPosts]) => (yearPosts as Post[]).length > 0)
    )
    : grouped;

  const filteredYears = Object.keys(filteredGrouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="blog-filters-container">
      {/* Category filter chips */}
      <div className="blog-filter-chips">
        <button
          className={`filter-chip ${activeCategory === null ? "active" : ""}`}
          onClick={() => setActiveCategory(null)}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts grid by year */}
      {filteredYears.map((year) => (
        <section key={year} className="blog-year-section">
          <h2 className="blog-year-heading">{year}</h2>
          <div className="blog-posts-grid">
            {(filteredGrouped[year] as Post[]).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="blog-post-card"
              >
                <div className="blog-post-card-top">
                  <span className="blog-post-card-category">{post.category}</span>
                  <time>
                    {new Date(post.createdAt).toLocaleDateString("es-MX", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="blog-post-card-title">{post.title}</h3>
                {post.description && (
                  <p className="blog-post-card-description">
                    {post.description.length > 120
                      ? post.description.slice(0, 120) + "..."
                      : post.description}
                  </p>
                )}
                <div className="blog-post-card-footer">
                  <span>☕ {post.readingTime} min</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {filteredYears.length === 0 && (
        <p className="empty">No hay posts en esta categoría todavía.</p>
      )}
    </div>
  );
}