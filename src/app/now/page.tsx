import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enfoque",
  description: "Esto es en lo que estoy metido actualmente.",
  openGraph: {
    title: "Enfoque — El Otro Tab",
    description: "Esto es en lo que estoy metido actualmente.",
    url: "https://eldanmtz.com/now",
  },
};

export default function NowPage() {
  return (
    <div className="now-page">
      <h1>Enfoque</h1>
      <p className="now-subtitle">Esto es en lo que estoy metido actualmente.</p>

      <section className="now-section">
        <h2>🎯 Enfocado en</h2>
        <ul>
          <li>Construyendo este blog desde cero con Next.js + TinaCMS</li>
          <li>Re-aprendiendo CSS y Javascript</li>
          <li>Aprendiendo React/Next.js a fondo</li>
        </ul>
      </section>

      <section className="now-section">
        <h2>📚 Leyendo</h2>
        <ul>
          <li>Dune: Mesias</li>
        </ul>
      </section>

      <section className="now-section">
        <h2>🎮 Jugando</h2>
        <ul>
          <li>Crimson Desert</li>
        </ul>
      </section>

      <section className="now-section">
        <h2>🎬 Viendo</h2>
        <ul>
          <li>Asesino sin memoria</li>
        </ul>
      </section>

      <p className="now-updated">Última actualización: Junio 2026</p>
    </div>
  );
}