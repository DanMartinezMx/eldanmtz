import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
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

// Applies the saved theme (or OS preference) before first paint to avoid a
// flash of the wrong theme. Runs synchronously as the first thing in <body>.
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var t=s||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a href="#main" className="skip-link">Saltar al contenido</a>
        <Navigation />
        <main id="main" className="main-content">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}