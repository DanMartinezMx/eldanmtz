import { client } from "@/lib/tina";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await client.queries.microblogConnection({
            sort: "createdAt",
            last: 10,
        });

        const entries = res.data.microblogConnection.edges?.map((e) => ({
            title: e?.node?.title,
            createdAt: e?.node?.createdAt,
            slug: e?.node?._sys.filename,
        })) || [];

        return NextResponse.json(entries);
    } catch {
        return NextResponse.json([]);
    }
}