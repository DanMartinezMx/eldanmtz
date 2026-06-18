"use client";

import { useMemo } from "react";

interface CalendarProps {
  postDates: string[];
}

export function ContributionsCalendar({ postDates }: CalendarProps) {
  const { weekColumns } = useMemo(() => {
    const today = new Date();
    const weeks = 52;
    const days: { date: string; count: number }[] = [];

    for (let i = weeks * 7 - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = postDates.filter((d) => d.startsWith(dateStr)).length;
      days.push({ date: dateStr, count });
    }

    const weekColumns: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekColumns.push(days.slice(i, i + 7));
    }

    return { weekColumns };
  }, [postDates]);

  const getColor = (count: number) => {
    if (count === 0) return "var(--bg-tertiary)";
    if (count === 1) return "#2d5a3f";
    if (count === 2) return "#3d7a52";
    return "#4a9c6d";
  };

  return (
    <div className="calendar-wrapper">
      <h3 className="calendar-title">Actividad</h3>
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
  );
}
