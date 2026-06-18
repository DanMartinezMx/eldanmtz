import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Now — Dan Mtz.",
  description: "Lo que Dan Martinez está haciendo ahora mismo.",
  openGraph: {
    title: "Now — Dan Mtz.",
    description: "Lo que Dan Martinez está haciendo ahora mismo.",
    url: "https://eldanmtz.com/now",
  },
};

export default function NowPage() {
  return (
    <div className="now-page">
      <h1>Now</h1>
      <p className="now-subtitle">Lo que estoy haciendo ahora mismo.</p>

      <section className="now-section">
        <h2>🎯 Enfocado en</h2>
        <ul>
          <li>Construyendo este blog desde cero con Next.js + TinaCMS</li>
          <li>Aprendiendo React a fondo</li>
        </ul>
      </section>

      <section className="now-section">
        <h2>📚 Leyendo</h2>
        <ul>
          <li>TBD</li>
        </ul>
      </section>

      <section className="now-section">
        <h2>🎮 Jugando</h2>
        <ul>
          <li>TBD</li>
        </ul>
      </section>

      <section className="now-section">
        <h2>🎬 Viendo</h2>
        <ul>
          <li>TBD</li>
        </ul>
      </section>

      <p className="now-updated">Última actualización: Junio 2025</p>
    </div>
  );
}
