import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://eldanmtz.com"),
  title: {
    default: "El Otro Tab — Dan Martinez",
    template: "%s — El Otro Tab",
  },
  description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
  openGraph: {
    title: "El Otro Tab — Dan Martinez",
    description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
    url: "https://eldanmtz.com",
    siteName: "El Otro Tab",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "El Otro Tab — Dan Martinez",
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
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Navigation />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}