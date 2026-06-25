import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import GithubSlugger from "github-slugger";
import { WORDS_PER_MINUTE } from "./config";

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

/** Frontmatter parsed from a post's gray-matter block. All fields optional — content may be incomplete. */
export interface PostFrontmatter {
    title?: string;
    description?: string;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
    image?: string;
    series?: string;
    seriesOrder?: number;
    draft?: boolean;
}

/** Raw frontmatter + MDX body for a single post, plus derived reading stats. */
export interface PostSource {
    data: PostFrontmatter;
    content: string;
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

/** Word count and estimated reading time (in minutes, min 1) for a body of text. */
function computeReadingStats(content: string): { wordCount: number; readingTime: number } {
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
    return { wordCount, readingTime };
}

const toISO = (value?: string): string => (value ? new Date(value).toISOString() : "");

const byNewest = (a: { createdAt: string }, b: { createdAt: string }) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

/**
 * Read and parse every post file from disk — exactly once per request.
 *
 * Wrapped in React's `cache()` so the many derived readers below
 * (getPosts, getDrafts, getPostBySlug, related/adjacent/series, search index,
 * sitemap, feed…) share a single directory scan instead of each re-reading and
 * re-parsing all MDX files. See Next.js "Caching and Revalidating" docs.
 */
const readPostFiles = cache((): { slug: string; data: PostFrontmatter; content: string }[] => {
    if (!fs.existsSync(postsDir)) return [];

    return fs
        .readdirSync(postsDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((file) => {
            const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
            const { data, content } = matter(raw);
            return { slug: file.replace(/\.mdx$/, ""), data: data as PostFrontmatter, content };
        });
});

/** Build a list-view {@link Post} (no body) from a parsed file. */
function toPost(file: { slug: string; data: PostFrontmatter; content: string }): Post {
    const { data, slug, content } = file;
    const { wordCount, readingTime } = computeReadingStats(content);

    return {
        title: data.title || "Sin título",
        description: data.description || "",
        category: data.category || "",
        createdAt: toISO(data.createdAt),
        updatedAt: toISO(data.updatedAt),
        slug,
        draft: Boolean(data.draft),
        image: data.image || undefined,
        series: data.series || undefined,
        seriesOrder: data.seriesOrder || undefined,
        wordCount,
        readingTime,
    };
}

/** All posts (published + drafts), newest first. */
const getAllPosts = cache((): Post[] => readPostFiles().map(toPost).sort(byNewest));

/** Published posts (drafts excluded), newest first. */
export function getPosts(): Post[] {
    return getAllPosts().filter((p) => !p.draft);
}

/** Draft posts only, newest first. */
export function getDrafts(): Post[] {
    return getAllPosts().filter((p) => p.draft);
}

/** Frontmatter + MDX body for a single post by slug, or `null` if it doesn't exist. */
export const getPostBySlug = cache((slug: string): PostSource | null => {
    const file = readPostFiles().find((f) => f.slug === slug);
    if (!file) return null;
    return { data: file.data, content: file.content, ...computeReadingStats(file.content) };
});

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

/** Remove inline markdown (code, links, emphasis) so TOC text and IDs match the rendered heading. */
function stripInlineMarkdown(text: string): string {
    return text
        .replace(/`([^`]+)`/g, "$1")            // `code`
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [text](url)
        .replace(/(\*\*|__)(.+?)\1/g, "$2")      // **bold** / __bold__
        .replace(/(\*|_)(.+?)\1/g, "$2")         // *italic* / _italic_
        .trim();
}

/**
 * Extract `##`/`###` headings for the table of contents.
 *
 * IDs are generated with `github-slugger` — the same library `rehype-slug`
 * uses when rendering the MDX — so TOC anchors match the IDs on the actual
 * headings, including accented Spanish characters (e.g. "configuración").
 * Using a fresh slugger per call mirrors rehype-slug's per-document duplicate
 * handling. Fenced code blocks are stripped first so `##` comments inside code
 * samples don't become phantom entries.
 */
export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
    const slugger = new GithubSlugger();
    const withoutCode = content
        .replace(/```[\s\S]*?```/g, "")
        .replace(/~~~[\s\S]*?~~~/g, "");

    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: { id: string; text: string; level: number }[] = [];
    let match;

    while ((match = headingRegex.exec(withoutCode)) !== null) {
        const level = match[1].length;
        const text = stripInlineMarkdown(match[2].trim());
        headings.push({ id: slugger.slug(text), text, level });
    }

    return headings;
}

export const getMicroblog = cache((): MicroblogEntry[] => {
    if (!fs.existsSync(microblogDir)) return [];

    const entries = fs
        .readdirSync(microblogDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((file) => {
            const raw = fs.readFileSync(path.join(microblogDir, file), "utf-8");
            const { data, content } = matter(raw);
            return {
                title: data.title || "",
                body: content.trim(),
                createdAt: toISO(data.createdAt),
            };
        });

    return entries.sort(byNewest);
});

export function getAllDates(): string[] {
    const postDates = getPosts().map((p) => p.createdAt.split("T")[0]);
    const microDates = getMicroblog().map((m) => m.createdAt.split("T")[0]);

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
