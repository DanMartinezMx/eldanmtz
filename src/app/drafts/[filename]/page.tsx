import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { extractHeadings, getPostBySlug } from "@/lib/content";
import { mdxComponents } from "@/components/mdx";
import { TableOfContents } from "@/components/TableOfContents";
import { ReadingProgress } from "@/components/ReadingProgress";

interface Props {
  params: Promise<{ filename: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DraftPost({ params }: Props) {
  const { filename } = await params;
  const post = getPostBySlug(filename);

  // This route only serves drafts; published posts live under /blog.
  if (!post || !post.data.draft) {
    notFound();
  }

  const { data, content, wordCount, readingTime } = post;
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
            alt={data.title || ""}
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