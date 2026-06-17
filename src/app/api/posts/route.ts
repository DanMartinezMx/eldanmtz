import { client } from "@/lib/tina";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await client.queries.postConnection({
            sort: "createdAt",
            filter: { draft: { eq: false } },
        });

        const posts = res.data.postConnection.edges?.map((e) => ({
            title: e?.node?.title,
            description: e?.node?.description,
            category: e?.node?.category,
            createdAt: e?.node?.createdAt,
            slug: e?.node?._sys.filename,
            draft: e?.node?.draft,
        })) || [];

        return NextResponse.json(posts);
    } catch {
        return NextResponse.json([]);
    }
}