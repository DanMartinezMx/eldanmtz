import { getSearchIndex } from "@/lib/content";

// Served as a static JSON file and fetched lazily by the search dialog, so the
// full post index isn't embedded into the HTML of every page.
export async function GET() {
  return Response.json(getSearchIndex(), {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
