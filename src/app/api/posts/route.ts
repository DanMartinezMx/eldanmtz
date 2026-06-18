import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");

export async function GET() {
    if (!fs.existsSync(postsDir)) {
        return NextResponse.json([]);
    }

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

    const published = posts.filter((p) => !p.draft);
    return NextResponse.json(published);
}