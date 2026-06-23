interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    headings: TocItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
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
                            <a href={`#${heading.id}`}>{heading.text}</a>
                        </li>
                    ))}
                </ul>
            </details>
        </nav>
    );
}