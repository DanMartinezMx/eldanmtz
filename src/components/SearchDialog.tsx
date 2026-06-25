"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchItem {
    title: string;
    description: string;
    category: string;
    slug: string;
}

export function SearchDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<SearchItem[]>([]);
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const loadedRef = useRef(false);

    // Keyboard shortcut: Cmd+K / Ctrl+K to open, Escape to close.
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

    // Lazily fetch the search index the first time the dialog opens.
    useEffect(() => {
        if (!open || loadedRef.current) return;
        loadedRef.current = true;
        fetch("/search-index.json")
            .then((res) => res.json())
            .then((data: SearchItem[]) => setItems(data))
            .catch(() => {
                loadedRef.current = false; // allow a retry on next open
            });
    }, [open]);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    const q = query.trim().toLowerCase();
    const results = q.length > 1
        ? items.filter((p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        ).slice(0, 8)
        : [];

    const onQueryChange = (value: string) => {
        setQuery(value);
        setActive(0); // reset highlight when the result set changes
    };

    const go = (slug: string) => {
        setOpen(false);
        router.push(`/blog/${slug}`);
    };

    const onInputKeyDown = (e: React.KeyboardEvent) => {
        if (!results.length) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            go(results[active].slug);
        }
    };

    if (!open) {
        return (
            <button onClick={() => setOpen(true)} className="search-trigger" aria-label="Buscar" aria-keyshortcuts="Meta+K Control+K">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <span className="search-shortcut">⌘K</span>
            </button>
        );
    }

    return (
        <div className="search-overlay" onClick={() => setOpen(false)}>
            <div
                className="search-dialog"
                role="dialog"
                aria-modal="true"
                aria-label="Buscar posts"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="search-input-wrapper">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        onKeyDown={onInputKeyDown}
                        placeholder="Buscar posts..."
                        className="search-input"
                        role="combobox"
                        aria-expanded={results.length > 0}
                        aria-controls="search-results"
                        aria-autocomplete="list"
                        aria-activedescendant={results.length > 0 ? `search-option-${active}` : undefined}
                        aria-label="Buscar posts"
                    />
                    <kbd className="search-esc">ESC</kbd>
                </div>

                {results.length > 0 && (
                    <ul className="search-results" id="search-results" role="listbox" aria-label="Resultados">
                        {results.map((post, i) => (
                            <li key={post.slug} role="presentation">
                                <a
                                    id={`search-option-${i}`}
                                    href={`/blog/${post.slug}`}
                                    className={`search-result ${i === active ? "active" : ""}`}
                                    role="option"
                                    aria-selected={i === active}
                                    onMouseEnter={() => setActive(i)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        go(post.slug);
                                    }}
                                >
                                    <span className="search-result-title">{post.title}</span>
                                    {post.category && <span className="search-result-category">{post.category}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}

                {query.trim().length > 1 && results.length === 0 && (
                    <div className="search-empty">
                        <p>No se encontraron resultados para &ldquo;{query}&rdquo;</p>
                    </div>
                )}
            </div>
        </div>
    );
}
