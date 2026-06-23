import Link from "next/link";
import type { Post } from "@/lib/content";

interface ConnieSectionProps {
    posts: Post[];
}

export function ConnieSection({ posts }: ConnieSectionProps) {
    if (posts.length === 0) return null;

    return (
        <section className="connie-section">
            <div className="connie-header">
                <h2>📘 Guías Confluence Cloud</h2>
                <Link href="/blog/category/connie" className="see-all">Ver todas →</Link>
            </div>
            <div className="connie-grid">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="connie-card">
                        <span className="connie-card-title">{post.title}</span>
                        <p className="connie-card-description">
                            {post.description || `Guía sobre ${post.title}`}
                        </p>
                        <div className="connie-card-meta">
                            <time>
                                {new Date(post.createdAt).toLocaleDateString("es-MX", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    timeZone: "America/Mexico_City",
                                })}
                            </time>
                            <span>☕ {post.readingTime} min</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}