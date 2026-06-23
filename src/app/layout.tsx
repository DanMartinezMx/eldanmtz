import type { Metadata } from "next";
import "./globals.css";
import { NavWrapper } from "@/components/NavWrapper";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://eldanmtz.com"),
  title: {
    default: "El otro Tab — Dan Martinez",
    template: "%s — El otro Tab",
  },
  description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
  openGraph: {
    title: "El otro Tab — Dan Martinez",
    description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
    url: "https://eldanmtz.com",
    siteName: "El otro Tab",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "El otro Tab — Dan Martinez",
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
    languages: {
      "es-MX": "https://eldanmtz.com",
      "es": "https://eldanmtz.com",
    },
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
        <NavWrapper />
        <main className="main-content">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}