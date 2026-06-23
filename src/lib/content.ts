import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
    title: string;
    description: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    draft: boolean;
    image?: string;
    series?: string;
    seriesOrder?: number;
    wordCount: number;
    readingTime: number;
}

interface MicroblogEntry {
    title: string;
    body: string;
    createdAt: string;
}

const postsDir = path.join(process.cwd(), "content/posts");
const microblogDir = path.join(process.cwd(), "content/microblog");

export function getPosts(): Post[] {
    if (!fs.existsSync(postsDir)) return [];

    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));

    const posts = files
        .map((file) => {
            const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
            const { data, content } = matter(raw);

            if (data.draft) return null;

            const wordCount = content.split(/\s+/).filter(Boolean).length;
            const readingTime = Math.max(1, Math.ceil(wordCount / 200));

            return {
                title: data.title || "Sin título",
                description: data.description || "",
                category: data.category || "",
                createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : "",
                updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : "",
                slug: file.replace(/\.mdx$/, ""),
                draft: false,
                image: data.image || undefined,
                series: data.series || undefined,
                seriesOrder: data.seriesOrder || undefined,
                wordCount,
                readingTime,
            } as Post;
        })
        .filter(Boolean) as Post[];

    return posts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getDrafts(): Post[] {
    if (!fs.existsSync(postsDir)) return [];

    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));

    const drafts = files
        .map((file) => {
            const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
            const { data, content } = matter(raw);

            if (!data.draft) return null;

            const wordCount = content.split(/\s+/).filter(Boolean).length;
            const readingTime = Math.max(1, Math.ceil(wordCount / 200));

            return {
                title: data.title || "Sin título",
                description: data.description || "",
                category: data.category || "",
                createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : "",
                updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : "",
                slug: file.replace(/\.mdx$/, ""),
                draft: true,
                image: data.image || undefined,
                series: data.series || undefined,
                seriesOrder: data.seriesOrder || undefined,
                wordCount,
                readingTime,
            } as Post;
        })
        .filter(Boolean) as Post[];

    return drafts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getAdjacentPosts(currentSlug: string): {
    previous: { slug: string; title: string } | null;
    next: { slug: string; title: string } | null;
} {
    const posts = getPosts();
    const currentIndex = posts.findIndex((p) => p.slug === currentSlug);

    if (currentIndex === -1) return { previous: null, next: null };

    const previous = currentIndex < posts.length - 1
        ? { slug: posts[currentIndex + 1].slug, title: posts[currentIndex + 1].title }
        : null;

    const next = currentIndex > 0
        ? { slug: posts[currentIndex - 1].slug, title: posts[currentIndex - 1].title }
        : null;

    return { previous, next };
}

export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: { id: string; text: string; level: number }[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        headings.push({ id, text, level });
    }

    return headings;
}

export function getMicroblog(): MicroblogEntry[] {
    if (!fs.existsSync(microblogDir)) return [];

    const files = fs.readdirSync(microblogDir).filter((f) => f.endsWith(".mdx"));

    const entries = files.map((file) => {
        const raw = fs.readFileSync(path.join(microblogDir, file), "utf-8");
        const { data, content } = matter(raw);

        return {
            title: data.title || "",
            body: content.trim(),
            createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : "",
        };
    });

    return entries.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getAllDates(): string[] {
    const posts = getPosts();
    const microblog = getMicroblog();

    const postDates = posts.map((p) => p.createdAt.split("T")[0]);
    const microDates = microblog.map((m) => m.createdAt.split("T")[0]);

    return [...postDates, ...microDates].filter(Boolean);
}

export function getRelatedPosts(currentSlug: string, category: string, limit: number): Post[] {
    return getPosts()
        .filter((p) => p.slug !== currentSlug && p.category === category)
        .slice(0, limit);
}

export function getPostsInSeries(series: string): Post[] {
    return getPosts()
        .filter((p) => p.series === series)
        .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}

export function getConnieSeries(): Post[] {
    return getPosts()
        .filter((p) => p.category === "Connie")
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getSearchIndex() {
    return getPosts().map((p) => ({
        title: p.title,
        description: p.description,
        category: p.category,
        slug: p.slug,
    }));
}