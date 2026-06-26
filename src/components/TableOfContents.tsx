"use client";

import { useEffect, useState } from "react";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    headings: TocItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        if (headings.length < 3) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActiveId(visible[0].target.id);
            },
            // Trigger when a heading is in the top third of the viewport.
            { rootMargin: "0px 0px -66% 0px", threshold: 0 }
        );

        const els = headings
            .map((h) => document.getElementById(h.id))
            .filter((el): el is HTMLElement => el !== null);
        els.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length < 3) return null;

    return (
        <nav className="toc" aria-label="Tabla de contenidos">
            <details open>
                <summary className="toc-title">📑 En este post</summary>
                <ul className="toc-list">
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            className={`toc-item toc-level-${heading.level}`}
                        >
                            <a
                                href={`#${heading.id}`}
                                className={activeId === heading.id ? "active" : ""}
                                aria-current={activeId === heading.id ? "location" : undefined}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </details>
        </nav>
    );
}
