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
      .catch(() => {});
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
    </div>
  );
}
