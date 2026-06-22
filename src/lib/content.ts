import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
    title: string;
    description: string;
    category: string;
    createdAt: string;
    slug: string;
    draft: boolean;
    image?: string;
    series?: string;
    seriesOrder?: number;
    wordCount: number;
    readingTime: number;
}

export interface MicroblogEntry {
    title: string;
    createdAt: string;
    body: string;
}

const postsDir = path.join(process.cwd(), "content/posts");
const microblogDir = path.join(process.cwd(), "content/microblog");

export function getPosts(): Post[] {
    if (!fs.existsSync(postsDir)) return [];

    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    const posts = files.map((file) => {
        const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
        const { data, content } = matter(raw);
        const wordCount = content.split(/\s+/).filter(Boolean).length;
        return {
            title: data.title || "",
            description: data.description || "",
            category: data.category || "",
            createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : "",
            slug: file.replace(/\.(mdx|md)$/, ""),
            draft: data.draft || false,
            image: data.image || undefined,
            series: data.series || undefined,
            seriesOrder: data.seriesOrder || undefined,
            wordCount,
            readingTime: Math.max(1, Math.ceil(wordCount / 200)),
        };
    });

    return posts
        .filter((p) => !p.draft && p.createdAt)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getMicroblog(): MicroblogEntry[] {
    if (!fs.existsSync(microblogDir)) return [];

    const files = fs.readdirSync(microblogDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    const posts = files.map((file) => {
        const raw = fs.readFileSync(path.join(microblogDir, file), "utf-8");
        const { data, content } = matter(raw);
        return {
            title: data.title || "",
            createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : "",
            body: content.trim(),
        };
    });

    return posts
        .filter((p) => p.createdAt)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllDates(): string[] {
    const posts = getPosts();
    const microblog = getMicroblog();
    return [
        ...posts.map((p) => p.createdAt),
        ...microblog.map((p) => p.createdAt),
    ].filter(Boolean);
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): Post[] {
    return getPosts()
        .filter((p) => p.slug !== currentSlug && p.category === category)
        .slice(0, limit);
}

export function getPostsInSeries(series: string): Post[] {
    return getPosts()
        .filter((p) => p.series === series)
        .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}

export function getSearchIndex(): { title: string; description: string; category: string; slug: string }[] {
    return getPosts().map((p) => ({
        title: p.title,
        description: p.description,
        category: p.category,
        slug: p.slug,
    }));
}