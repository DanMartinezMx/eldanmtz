import GithubSlugger from "github-slugger";

export interface Heading {
    id: string;
    text: string;
    level: number;
}

/** Remove inline markdown (code, links, emphasis) so displayed text and slugs match the rendered output. */
export function stripInlineMarkdown(text: string): string {
    return text
        .replace(/`([^`]+)`/g, "$1")            // `code`
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [text](url)
        .replace(/(\*\*|__)(.+?)\1/g, "$2")      // **bold** / __bold__
        .replace(/(\*|_)(.+?)\1/g, "$2")         // *italic* / _italic_
        .trim();
}

/**
 * Extract `##`/`###` headings for the table of contents.
 *
 * IDs are generated with `github-slugger` — the same library `rehype-slug`
 * uses when rendering the MDX — so TOC anchors match the IDs on the actual
 * headings, including accented Spanish characters (e.g. "configuración").
 * Using a fresh slugger per call mirrors rehype-slug's per-document duplicate
 * handling. Fenced code blocks are stripped first so `##` comments inside code
 * samples don't become phantom entries.
 *
 * Pure (no framework imports) so it can be unit-tested directly — see
 * tests/headings.test.ts.
 */
export function extractHeadings(content: string): Heading[] {
    const slugger = new GithubSlugger();
    const withoutCode = content
        .replace(/```[\s\S]*?```/g, "")
        .replace(/~~~[\s\S]*?~~~/g, "");

    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(withoutCode)) !== null) {
        const level = match[1].length;
        const text = stripInlineMarkdown(match[2].trim());
        headings.push({ id: slugger.slug(text), text, level });
    }

    return headings;
}
