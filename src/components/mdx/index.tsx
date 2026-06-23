import { Callout } from "./Callout";
import { MDXImage } from "./MDXImage";

export const mdxComponents = {
    Callout,
    Tip: ({ children, title }: { children: React.ReactNode; title?: string }) => (
        <Callout type="tip" title={title}>{children}</Callout>
    ),
    Warning: ({ children, title }: { children: React.ReactNode; title?: string }) => (
        <Callout type="warning" title={title}>{children}</Callout>
    ),
    Note: ({ children, title }: { children: React.ReactNode; title?: string }) => (
        <Callout type="note" title={title}>{children}</Callout>
    ),
    Danger: ({ children, title }: { children: React.ReactNode; title?: string }) => (
        <Callout type="danger" title={title}>{children}</Callout>
    ),
    img: MDXImage,
};