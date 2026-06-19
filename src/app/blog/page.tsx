import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { BlogFilters } from "@/components/BlogFilters";


export const metadata: Metadata = {
  title: "Blog — El otro tab by Dan Mtz",
  description: "Posts sobre lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
  openGraph: {
    title: "Blog — El otro tab by Dan Mtz.",
    description: "Posts sobre lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
    type: "website",
    url: "https://eldanmtz.com/blog",
  },
};

interface Post {
  title: string;
  description: string;
  category: string;
  createdAt: string;
  slug: string;
  draft: boolean;
}

function getPosts(): Post[] {
  const postsDir = path.join(process.cwd(), "content/posts");
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data } = matter(raw);
    return {
      title: data.title || "",
      description: data.description || "",
      category: data.category || "",
      createdAt: data.createdAt || "",
      slug: file.replace(/\.(mdx|md)$/, ""),
      draft: data.draft || false,
    };
  });

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export default function BlogPage() {
  const posts = getPosts();

  const grouped = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = new Date(post.createdAt).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const sortedYears = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="blog-page">
      <div className="blog-layout">
        <BlogFilters posts={posts} grouped={grouped} sortedYears={sortedYears} />
      </div>
    </div>
  );
}
