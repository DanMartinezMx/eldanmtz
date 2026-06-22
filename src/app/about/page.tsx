import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acerca de",
  description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
  openGraph: {
    title: "Acerca de — El otro Tab",
    description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
    url: "https://eldanmtz.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <h1>Acerca de</h1>

      <section className="about-section">
        <h2>Sobre el Blog</h2>
        <p>
          Este es mi espacio personal en internet. Escribo sobre lo que me interesa:
          tecnología, cocina, gaming, viajes, cine y la vida en general.
          No hay un tema fijo — es un reflejo de mis intereses.
        </p>
      </section>

      <section className="about-section">
        <h2>Sobre mí</h2>
        <p>
          Soy Dan. Soy papá, esposo, y hasta donde sé, humano. Me gusta cocinar,
          jugar videojuegos, ver películas, leer y escribir. Cuándo la paternidad da un descanso.
          Este blog es mi proyecto personal, para aprender nuevas cosas, para documentar y compartir.
        </p>
        <p>
          Espero que este blog sea de tu agrado. Que te haga reir, aprender algo nuevo,
          cuestionarte, o pasar el rato mientras estás en el baño. No todo son reels.
        </p>
        <p>Pero por si si, acá están los míos</p>
      </section>

      <section className="about-section">
        <h2>Instagram</h2>
        <div className="instagram-placeholder">
          <p>Bueno aquí estarán los reels... aun no aprendo lo suficiente para hacer esto...</p>
        </div>
      </section>

      <section className="about-section stack-section">
        <h2>🛠️ Mi Stack</h2>
        <p className="stack-subtitle">Las herramientas y setup que uso día a día.</p>

        <div className="stack-grid">
          <div className="stack-category">
            <h3>💻 Hardware</h3>
            <ul>
              <li><strong>Laptop:</strong> MacBook Pro M-series</li>
              <li><strong>Monitor:</strong> [Tu monitor]</li>
              <li><strong>Teclado:</strong> [Tu teclado]</li>
              <li><strong>Mouse:</strong> [Tu mouse]</li>
              <li><strong>Audífonos:</strong> [Tus audífonos]</li>
            </ul>
          </div>

          <div className="stack-category">
            <h3>🛠️ Desarrollo</h3>
            <ul>
              <li><strong>Editor:</strong> VS Code</li>
              <li><strong>Terminal:</strong> [Tu terminal]</li>
              <li><strong>Framework:</strong> Next.js</li>
              <li><strong>CMS:</strong> TinaCMS</li>
              <li><strong>Hosting:</strong> Vercel</li>
            </ul>
          </div>

          <div className="stack-category">
            <h3>📱 Apps</h3>
            <ul>
              <li><strong>Notas:</strong> [Tu app de notas]</li>
              <li><strong>Música:</strong> Spotify</li>
              <li><strong>Navegador:</strong> [Tu navegador]</li>
              <li><strong>Diseño:</strong> Figma</li>
            </ul>
          </div>

          <div className="stack-category">
            <h3>🎮 Gaming</h3>
            <ul>
              <li><strong>Consola:</strong> [Tu consola]</li>
              <li><strong>Juego actual:</strong> Crimson Desert</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}