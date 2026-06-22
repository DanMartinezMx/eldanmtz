import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre mí — El otro Tab",
  description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
  openGraph: {
    title: "Sobre mí — El otro Tab",
    description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
    url: "https://eldanmtz.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <h1>Sobre mí</h1>

      <section className="about-section">
        <h2>Sobre mí</h2>
        <p>
          Soy Dan. Soy papá, esposo, y hasta donde sé, humano. </p>
        <br></br>
        <p> Me gusta cocinar, jugar videojuegos, ver películas, leer y escribir, cuándo la paternidad da un descanso.</p>
        <br></br>
        <p>
          Honestamente no sé que más puedo escribir sobre mi. Me irán conociendo más en los posts. Y en las otras secciones del blog. </p>
        <br></br>
        <p>
          Espero que este blog sea de tu agrado. Que te haga reir, aprender algo nuevo,
          cuestionarte, o pasar el rato mientras estás en el baño. No todo son reels.
        </p>
      </section>

      <section className="about-section">
        <h2>Sobre el Blog</h2>
        <p>
          Este es mi espacio personal en internet.
        </p>
        <br></br>
        <p>
          Aquí escribo sobre lo que me interesa: tecnología, cocina, gaming, viajes, cine y la vida en general.
        </p>
        <br></br>
        <p>No hay un tema fijo porque no soy experto en nada — este blog es un reflejo de mis intereses.</p>
        <br></br>
        <p>Estoy aprendiendo un montón de cosas nuevas, así que muchas de esas cosas que vaya aprendiendo, las iré compartiendo aquí.</p>
      </section>

      <section className="about-section stack-section">
        <h2>🛠️ Mi Stack</h2>
        <p className="stack-subtitle">Las herramientas y setup que uso día a día.</p>

        <div className="stack-grid">
          <div className="stack-category">
            <h3>💻 Hardware</h3>
            <ul>
              <li><strong>Laptop:</strong> MacBook Pro M-series</li>
              <li><strong>Monitor:</strong> LG -notengoideaquemodelo-</li>
              <li><strong>Teclado:</strong> Magic Keyboard</li>
              <li><strong>Mouse:</strong> Magic Mouse - Lo odio</li>
              <li><strong>Audífonos:</strong> JBL - TUNE670NC</li>
            </ul>
          </div>

          <div className="stack-category">
            <h3>🛠️ Desarrollo</h3>
            <ul>
              <li><strong>Editor:</strong> VS Code</li>
              <li><strong>Terminal:</strong> cmux - como Disneylandia para Devs</li>
              <li><strong>Framework:</strong> Next.js - estoy aprendiendo</li>
              <li><strong>CMS:</strong> TinaCMS - por ahora</li>
              <li><strong>Hosting:</strong> Vercel - free</li>
            </ul>
          </div>

          <div className="stack-category">
            <h3>📱 Apps</h3>
            <ul>
              <li><strong>Notas:</strong> Google Keep</li>
              <li><strong>Música:</strong> YT Music - El Mejor algoritmo tbh</li>
              <li><strong>Navegador:</strong> Chrome - Testeando Dia</li>
              <li><strong>Diseño:</strong> Cualquier plataforma que me sea útil</li>
            </ul>
          </div>

          <div className="stack-category">
            <h3>🎮 Gaming</h3>
            <ul>
              <li><strong>Consola:</strong> XBOX Series S - Tengo una PC que no suo T_T</li>
              <li><strong>Juego actual:</strong> Crimson Desert</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}