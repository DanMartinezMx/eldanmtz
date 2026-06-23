import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
  alternates: {
    canonical: "https://eldanmtz.com/about",
  },
  openGraph: {
    title: "Sobre mí — El otro Tab",
    description: "Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.",
    url: "https://eldanmtz.com/about",
  },
};

export default function AboutPage() {
  const stack = [
    {
      emoji: "💻",
      label: "Hardware",
      items: [
        { name: "Laptop", value: "MacBook Pro M-series" },
        { name: "Monitor", value: "LG -notengoideaquemodelo-" },
        { name: "Teclado", value: "Magic Keyboard" },
        { name: "Mouse", value: "Magic Mouse - Lo odio" },
        { name: "Audífonos", value: "JBL - TUNE670NC" },
      ],
    },
    {
      emoji: "🛠️",
      label: "Desarrollo",
      items: [
        { name: "Editor", value: "VS Code" },
        { name: "Terminal", value: "cmux - como Disneylandia para Devs" },
        { name: "Framework", value: "Next.js - estoy aprendiendo" },
        { name: "CMS", value: "TinaCMS - por ahora" },
        { name: "Hosting", value: "Vercel - free" },
      ],
    },
    {
      emoji: "📱",
      label: "Apps",
      items: [
        { name: "Notas", value: "Google Keep" },
        { name: "Música", value: "YT Music - El Mejor algoritmo tbh" },
        { name: "Navegador", value: "Chrome - Testeando Dia" },
        { name: "Diseño", value: "Cualquier plataforma que me sea útil" },
      ],
    },
    {
      emoji: "🎮",
      label: "Gaming",
      items: [
        { name: "Consola", value: "XBOX Series S - Tengo una PC que no uso T_T" },
        { name: "Juego actual", value: "Crimson Desert" },
      ],
    },
  ];

  return (
    <div className="about-page">
      <h1>Sobre mí</h1>

      {/* Bio cards */}
      <div className="about-grid">
        <div className="about-card about-card-wide">
          <div className="about-card-header">
            <span className="about-card-emoji">👋</span>
            <span className="about-card-label">¿Quién soy?</span>
          </div>
          <div className="about-card-body">
            <p>Soy Dan. Soy papá, esposo, y hasta donde sé, humano.</p>
            <p>Me gusta cocinar, jugar videojuegos, ver películas, leer y escribir, cuándo la paternidad da un descanso.</p>
            <p>Honestamente no sé que más puedo escribir sobre mi. Me irán conociendo más en los posts. Y en las otras secciones del blog.</p>
            <p>Espero que este blog sea de tu agrado. Que te haga reir, aprender algo nuevo, cuestionarte, o pasar el rato mientras estás en el baño. No todo son reels.</p>
          </div>
        </div>

        <div className="about-card about-card-wide">
          <div className="about-card-header">
            <span className="about-card-emoji">📝</span>
            <span className="about-card-label">Sobre el Blog</span>
          </div>
          <div className="about-card-body">
            <p>Este es mi espacio personal en internet.</p>
            <p>Aquí escribo sobre lo que me interesa: tecnología, cocina, gaming, viajes, cine y la vida en general.</p>
            <p>No hay un tema fijo porque no soy experto en nada — este blog es un reflejo de mis intereses.</p>
            <p>Estoy aprendiendo un montón de cosas nuevas, así que muchas de esas cosas que vaya aprendiendo, las iré compartiendo aquí.</p>
          </div>
        </div>
      </div>

      {/* Stack section */}
      <div className="about-stack-divider">
        <h2>🛠️ Mi Stack</h2>
        <p>Las herramientas y setup que uso día a día.</p>
      </div>

      <div className="about-grid">
        {stack.map((category) => (
          <div key={category.label} className="about-card">
            <div className="about-card-header">
              <span className="about-card-emoji">{category.emoji}</span>
              <span className="about-card-label">{category.label}</span>
            </div>
            <ul className="about-stack-list">
              {category.items.map((item) => (
                <li key={item.name}>
                  <span className="stack-item-name">{item.name}</span>
                  <span className="stack-item-value">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}