"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="blog-page">
      <h1>Algo salió mal</h1>
      <p className="empty">
        No pudimos cargar esta página. Intenta de nuevo o vuelve al blog.
      </p>
      <div className="blog-filter-chips">
        <button className="filter-chip" onClick={() => unstable_retry()}>
          Reintentar
        </button>
        <Link href="/blog" className="filter-chip">
          ← Volver al blog
        </Link>
      </div>
    </div>
  );
}
