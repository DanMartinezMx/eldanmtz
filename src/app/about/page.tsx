import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Dan Mtz.",
  description: "Sobre Dan Martinez — tecnología, cocina, gaming, viajes, cine y la vida.",
  openGraph: {
    title: "About — Dan Mtz.",
    description: "Sobre Dan Martinez — tecnología, cocina, gaming, viajes, cine y la vida.",
    url: "https://eldanmtz.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <h1>About</h1>

      <section className="about-section">
        <h2>Sobre el blog</h2>
        <p>
          Este es mi espacio personal en internet. Escribo sobre lo que me interesa:
          tecnología, cocina, gaming, viajes, cine y la vida en general.
          No hay un tema fijo — es un reflejo de mis intereses.
        </p>
      </section>

      <section className="about-section">
        <h2>Sobre mí</h2>
        <p>
          Soy Dan, vivo en Estados Unidos. Me gusta construir cosas, cocinar,
          jugar videojuegos y ver películas. Este blog es mi proyecto personal
          para documentar y compartir.
        </p>
      </section>

      <section className="about-section">
        <h2>Instagram</h2>
        <div className="instagram-placeholder">
          <p>Instagram feed coming soon...</p>
        </div>
      </section>
    </div>
  );
}
