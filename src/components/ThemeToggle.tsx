"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

// The `data-theme` attribute on <html> is the source of truth — it's set before
// paint by the inline script in the root layout. We subscribe to it rather than
// holding theme in component state, so there's no flash and no setState-in-effect.
function subscribe(callback: () => void) {
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
}

function getSnapshot(): Theme {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
    return "dark";
}

/** Dark/light toggle. The `data-theme` attribute (set pre-paint in layout.tsx) is the source of truth. */
export function ThemeToggle() {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const toggle = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try {
            localStorage.setItem("theme", next);
        } catch {
            // localStorage may be unavailable (private mode); the toggle still works for the session.
        }
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
