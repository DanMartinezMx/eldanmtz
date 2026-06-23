import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { extractHeadings } from "@/lib/content";
import { mdxComponents } from "@/components/mdx";
import { TableOfContents } from "@/components/TableOfContents";
import { ReadingProgress } from "@/components/ReadingProgress";

interface Props {
  params: Promise<{ filename: string }>;
}

const postsDir = path.join(process.cwd(), "content/posts");

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DraftPost({ params }: Props) {
  const { filename } = await params;
  const filePath = path.join(postsDir, `${filename}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (!data.draft) {
    // Not a draft — redirect to published version
    notFound();
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const headings = extractHeadings(content);

  return (
    <>
      <ReadingProgress />
      <article className="blog-post">
        <div className="draft-banner">
          🚧 BORRADOR — Este post no está publicado
        </div>

        <Link href="/drafts" className="back-link">← Volver a borradores</Link>

        {data.image && (
          <Image
            src={data.image}
            alt={data.title}
            width={800}
            height={400}
            className="post-image"
            priority
          />
        )}

        <h1>{data.title}</h1>

        <div className="post-meta">
          <time>
            {data.createdAt
              ? new Date(data.createdAt).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "America/Mexico_City",
              })
              : "Sin fecha"}
          </time>
          {data.category && <span className="post-category">{data.category}</span>}
          <span className="reading-time">☕ {readingTime} min de lectura</span>
          <span className="reading-time">{wordCount} palabras</span>
        </div>

        <TableOfContents headings={headings} />

        <div className="post-content">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  rehypeSlug,
                  [rehypePrettyCode, {
                    theme: "github-dark-dimmed",
                    keepBackground: true,
                  }],
                ],
              },
            }}
          />
        </div>
      </article>
    </>
  );
}