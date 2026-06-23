import type { Metadata } from "next";
import { getDrafts } from "@/lib/content";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Borradores",
    robots: { index: false, follow: false },
};

export default function DraftsPage() {
    const drafts = getDrafts();

    return (
        <div className="blog-page">
            <h1>📝 Borradores</h1>
            <p className="drafts-notice">
                Esta página no es pública. Solo tú puedes verla en desarrollo local.
            </p>

            {drafts.length > 0 ? (
                <div className="blog-posts-grid">
                    {drafts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/drafts/${post.slug}`}
                            className="blog-post-card"
                        >
                            <div className="blog-post-card-top">
                                <span className="blog-post-card-category">{post.category || "Sin categoría"}</span>
                                <span className="draft-badge">Borrador</span>
                            </div>
                            <h3 className="blog-post-card-title">{post.title}</h3>
                            {post.description && (
                                <p className="blog-post-card-description">{post.description}</p>
                            )}
                            <div className="blog-post-card-footer">
                                <span>☕ {post.readingTime} min</span>
                                <span>{post.wordCount} palabras</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="empty">No hay borradores. ¡A escribir! ✍️</p>
            )}
        </div>
    );
}