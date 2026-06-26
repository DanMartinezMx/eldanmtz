// Blog index (/blog): groups published posts by year and renders the category filter.
import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { BlogFilters } from "@/components/BlogFilters";

export const metadata: Metadata = {
  title: "Blog",
  description: "Posts sobre lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
  alternates: {
    canonical: "https://eldanmtz.com/blog",
  },
  openGraph: {
    title: "Blog — El otro Tab",
    description: "Posts sobre lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
    type: "website",
    url: "https://eldanmtz.com/blog",
  },
};

export default function BlogPage() {
  const posts = getPosts();

  const grouped = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = new Date(post.createdAt).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  return (
    <div className="blog-page">
      <div className="blog-layout">
        <BlogFilters posts={posts} grouped={grouped} />
      </div>
    </div>
  );
}