"use client";

import { useEffect, useState } from "react";

/** Thin bar across the top of a post that tracks how far the reader has scrolled. */
export function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function updateProgress() {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                setProgress((window.scrollY / scrollHeight) * 100);
            }
        }

        window.addEventListener("scroll", updateProgress, { passive: true });
        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <div className="reading-progress" aria-hidden="true">
            <div
                className="reading-progress-bar"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}