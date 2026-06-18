import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eldanmtz.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/now`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const postsDir = path.join(process.cwd(), "content/posts");
  let blogPages: MetadataRoute.Sitemap = [];

  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
    blogPages = files.map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const { data } = matter(raw);
      const slug = file.replace(/\.(mdx|md)$/, "");
      return {
        url: `${baseUrl}/blog/${slug}`,
        lastModified: data.createdAt ? new Date(data.createdAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    });
  }

  return [...staticPages, ...blogPages];
}
