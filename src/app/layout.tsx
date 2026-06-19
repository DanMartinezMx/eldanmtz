import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://eldanmtz.com"),
  title: {
    default: "El otro tab by Dan Mtz",
    template: "%s",
  },
  description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
  openGraph: {
    title: "El otro tab by Dan Mtz",
    description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
    url: "https://eldanmtz.com",
    siteName: "El otro tab by Dan Mtz",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "El otro tab by Dan Mtz",
    description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
    creator: "@eldanmtz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://eldanmtz.com",
    types: {
      "application/rss+xml": "https://eldanmtz.com/feed.xml",
    },
  },
};

function getMicroblogEntries() {
  const dir = path.join(process.cwd(), "content/microblog");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return {
        title: data.title || "",
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : "",
        slug: file.replace(/\.(mdx|md)$/, ""),
      };
    })
    .filter((p) => p.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const microblogEntries = getMicroblogEntries();

  return (
    <html lang="es">
      <body>
        <div className="site-wrapper">
          <Sidebar microblogEntries={microblogEntries} />
          <main className="main-content">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
