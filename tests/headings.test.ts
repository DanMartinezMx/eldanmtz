import { test } from "node:test";
import assert from "node:assert/strict";
import { extractHeadings, stripInlineMarkdown } from "../src/lib/headings.ts";

test("heading IDs preserve accented characters (matches rehype-slug)", () => {
    const [h] = extractHeadings("## Configuración inicial");
    assert.equal(h.id, "configuración-inicial");
    assert.equal(h.text, "Configuración inicial");
    assert.equal(h.level, 2);
});

test("captures both ## and ### with correct levels", () => {
    const headings = extractHeadings("## Sección\n\n### Subsección");
    assert.deepEqual(
        headings.map((h) => h.level),
        [2, 3]
    );
});

test("strips inline markdown from heading text and id", () => {
    const [h] = extractHeadings("## Usando `código` y **negritas**");
    assert.equal(h.text, "Usando código y negritas");
    assert.equal(h.id, "usando-código-y-negritas");
});

test("ignores ## inside fenced code blocks", () => {
    const md = "## Real heading\n\n```bash\n## not a heading\n```";
    const headings = extractHeadings(md);
    assert.equal(headings.length, 1);
    assert.equal(headings[0].text, "Real heading");
});

test("dedupes repeated headings like github-slugger", () => {
    const headings = extractHeadings("## Intro\n\n## Intro");
    assert.deepEqual(
        headings.map((h) => h.id),
        ["intro", "intro-1"]
    );
});

test("stripInlineMarkdown handles links", () => {
    assert.equal(stripInlineMarkdown("ver [el blog](https://x.com)"), "ver el blog");
});
