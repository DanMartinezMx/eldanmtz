/**
 * Minimal Vercel KV / Upstash Redis client over the REST API — no SDK needed.
 *
 * Accepts a single Redis command as a JSON array, e.g. `["ZINCRBY", "views", 1, slug]`.
 * The URL/token env vars are added automatically when you create a KV store in the
 * Vercel dashboard and connect it. If they're absent (local dev, or not set up yet),
 * every call returns null so callers degrade gracefully (the feature just hides).
 */

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const kvConfigured = Boolean(KV_URL && KV_TOKEN);

export async function kvCommand<T = unknown>(cmd: Array<string | number>): Promise<T | null> {
    if (!KV_URL || !KV_TOKEN) return null;
    try {
        const res = await fetch(KV_URL, {
            method: "POST",
            headers: { Authorization: `Bearer ${KV_TOKEN}` },
            body: JSON.stringify(cmd),
            cache: "no-store",
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { result?: T };
        return data.result ?? null;
    } catch {
        return null;
    }
}
