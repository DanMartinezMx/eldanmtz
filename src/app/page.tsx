import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ContributionsCalendar } from "@/components/ContributionsCalendar";
import Link from "next/link";

function getPosts(limit?: number) {
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

  const published = posts
    .filter((p) => !p.draft && p.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return limit ? published.slice(0, limit) : published;
}

function getMicroblog(limit?: number) {
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

  const sorted = posts
    .filter((p) => p.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return limit ? sorted.slice(0, limit) : sorted;
}

export default function Home() {
  const recentPosts = getPosts(5);
  const recentMicroblog = getMicroblog(5);

  // All dates for the contributions calendar
  const allDates = [
    ...getPosts().map((p) => p.createdAt),
    ...getMicroblog().map((p) => p.createdAt),
  ].filter(Boolean);

  return (
    <div className="home">
      <section className="intro">
        <h1>Daniel Martinez</h1>
        <p>Support Engineer @ Atlassian</p>
      </section>

      <section className="recent-posts">
        <h2>Blog</h2>
        {recentPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="post-link">
            <span>{post.title}</span>
            <time>{new Date(post.createdAt).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}</time>
          </Link>
        ))}
        <Link href="/blog" className="see-all">Ver todos →</Link>
      </section>

      <section className="microblog">
        <h2>Microblog</h2>
        {recentMicroblog.map((post, i) => (
          <div key={i} className="micro-entry">
            <strong>{post.title}</strong>
            <p>{post.body}</p>
            <time>{new Date(post.createdAt).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}</time>
          </div>
        ))}
      </section>

      <ContributionsCalendar postDates={allDates} />
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