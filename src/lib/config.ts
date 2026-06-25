/** Canonical site origin. Used to build absolute URLs (canonicals, OG, sitemap, RSS). */
export const SITE_URL = "https://eldanmtz.com";

/** Average reading speed used to estimate a post's reading time. */
export const WORDS_PER_MINUTE = 200;

/**
 * Post categories shown across the site.
 * Keep in sync with the `category` field options in {@link file://./../../tina/config.ts}.
 */
export const CATEGORIES = [
    "Tech",
    "Coding",
    "Gaming",
    "Foodies",
    "Cine y TV",
    "Viajes",
    "Personal",
    "Random",
    "Recomendaciones",
    "Connie",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Convert a category label to its URL slug, e.g. "Cine y TV" → "cine-y-tv". */
export function categoryToSlug(category: string): string {
    return category.toLowerCase().replace(/ /g, "-");
}
