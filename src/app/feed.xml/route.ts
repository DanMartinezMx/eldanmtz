import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET() {
  const postsDir = path.join(process.cwd(), "content/posts");
  const files = fs.existsSync(postsDir)
    ? fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    : [];

  const posts = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const { data } = matter(raw);
      return {
        title: data.title || "",
        description: data.description || "",
        slug: file.replace(/\.(mdx|md)$/, ""),
        date: data.createdAt || "",
      };
    })
    .filter((p) => p.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://eldanmtz.com/blog/${post.slug}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">https://eldanmtz.com/blog/${post.slug}</guid>
    </item>`
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>El Otro Tab</title>
    <link>https://eldanmtz.com</link>
    <description>Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.</description>
    <language>es-mx</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://eldanmtz.com/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}