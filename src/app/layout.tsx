import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dan Mtz.",
  description: "Blog personal — Tech, Cocina, Gaming y la vida.",
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

        <style>{`
          .site-wrapper {
            display: flex;
            min-height: 100vh;
          }
          .main-content {
            flex: 1;
            padding: 2rem 3rem;
            max-width: 900px;
            overflow-y: auto;
          }
          @media (max-width: 768px) {
            .site-wrapper {
              flex-direction: column;
            }
            .main-content {
              padding: 1.5rem;
            }
          }
        `}</style>
      </body>
    </html>
  );
}