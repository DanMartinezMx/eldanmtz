"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Post {
    title: string;
    description: string;
    category: string;
    createdAt: string;
    slug: string;
    draft: boolean;
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

export default function BlogPage() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "Todas";
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetch("/api/posts")
            .then((res) => res.json())
            .then((data) => setPosts(data))
            .catch(() => { });
    }, []);

    const filtered =
        selectedCategory === "Todas"
            ? posts
            : posts.filter((p) => p.category === selectedCategory);

    // Group by year
    const grouped = filtered.reduce<Record<string, Post[]>>((acc, post) => {
        const year = new Date(post.createdAt).getFullYear().toString();
        if (!acc[year]) acc[year] = [];
        acc[year].push(post);
        return acc;
    }, {});

    const sortedYears = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

    return (
        <div className="blog-page">
            <div className="blog-layout">
                {/* Filters sidebar */}
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

                {/* Posts timeline */}
                <div className="blog-posts">
                    <h1>Blog</h1>
                    {sortedYears.map((year) => (
                        <div key={year} className="year-group">
                            <h2 className="year-heading">{year}</h2>
                            <div className="year-posts">
                                {grouped[year].map((post) => (
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
            </div>

            <style>{`
        .blog-layout {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 2rem;
        }
        .blog-filters h3 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }
        .category-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .category-btn {
          background: none;
          border: none;
          text-align: left;
          padding: 0.4rem 0.6rem;
          border-radius: 4px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .category-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .category-btn.active {
          background: var(--accent-dim);
          color: var(--accent);
        }
        .blog-posts h1 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .year-heading {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid var(--border);
        }
        .year-group {
          margin-bottom: 1.5rem;
        }
        .year-posts {
          display: flex;
          flex-direction: column;
        }
        .blog-post-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 0;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border);
        }
        .blog-post-item:hover {
          color: var(--accent);
        }
        .post-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .post-title {
          font-size: 0.9rem;
        }
        .post-category {
          font-size: 0.7rem;
          background: var(--bg-tertiary);
          padding: 0.15rem 0.5rem;
          border-radius: 3px;
          color: var(--text-muted);
        }
        .blog-post-item time {
          font-size: 0.8rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .empty {
          color: var(--text-muted);
        }
        @media (max-width: 768px) {
          .blog-layout {
            grid-template-columns: 1fr;
          }
          .blog-filters {
            order: -1;
          }
          .category-list {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }
      `}</style>
        </div>
    );
}