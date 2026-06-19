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
  const recentMicroblog = allMicroblog.slice(0, 10);

  const allDates = [
    ...allPosts.map((p) => p.createdAt),
    ...allMicroblog.map((p) => p.createdAt),
  ].filter(Boolean);

  return (
    <div className="home">
      <section className="home-grid">
        {/* Left column: Posts */}
        <div className="home-posts">
          <h2>Posts Recientes</h2>
          {recentPosts.length > 0 ? (
            <div className="posts-list">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="post-link">
                  <span>{post.title}</span>
                  <time>
                    {new Date(post.createdAt).toLocaleDateString("es-MX", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty">Próximamente...</p>
          )}
          <Link href="/blog" className="see-all">Ver todos →</Link>
        </div>

        {/* Right column: Microblog */}
        <div className="home-microblog">
          <h2>Microblog</h2>
          {recentMicroblog.length > 0 ? (
            <div className="microblog-timeline">
              {recentMicroblog.map((post, i) => (
                <div key={i} className="micro-entry">
                  <div className="micro-dot" />
                  <div className="micro-content">
                    <strong>{post.title}</strong>
                    {post.body && <p>{post.body.slice(0, 140)}{post.body.length > 140 ? "..." : ""}</p>}
                    <time>
                      {new Date(post.createdAt).toLocaleDateString("es-MX", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty">Próximamente...</p>
          )}
        </div>
      </section>

      {/* Full-width calendar */}
      <ContributionsCalendar postDates={allDates} />
    </div>
  );
}