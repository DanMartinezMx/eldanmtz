import { getPosts, getMicroblog, getAllDates } from "@/lib/content";
import { ContributionsCalendar } from "@/components/ContributionsCalendar";
import Link from "next/link";

export default function Home() {
  const allPosts = getPosts();
  const allMicroblog = getMicroblog();
  const recentPosts = allPosts.slice(0, 5);
  const recentMicroblog = allMicroblog.slice(0, 10);
  const allDates = getAllDates();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "El otro Tab",
    url: "https://eldanmtz.com",
    description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
    author: {
      "@type": "Person",
      name: "Dan Martinez",
      url: "https://eldanmtz.com/about",
      sameAs: [
        "https://instagram.com/eldanmtz",
        "https://youtube.com/@eldanmtz",
        "https://tiktok.com/@eldanmtz",
        "https://github.com/DanMartinezMx",
      ],
    },
    inLanguage: "es-MX",
  };

  return (
    <div className="home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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