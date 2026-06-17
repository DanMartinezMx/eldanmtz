import { client } from "@/lib/tina";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Link from "next/link";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;

    let post: any;
    try {
        const res = await client.queries.post({ relativePath: `${slug}.mdx` });
        post = res.data.post;
    } catch {
        return <div>Post not found</div>;
    }

    return (
        <article className="blog-post">
            <Link href="/blog" className="back-link">← Volver al blog</Link>

            {post.image && (
                <img src={post.image} alt={post.title} className="post-image" />
            )}

            <h1>{post.title}</h1>

            <div className="post-meta">
                <time>
                    {new Date(post.createdAt).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </time>
                <span className="post-category">{post.category}</span>
            </div>

            <div className="post-content">
                <TinaMarkdown content={post.body} />
            </div>

            {/* Comment section placeholder */}
            <section className="comments">
                <h3>Comentarios</h3>
                <p className="comments-placeholder">
                    {/* Add Giscus, Waline, or Disqus here */}
                    Coming soon...
                </p>
            </section>

            <nav className="post-nav">
                <Link href="/blog">← Todos los posts</Link>
                <a href="#top">↑ Subir</a>
            </nav>

            <style>{`
        .blog-post {
          max-width: 700px;
        }
        .back-link {
          display: inline-block;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .back-link:hover {
          color: var(--accent);
        }
        .post-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        .blog-post h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .post-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .post-category {
          background: var(--bg-tertiary);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
        }
        .post-content {
          line-height: 1.8;
          font-size: 1rem;
        }
        .post-content h2 {
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .post-content p {
          margin-bottom: 1rem;
        }
        .post-content code {
          background: var(--bg-tertiary);
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          font-size: 0.9em;
        }
        .post-content pre {
          background: var(--bg-secondary);
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .comments {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }
        .comments h3 {
          margin-bottom: 1rem;
        }
        .comments-placeholder {
          color: var(--text-muted);
        }
        .post-nav {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          font-size: 0.85rem;
        }
      `}</style>
        </article>
    );
}