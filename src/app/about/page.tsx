import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "El otro tab by Dan Mtz",
  description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
  openGraph: {
    title: "El otro tab by Dan Mtz.",
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
        <p>Espero que este blog sea de tu agrado. Que te haga reir, aprender algo nuevo,
          cuestionarte, o pasar el rato mientras estás en el baño. No todo son reels.
        </p>
        <p>Pero por si si, acá están los míos</p>
      </section>

      <section className="about-section">
        <h2>Instagram</h2>
        <div className="instagram-placeholder">
          <p>Bueno aquí estarán los reels... aun no aprendo lo suficiente para hacer esto... </p>
        </div>
      </section>
    </div>
  );
}
