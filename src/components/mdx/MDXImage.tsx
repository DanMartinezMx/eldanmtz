import Image from "next/image";

interface MDXImageProps {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
}

/** Image renderer for MDX: next/image for local images, a plain <img> for external ones. */
export function MDXImage({ src, alt, width, height }: MDXImageProps) {
    if (!src) return null;

    // External images or images without dimensions use regular img
    if (src.startsWith("http") && !width) {
        return (
            <span className="mdx-image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt || ""} className="mdx-image" loading="lazy" />
            </span>
        );
    }

    return (
        <span className="mdx-image-wrapper">
            <Image
                src={src}
                alt={alt || ""}
                width={width || 800}
                height={height || 450}
                className="mdx-image"
                sizes="(max-width: 700px) 100vw, 700px"
            />
        </span>
    );
}