"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TopPost {
    slug: string;
    title: string;
    count: number;
}

/** "Más leídos" list, fetched client-side so the page stays static. Hidden when empty. */
export function MostRead() {
    const [posts, setPosts] = useState<TopPost[]>([]);

    useEffect(() => {
        fetch("/api/views/top")
            .then((r) => r.json())
            .then((d: { posts?: TopPost[] }) => setPosts(d.posts ?? []))
            .catch(() => {});
    }, []);

    if (posts.length === 0) return null;

    return (
        <section className="most-read">
            <h2>🔥 Más leídos</h2>
            <ol className="most-read-list">
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        <span className="most-read-count">{post.count.toLocaleString("es-MX")}</span>
                    </li>
                ))}
            </ol>
        </section>
    );
}
