import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRelatedPosts, getPostsInSeries, getConnieSeries } from "@/lib/content";
import { SubscribeCTA } from "@/components/SubscribeCTA";

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
    return { title: "Post no encontrado" };
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  return {
    title: data.title,
    description: data.description || `Lee "${data.title}" en El otro Tab — un blog personal sobre ${data.category?.toLowerCase() || "la vida"}.`,
    alternates: {
      canonical: `https://eldanmtz.com/blog/${filename}`,
    },
    openGraph: {
      title: data.title,
      description: data.description || `Lee "${data.title}" en El otro Tab — un blog personal sobre ${data.category?.toLowerCase() || "la vida"}.`,
      type: "article",
      publishedTime: data.createdAt,
      url: `https://eldanmtz.com/blog/${filename}`,
      ...(data.image && { images: [{ url: data.image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description || `Lee "${data.title}" en El otro Tab — un blog personal sobre ${data.category?.toLowerCase() || "la vida"}.`,
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

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const relatedPosts = data.category ? getRelatedPosts(filename, data.category, 3) : [];

  let seriesPosts: ReturnType<typeof getConnieSeries> = [];
  let seriesName = "";

  if (data.series) {
    seriesPosts = getPostsInSeries(data.series);
    seriesName = data.series;
  } else if (data.category === "Connie") {
    seriesPosts = getConnieSeries();
    seriesName = "Guías Confluence Cloud";
  }

  const currentSeriesIndex = seriesPosts.findIndex((p) => p.slug === filename);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description || "",
    datePublished: data.createdAt,
    dateModified: data.updatedAt || data.createdAt,
    author: {
      "@type": "Person",
      name: "Dan Martinez",
      url: "https://eldanmtz.com",
    },
    publisher: {
      "@type": "Person",
      name: "Dan Martinez",
    },
    url: `https://eldanmtz.com/blog/${filename}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://eldanmtz.com/blog/${filename}`,
    },
    ...(data.image && { image: data.image }),
    ...(data.category && { articleSection: data.category }),
    inLanguage: "es-MX",
    wordCount: wordCount,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://eldanmtz.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://eldanmtz.com/blog" },
      { "@type": "ListItem", position: 3, name: data.title, item: `https://eldanmtz.com/blog/${filename}` },
    ],
  };

  return (
    <article className="blog-post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Link href="/blog" className="back-link">← Volver al blog</Link>

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
        <time dateTime={data.createdAt}>
          {new Date(data.createdAt).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "America/Mexico_City",
          })}
        </time>
        {data.category && <span className="post-category">{data.category}</span>}
        <span className="reading-time">☕ {readingTime} min de lectura</span>
      </div>

      {seriesPosts.length > 1 && (
        <nav className="series-nav">
          <p className="series-title">📚 Serie: {seriesName} ({currentSeriesIndex + 1} de {seriesPosts.length})</p>
          <div className="series-links">
            {seriesPosts.map((sp, i) => (
              <Link
                key={sp.slug}
                href={`/blog/${sp.slug}`}
                className={`series-link ${sp.slug === filename ? "current" : ""}`}
              >
                {i + 1}. {sp.title}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div className="post-content">
        <MDXRemote source={content} />
      </div>

      <div className="post-share">
        <span>Compartir:</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(`https://eldanmtz.com/blog/${filename}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          𝕏
        </a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${data.title} https://eldanmtz.com/blog/${filename}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>

      <SubscribeCTA />

      {relatedPosts.length > 0 && (
        <section className="related-posts">
          <h3>Posts relacionados</h3>
          <div className="related-list">
            {relatedPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="related-item">
                <span>{post.title}</span>
                <time>
                  {new Date(post.createdAt).toLocaleDateString("es-MX", {
                    month: "short",
                    day: "numeric",
                    timeZone: "America/Mexico_City",
                  })}
                </time>
              </Link>
            ))}
          </div>
        </section>
      )}

      <nav className="post-nav">
        <Link href="/blog">← Todos los posts</Link>
        <a href="#top">↑ Subir</a>
      </nav>
    </article>
  );
}