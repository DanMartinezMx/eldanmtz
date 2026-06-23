import { getPosts } from "@/lib/content";
import type { MetadataRoute } from "next";

const VALID_CATEGORIES = [
  "Tech", "Coding", "Gaming", "Foodies", "Cine y TV",
  "Viajes", "Personal", "Random", "Recomendaciones", "Connie",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eldanmtz.com";
  const posts = getPosts();

  const latestPostDate = posts.length > 0 ? new Date(posts[0].createdAt) : new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: latestPostDate, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: latestPostDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/now`, lastModified: new Date("2026-06-22"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date("2026-06-22"), changeFrequency: "monthly", priority: 0.6 },
  ];

  // Category archive pages (only include categories that have posts)
  const categoriesWithPosts = VALID_CATEGORIES.filter(
    (cat) => posts.some((p) => p.category === cat)
  );

  const categoryPages: MetadataRoute.Sitemap = categoriesWithPosts.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.toLowerCase().replace(/ /g, "-")}`,
    lastModified: latestPostDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}