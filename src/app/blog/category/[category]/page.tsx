// Category archive (/blog/category/[category]): lists posts in one category.
import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { CATEGORIES, SITE_URL, categoryToSlug } from "@/lib/config";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
    return CATEGORIES.map((cat) => ({ category: categoryToSlug(cat) }));
}

function slugToCategory(slug: string): string | undefined {
    return CATEGORIES.find((cat) => categoryToSlug(cat) === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: slug } = await params;
    const category = slugToCategory(slug);

    if (!category) return { title: "Categoría no encontrada" };

    return {
        title: `${category} — Blog`,
        description: `Todos los posts sobre ${category} en El otro Tab.`,
        alternates: {
            canonical: `${SITE_URL}/blog/category/${slug}`,
        },
        openGraph: {
            title: `${category} — El otro Tab`,
            description: `Todos los posts sobre ${category} en El otro Tab.`,
            url: `${SITE_URL}/blog/category/${slug}`,
        },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { category: slug } = await params;
    const category = slugToCategory(slug);

    if (!category) {
        notFound();
    }

    const posts = getPosts().filter((p) => p.category === category);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category} — El otro Tab`,
        description: `Todos los posts sobre ${category}`,
        url: `${SITE_URL}/blog/category/${slug}`,
        inLanguage: "es-MX",
    };

    return (
        <div className="blog-page">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Link href="/blog" className="back-link">← Volver al blog</Link>

            <h1>{category}</h1>
            <p className="category-description">
                {posts.length} {posts.length === 1 ? "post" : "posts"} en esta categoría
            </p>

            <div className="year-posts">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="blog-post-item"
                        >
                            <div className="post-info">
                                <span className="post-title">{post.title}</span>
                            </div>
                            <time>
                                {new Date(post.createdAt).toLocaleDateString("es-MX", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </time>
                        </Link>
                    ))
                ) : (
                    <p className="empty">No hay posts en esta categoría todavía.</p>
                )}
            </div>
        </div>
    );
}