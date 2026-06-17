"use client";

import { useEffect, useState } from "react";

interface MicroblogEntry {
    title: string;
    createdAt: string;
    slug: string;
}

export function MicroblogFeed() {
    const [entries, setEntries] = useState<MicroblogEntry[]>([]);

    useEffect(() => {
        fetch("/api/microblog")
            .then((res) => res.json())
            .then((data) => setEntries(data.slice(0, 10)))
            .catch(() => { });
    }, []);

    if (entries.length === 0) {
        return <p className="microblog-empty">No entries yet...</p>;
    }

    return (
        <div className="microblog-feed">
            {entries.map((entry) => (
                <div key={entry.slug} className="microblog-entry">
                    <p className="microblog-text">{entry.title}</p>
                    <time className="microblog-time">
                        {new Date(entry.createdAt).toLocaleDateString("es-MX", {
                            month: "short",
                            day: "numeric",
                        })}
                    </time>
                </div>
            ))}

            <style>{`
        .microblog-feed {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .microblog-entry {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border);
        }
        .microblog-text {
          font-size: 0.85rem;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.4;
        }
        .microblog-time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .microblog-empty {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}