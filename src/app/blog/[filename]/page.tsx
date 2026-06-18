import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ filename: string }>;
}

const postsDir = path.join(process.cwd(), "content/posts");

export async function generateStaticParams() {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  return files.map((f) => ({ filename: f.replace(/\.mdx$/, "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { filename } = await params;
  const filePath = path.join(postsDir, `${filename}.mdx`);

  if (!fs.existsSync(filePath)) {
    return { title: "Post no encontrado — Dan Mtz." };
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  return {
    title: `${data.title} — Dan Mtz.`,
    description: data.description || `${data.title} — Blog de Dan Mtz.`,
    openGraph: {
      title: data.title,
      description: data.description || `${data.title} — Blog de Dan Mtz.`,
      type: "article",
      publishedTime: data.createdAt,
      url: `https://eldanmtz.com/blog/${filename}`,
      ...(data.image && { images: [{ url: data.image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description || `${data.title} — Blog de Dan Mtz.`,
      ...(data.image && { images: [data.image] }),
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { filename } = await params;
  const filePath = path.join(postsDir, `${filename}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description || "",
    datePublished: data.createdAt,
    author: {
      "@type": "Person",
      name: "Daniel Martinez",
      url: "https://eldanmtz.com",
    },
    publisher: {
      "@type": "Person",
      name: "Daniel Martinez",
    },
    url: `https://eldanmtz.com/blog/${filename}`,
    ...(data.image && { image: data.image }),
  };

  return (
    <article className="blog-post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/blog" className="back-link">← Volver al blog</Link>

      {data.image && <img src={data.image} alt={data.title} className="post-image" />}

      <h1>{data.title}</h1>

      <div className="post-meta">
        <time dateTime={data.createdAt}>
          {new Date(data.createdAt).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {data.category && <span className="post-category">{data.category}</span>}
      </div>

      <div className="post-content">
        <MDXRemote source={content} />
      </div>

      <section className="comments">
        <h3>Comentarios</h3>
        <p className="comments-placeholder">Coming soon...</p>
      </section>

      <nav className="post-nav">
        <Link href="/blog">← Todos los posts</Link>
        <a href="#top">↑ Subir</a>
      </nav>
    </article>
  );
}
