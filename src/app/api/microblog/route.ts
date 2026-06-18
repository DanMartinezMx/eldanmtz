import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const microblogDir = path.join(process.cwd(), "content/microblog");

export async function GET() {
  if (!fs.existsSync(microblogDir)) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  }

  const files = fs.readdirSync(microblogDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(microblogDir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      title: data.title || "",
      createdAt: data.createdAt || "",
      body: content.trim(),
      slug: file.replace(/\.(mdx|md)$/, ""),
    };
  });

  posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(posts, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
