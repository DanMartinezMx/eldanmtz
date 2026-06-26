"use client";

import { useMemo } from "react";

interface CalendarProps {
  postDates: string[];
}

type Day = { date: string; count: number };

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const WEEKS = 52;

/** GitHub-style activity heatmap of the last ~52 weeks, aligned to real Sun–Sat calendar weeks. */
export function ContributionsCalendar({ postDates }: CalendarProps) {
  const { weekColumns, monthLabels, total } = useMemo(() => {
    // Tally posts per day once. Post dates are ISO (UTC), so work in UTC throughout.
    const countByDate = new Map<string, number>();
    for (const d of postDates) {
      const day = d.slice(0, 10);
      countByDate.set(day, (countByDate.get(day) ?? 0) + 1);
    }

    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    // Start on the Sunday of the week WEEKS ago, so every column is a real
    // Sun–Sat calendar week and the weekday row labels (Lun/Mié/Vie) line up.
    const start = new Date(today);
    start.setUTCDate(today.getUTCDate() - today.getUTCDay() - WEEKS * 7);

    const weekColumns: (Day | null)[][] = [];
    const cursor = new Date(start);
    while (cursor <= today) {
      const week: (Day | null)[] = [];
      for (let d = 0; d < 7; d++) {
        if (cursor > today) {
          week.push(null); // future days in the current (partial) week
        } else {
          const date = cursor.toISOString().slice(0, 10);
          week.push({ date, count: countByDate.get(date) ?? 0 });
        }
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }
      weekColumns.push(week);
    }

    // Place a month label at the first column whose week starts a new month.
    const monthLabels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weekColumns.forEach((week, i) => {
      const first = week.find(Boolean);
      if (!first) return;
      const month = new Date(first.date).getUTCMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], col: i });
        lastMonth = month;
      }
    });

    let total = 0;
    for (const week of weekColumns) {
      for (const day of week) total += day?.count ?? 0;
    }

    return { weekColumns, monthLabels, total };
  }, [postDates]);

  const getColor = (count: number) => {
    if (count === 0) return "var(--bg-tertiary)";
    if (count === 1) return "#2d5a3f";
    if (count === 2) return "#3d7a52";
    return "#4a9c6d";
  };

  const dayLabels = ["", "Lun", "", "Mié", "", "Vie", ""];

  return (
    <div className="calendar-wrapper">
      <h3 className="calendar-title">Actividad</h3>

      {/* Month labels — same flex track as the grid so columns line up */}
      <div className="calendar-months" aria-hidden="true">
        <div className="calendar-day-label-spacer" />
        <div className="calendar-months-track">
          {weekColumns.map((_, i) => {
            const label = monthLabels.find((m) => m.col === i);
            return (
              <div key={i} className="calendar-month-cell">
                {label ? label.label : ""}
              </div>
            );
          })}
        </div>
      </div>

      <div className="calendar-container">
        {/* Day-of-week labels */}
        <div className="calendar-day-labels" aria-hidden="true">
          {dayLabels.map((label, i) => (
            <div key={i} className="calendar-day-label">
              {label}
            </div>
          ))}
        </div>

        {/* Grid — exposed to screen readers as a single labelled image */}
        <div
          className="calendar-grid"
          role="img"
          aria-label={`Calendario de actividad: ${total} ${total === 1 ? "publicación" : "publicaciones"} en el último año`}
        >
          {weekColumns.map((week, wi) => (
            <div key={wi} className="calendar-week">
              {week.map((day, di) =>
                day ? (
                  <div
                    key={day.date}
                    className="calendar-day"
                    title={`${day.date}: ${day.count} post${day.count !== 1 ? "s" : ""}`}
                    style={{ background: getColor(day.count) }}
                  />
                ) : (
                  <div key={`empty-${wi}-${di}`} className="calendar-day calendar-day-empty" />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
