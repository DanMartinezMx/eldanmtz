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
                {/* Replace with your actual Instagram embed */}
                <div className="instagram-placeholder">
                    <p>Instagram feed coming soon...</p>
                </div>
            </section>

            <style>{`
        .about-page {
          max-width: 600px;
        }
        .about-page h1 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }
        .about-section {
          margin-bottom: 2rem;
        }
        .about-section h2 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .about-section p {
          color: var(--text-secondary);
          line-height: 1.7;
        }
        .instagram-placeholder {
          background: var(--bg-tertiary);
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}