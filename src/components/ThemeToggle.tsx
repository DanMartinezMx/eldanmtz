"use client";

import { useState, useEffect } from "react";

export function ThemeToggle() {
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    useEffect(() => {
        const saved = localStorage.getItem("theme") as "dark" | "light" | null;
        if (saved) {
            setTheme(saved);
            document.documentElement.setAttribute("data-theme", saved);
        }
    }, []);

    const toggle = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        localStorage.setItem("theme", next);
        document.documentElement.setAttribute("data-theme", next);
    };

    return (
        <button onClick={toggle} className="theme-toggle" aria-label="Cambiar tema">
            {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                </svg>
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
            )}
        </button>
    );
}