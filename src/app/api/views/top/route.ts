import { topViews } from "@/lib/views";
import { getPosts } from "@/lib/content";

// Returns the most-viewed published posts (resolving slugs to titles).
export async function GET() {
    const top = await topViews(5);
    if (top.length === 0) return Response.json({ posts: [] }, { status: 200 });

    const titleBySlug = new Map(getPosts().map((p) => [p.slug, p.title]));
    const posts = top
        .filter((t) => titleBySlug.has(t.slug)) // drop drafts / deleted posts
        .map((t) => ({ slug: t.slug, title: titleBySlug.get(t.slug)!, count: t.count }));

    return Response.json({ posts }, { status: 200 });
}
