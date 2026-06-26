import { kvCommand } from "./kv";

// Per-post view counts are stored in a single Redis sorted set: member = slug,
// score = view count. That gives O(1) increment/read plus a cheap leaderboard.
const VIEWS_KEY = "views";

/** Increment a post's view count and return the new total (null if KV is off). */
export async function incrementView(slug: string): Promise<number | null> {
    const result = await kvCommand<string | number>(["ZINCRBY", VIEWS_KEY, 1, slug]);
    return result === null ? null : Number(result);
}

/** Read a post's current view count (null if KV is off, 0 if never viewed). */
export async function getView(slug: string): Promise<number | null> {
    const result = await kvCommand<string | number | null>(["ZSCORE", VIEWS_KEY, slug]);
    return result === null || result === undefined ? null : Number(result);
}

/** Top `limit` posts by views, highest first. */
export async function topViews(limit: number): Promise<Array<{ slug: string; count: number }>> {
    const flat = await kvCommand<string[]>(["ZREVRANGE", VIEWS_KEY, 0, limit - 1, "WITHSCORES"]);
    if (!flat) return [];
    const out: Array<{ slug: string; count: number }> = [];
    for (let i = 0; i < flat.length; i += 2) {
        out.push({ slug: flat[i], count: Number(flat[i + 1]) });
    }
    return out;
}
