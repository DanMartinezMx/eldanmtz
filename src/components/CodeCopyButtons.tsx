"use client";

import { useEffect } from "react";

/**
 * Adds a "Copiar" button to every code block in the post. Runs after render and
 * manipulates the DOM directly (the MDX is server-rendered), so it doesn't need
 * to change the markup or re-render React. Renders nothing itself.
 */
export function CodeCopyButtons() {
    useEffect(() => {
        const pres = Array.from(document.querySelectorAll<HTMLPreElement>(".post-content pre"));
        const cleanups: Array<() => void> = [];

        for (const pre of pres) {
            if (pre.dataset.copyReady) continue;
            pre.dataset.copyReady = "true";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "code-copy-btn";
            button.textContent = "Copiar";
            button.setAttribute("aria-label", "Copiar código");

            let resetTimer: ReturnType<typeof setTimeout> | undefined;
            const onClick = async () => {
                const text = pre.querySelector("code")?.innerText ?? pre.innerText;
                try {
                    await navigator.clipboard.writeText(text);
                    button.textContent = "¡Copiado!";
                    button.classList.add("copied");
                    clearTimeout(resetTimer);
                    resetTimer = setTimeout(() => {
                        button.textContent = "Copiar";
                        button.classList.remove("copied");
                    }, 1500);
                } catch {
                    button.textContent = "Error";
                }
            };

            button.addEventListener("click", onClick);
            pre.appendChild(button);

            cleanups.push(() => {
                clearTimeout(resetTimer);
                button.removeEventListener("click", onClick);
                button.remove();
                delete pre.dataset.copyReady;
            });
        }

        return () => cleanups.forEach((fn) => fn());
    }, []);

    return null;
}
