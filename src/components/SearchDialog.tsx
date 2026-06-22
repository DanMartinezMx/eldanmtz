"use client";

import { useState, useEffect, useRef } from "react";

interface SearchItem {
    title: string;
    description: string;
    category: string;
    slug: string;
}

interface SearchDialogProps {
    posts: SearchItem[];
}

export function SearchDialog({ posts }: SearchDialogProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut: Cmd+K or Ctrl+K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(true);
            }
            if (e.key === "Escape") {
                setOpen(false);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    const results = query.length > 1
        ? posts.filter((p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
        : [];

    if (!open) {
        return (
            <button onClick={() => setOpen(true)} className="search-trigger" aria-label="Buscar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <span className="search-shortcut">⌘K</span>
            </button>
        );
    }

    return (
        <div className="search-overlay" onClick={() => setOpen(false)}>
            <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="search-input-wrapper">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar posts..."
                        className="search-input"
                    />
                    <kbd className="search-esc">ESC</kbd>
                </div>

                {results.length > 0 && (
                    <div className="search-results">
                        {results.map((post) => (
                            <a
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="search-result"
                                onClick={() => setOpen(false)}
                            >
                                <span className="search-result-title">{post.title}</span>
                                {post.category && <span className="search-result-category">{post.category}</span>}
                            </a>
                        ))}
                    </div>
                )}

                {query.length > 1 && results.length === 0 && (
                    <div className="search-empty">
                        <p>No se encontraron resultados para &ldquo;{query}&rdquo;</p>
                    </div>
                )}
            </div>
        </div>
    );
}