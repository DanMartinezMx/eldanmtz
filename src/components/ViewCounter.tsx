"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Records a view and shows the count. Increments once per browser session
 * (refreshes just re-read), and renders nothing when KV isn't configured or the
 * count is 0 — so it's invisible until view tracking is set up.
 */
export function ViewCounter({ slug }: { slug: string }) {
    const [count, setCount] = useState<number | null>(null);
    const done = useRef(false);

    useEffect(() => {
        if (done.current) return;
        done.current = true;

        let method: "GET" | "POST" = "POST";
        try {
            const key = `viewed:${slug}`;
            if (sessionStorage.getItem(key)) method = "GET";
            else sessionStorage.setItem(key, "1");
        } catch {
            // sessionStorage unavailable — fall back to counting the view.
        }

        fetch(`/api/views/${slug}`, { method })
            .then((r) => r.json())
            .then((d: { count?: number }) => {
                if (typeof d.count === "number" && d.count > 0) setCount(d.count);
            })
            .catch(() => {});
    }, [slug]);

    if (count === null) return null;

    return (
        <span className="post-views">
            👁 {count.toLocaleString("es-MX")} {count === 1 ? "vista" : "vistas"}
        </span>
    );
}
