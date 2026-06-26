// 404 page: friendly not-found with links back into the site.
import Link from "next/link";
import { getPosts } from "@/lib/content";

export default function NotFound() {
  const recentPosts = getPosts().slice(0, 3);

  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Esta página no existe... o se fue de vacaciones. 🏖️</p>
      <Link href="/" className="not-found-btn">Volver al inicio</Link>

      {recentPosts.length > 0 && (
        <div className="not-found-suggestions">
          <p>Tal vez te interese:</p>
          {recentPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="not-found-link">
              {post.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}