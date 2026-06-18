import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://eldanmtz.com"),
  title: {
    default: "Dan Mtz.",
    template: "%s",
  },
  description: "Blog personal — Tech, Cocina, Gaming y la vida.",
  openGraph: {
    title: "Dan Mtz.",
    description: "Blog personal — Tech, Cocina, Gaming y la vida.",
    url: "https://eldanmtz.com",
    siteName: "Dan Mtz.",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Dan Mtz.",
    description: "Blog personal — Tech, Cocina, Gaming y la vida.",
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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="site-wrapper">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
