import { getPosts, getMicroblog, getAllDates } from "@/lib/content";
import { ContributionsCalendar } from "@/components/ContributionsCalendar";
import { ConnieSection } from "@/components/ConnieSection";
import Link from "next/link";

export default function Home() {
  const allPosts = getPosts();
  const allMicroblog = getMicroblog();
  const recentPosts = allPosts.slice(0, 6);
  const recentMicroblog = allMicroblog.slice(0, 10);
  const allDates = getAllDates();

  // Latest 3 Connie posts
  const conniePosts = allPosts.filter((p) => p.category === "Connie").slice(0, 3);

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

      {/* Posts Recientes — card grid */}
      <section className="home-recent">
        <div className="section-header">
          <h2>Posts Recientes</h2>
          <Link href="/blog" className="see-all">Ver todos →</Link>
        </div>
        {recentPosts.length > 0 ? (
          <div className="recent-grid">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="recent-card">
                <div className="recent-card-top">
                  <span className="recent-card-category">{post.category}</span>
                  <time>
                    {new Date(post.createdAt).toLocaleDateString("es-MX", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="recent-card-title">{post.title}</h3>
                {post.description && (
                  <p className="recent-card-description">
                    {post.description.length > 100
                      ? post.description.slice(0, 100) + "..."
                      : post.description}
                  </p>
                )}
                <div className="recent-card-footer">
                  <span>☕ {post.readingTime} min de lectura</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty">Próximamente...</p>
        )}
      </section>

      {/* Microblog */}
      <section className="home-microblog-section">
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
      </section>

      {/* Full-width calendar */}
      <ContributionsCalendar postDates={allDates} />

      {/* Connie guides section */}
      <ConnieSection posts={conniePosts} />
    </div>
  );
}