"use client";

import { useMemo } from "react";

interface CalendarProps {
  postDates: string[];
}

export function ContributionsCalendar({ postDates }: CalendarProps) {
  const { weekColumns, monthLabels } = useMemo(() => {
    const today = new Date();
    const weeks = 52;
    const days: { date: string; count: number; dayOfWeek: number }[] = [];

    // Tally posts per day once (O(posts)) instead of scanning the array per day.
    const countByDate = new Map<string, number>();
    for (const d of postDates) {
      const day = d.slice(0, 10);
      countByDate.set(day, (countByDate.get(day) ?? 0) + 1);
    }

    for (let i = weeks * 7 - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      days.push({ date: dateStr, count: countByDate.get(dateStr) ?? 0, dayOfWeek: date.getDay() });
    }

    const weekColumns: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekColumns.push(days.slice(i, i + 7));
    }

    // Calculate month labels with their position
    const monthLabels: { label: string; col: number }[] = [];
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    let lastMonth = -1;

    weekColumns.forEach((week, i) => {
      const firstDay = new Date(week[0].date);
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: months[month], col: i });
        lastMonth = month;
      }
    });

    return { weekColumns, monthLabels };
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
      <div className="calendar-months">
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
        <div className="calendar-day-labels">
          {dayLabels.map((label, i) => (
            <div key={i} className="calendar-day-label">
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="calendar-grid">
          {weekColumns.map((week, wi) => (
            <div key={wi} className="calendar-week">
              {week.map((day) => (
                <div
                  key={day.date}
                  className="calendar-day"
                  title={`${day.date}: ${day.count} post${day.count !== 1 ? "s" : ""}`}
                  style={{ background: getColor(day.count) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}