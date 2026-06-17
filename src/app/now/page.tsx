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

            <p className="now-updated">Última actualización: Junio 2026</p>

            <style>{`
        .now-page {
          max-width: 600px;
        }
        .now-page h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }
        .now-subtitle {
          color: var(--text-muted);
          margin-bottom: 2rem;
        }
        .now-section {
          margin-bottom: 1.5rem;
        }
        .now-section h2 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        .now-section ul {
          list-style: none;
          padding: 0;
        }
        .now-section li {
          padding: 0.3rem 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .now-updated {
          margin-top: 2rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}