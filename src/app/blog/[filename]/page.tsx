import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getRelatedPosts, getPostsInSeries, getConnieSeries, getAdjacentPosts, extractHeadings, getPostBySlug, getPosts } from "@/lib/content";
import { SITE_URL } from "@/lib/config";
import { mdxComponents } from "@/components/mdx";
import { TableOfContents } from "@/components/TableOfContents";
import { PostNavigation } from "@/components/PostNavigation";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SubscribeCTA } from "@/components/SubscribeCTA";
import { CodeCopyButtons } from "@/components/CodeCopyButtons";
import { ViewCounter } from "@/components/ViewCounter";

interface Props {
  params: Promise<{ filename: string }>;
}

export async function generateStaticParams() {
  return getPosts().map((p) => ({ filename: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { filename } = await params;
  const post = getPostBySlug(filename);

  if (!post) {
    return { title: "Post no encontrado" };
  }

  const { data } = post;
  const url = `${SITE_URL}/blog/${filename}`;
  const description =
    data.description ||
    `Lee "${data.title}" en El otro Tab — un blog personal sobre ${data.category?.toLowerCase() || "la vida"}.`;

  return {
    title: data.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: data.title,
      description,
      type: "article",
      publishedTime: data.createdAt,
      url,
      ...(data.image && { images: [{ url: data.image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
      ...(data.image && { images: [data.image] }),
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { filename } = await params;
  const post = getPostBySlug(filename);

  // Drafts are private — they live under /drafts, not the public /blog URL.
  if (!post || post.data.draft) {
    notFound();
  }

  const { data, content, wordCount, readingTime } = post;
  const url = `${SITE_URL}/blog/${filename}`;

  const relatedPosts = data.category ? getRelatedPosts(filename, data.category, 3) : [];
  const { previous, next } = getAdjacentPosts(filename);
  const headings = extractHeadings(content);

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
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Dan Martinez",
    },
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: data.title, item: url },
    ],
  };

  return (
    <>
      <ReadingProgress />
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
            alt={data.title || ""}
            width={800}
            height={400}
            className="post-image"
            sizes="(max-width: 800px) 100vw, 800px"
            priority
          />
        )}

        <h1>{data.title}</h1>

        <div className="post-meta">
          <time dateTime={data.createdAt}>
            {new Date(data.createdAt || "").toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "America/Mexico_City",
            })}
          </time>
          {data.category && <span className="post-category">{data.category}</span>}
          <span className="reading-time">☕ {readingTime} min de lectura</span>
          <ViewCounter slug={filename} />
          {data.updatedAt && data.updatedAt.split("T")[0] !== (data.createdAt || "").split("T")[0] && (
            <span className="post-updated">
              Actualizado el{" "}
              {new Date(data.updatedAt).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "America/Mexico_City",
              })}
            </span>
          )}
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

        <TableOfContents headings={headings} />

        <div className="post-content">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
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
        <CodeCopyButtons />

        <div className="post-share">
          <span>Compartir:</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title || "")}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            𝕏
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${data.title || ""} ${url}`)}`}
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

        <PostNavigation previousPost={previous} nextPost={next} />
      </article>
    </>
  );
}