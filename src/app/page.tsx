import { client } from "@/lib/tina";
import { ContributionsCalendar } from "@/components/ContributionsCalendar";
import Link from "next/link";

async function getPosts() {
  try {
    const res = await client.queries.postConnection({
      sort: "createdAt",
      last: 10,
      filter: { draft: { eq: false } },
    });
    return res.data.postConnection.edges?.map((e) => e?.node) || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();
  const postDates = posts.map((p) => p?.createdAt || "").filter(Boolean);

  return (
    <div className="home">
      {/* Intro */}
      <section className="intro">
        <h1>Hola, soy Dan 👋</h1>
        <p>
          Escribo sobre tech, cocina, gaming, viajes y la vida en general.
          Bienvenido a mi rincón del internet.
        </p>
      </section>

      {/* Half and half layout */}
      <section className="split-layout">
        <div className="split-left">
          <h2>Escritos recientes</h2>
          <div className="recent-posts">
            {posts.length === 0 && <p className="empty">Próximamente...</p>}
            {posts.map((post) => (
              <Link
                key={post?._sys.filename}
                href={`/blog/${post?._sys.filename}`}
                className="recent-post"
              >
                <span className="post-title">{post?.title}</span>
                <time>
                  {post?.createdAt
                    ? new Date(post.createdAt).toLocaleDateString("es-MX", {
                      month: "short",
                      day: "numeric",
                    })
                    : ""}
                </time>
              </Link>
            ))}
          </div>
        </div>

        <div className="split-right">
          <h2>Mi vida</h2>
          <div className="life-links">
            <Link href="/now" className="life-link">⚡ Now</Link>
            <Link href="/blog?category=Personal" className="life-link">📝 Personal</Link>
            <Link href="/about" className="life-link">👤 Sobre mí</Link>
          </div>
        </div>
      </section>

      {/* Contributions Calendar */}
      <ContributionsCalendar postDates={postDates} />

      <style>{`
        .home {
          max-width: 800px;
        }
        .intro h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .intro p {
          color: var(--text-secondary);
          font-size: 1.05rem;
          margin-bottom: 2.5rem;
        }
        .split-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 2rem;
        }
        .split-layout h2 {
          font-size: 1rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .recent-posts {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .recent-post {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border);
          color: var(--text-primary);
        }
        .recent-post:hover {
          color: var(--accent);
        }
        .recent-post time {
          font-size: 0.8rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .post-title {
          font-size: 0.9rem;
        }
        .life-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .life-link {
          padding: 0.6rem 0.75rem;
          background: var(--bg-tertiary);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.9rem;
          transition: background 0.15s;
        }
        .life-link:hover {
          background: var(--bg-hover);
          color: var(--accent);
        }
        .empty {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .split-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
}