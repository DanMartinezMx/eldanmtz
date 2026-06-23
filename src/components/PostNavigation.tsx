import Link from "next/link";

interface PostNavProps {
    previousPost: { slug: string; title: string } | null;
    nextPost: { slug: string; title: string } | null;
}

export function PostNavigation({ previousPost, nextPost }: PostNavProps) {
    if (!previousPost && !nextPost) return null;

    return (
        <nav className="post-pagination">
            <div className="post-pagination-item">
                {previousPost && (
                    <Link href={`/blog/${previousPost.slug}`} className="post-pagination-link prev">
                        <span className="post-pagination-label">← Anterior</span>
                        <span className="post-pagination-title">{previousPost.title}</span>
                    </Link>
                )}
            </div>
            <div className="post-pagination-item">
                {nextPost && (
                    <Link href={`/blog/${nextPost.slug}`} className="post-pagination-link next">
                        <span className="post-pagination-label">Siguiente →</span>
                        <span className="post-pagination-title">{nextPost.title}</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}