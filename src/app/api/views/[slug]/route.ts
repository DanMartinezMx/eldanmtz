import { incrementView, getView } from "@/lib/views";

interface Ctx {
    params: Promise<{ slug: string }>;
}

// GET reads the current count (used on a refresh within the same session).
export async function GET(_req: Request, { params }: Ctx) {
    const { slug } = await params;
    const count = await getView(slug);
    return Response.json({ count: count ?? 0 }, { status: 200 });
}

// POST increments and returns the new count (used the first time a post is opened).
export async function POST(_req: Request, { params }: Ctx) {
    const { slug } = await params;
    const count = await incrementView(slug);
    return Response.json({ count: count ?? 0 }, { status: 200 });
}
