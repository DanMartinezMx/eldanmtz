import type { Metadata } from "next";
import { getAllDates } from "@/lib/content";
import { ContributionsCalendar } from "@/components/ContributionsCalendar";

export const metadata: Metadata = {
  title: "Enfoque",
  description: "Esto es en lo que estoy metido actualmente.",
  alternates: {
    canonical: "https://eldanmtz.com/now",
  },
  openGraph: {
    title: "Enfoque — El otro Tab",
    description: "Esto es en lo que estoy metido actualmente.",
    url: "https://eldanmtz.com/now",
  },
};

export default function NowPage() {
  const allDates = getAllDates();

  const focusItems = [
    {
      emoji: "🎯",
      label: "Enfocado en",
      items: [
        "Construyendo este blog desde cero con Next.js + TinaCMS",
        "Re-aprendiendo CSS y Javascript",
        "Aprendiendo React/Next.js a fondo",
      ],
    },
    {
      emoji: "📚",
      label: "Leyendo",
      items: ["Dune: Mesias"],
    },
    {
      emoji: "🎮",
      label: "Jugando",
      items: ["Crimson Desert"],
    },
    {
      emoji: "🎬",
      label: "Viendo",
      items: ["Asesino sin memoria"],
    },
  ];

  return (
    <div className="now-page">
      <h1>Enfoque</h1>
      <p className="now-subtitle">Esto es en lo que estoy metido actualmente.</p>

      <div className="now-calendar">
        <ContributionsCalendar postDates={allDates} />
      </div>

      <div className="now-grid">
        {focusItems.map((section) => (
          <div key={section.label} className="now-card">
            <div className="now-card-header">
              <span className="now-card-emoji">{section.emoji}</span>
              <span className="now-card-label">{section.label}</span>
            </div>
            <ul className="now-card-list">
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="now-updated">Última actualización: Junio 2026</p>
    </div>
  );
}