"use client";

interface CalendarProps {
    postDates: string[]; // Array of ISO date strings when posts were created
}

export function ContributionsCalendar({ postDates }: CalendarProps) {
    const today = new Date();
    const weeks = 52;
    const days: { date: string; count: number }[] = [];

    // Generate last 52 weeks of days
    for (let i = weeks * 7 - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const count = postDates.filter((d) => d.startsWith(dateStr)).length;
        days.push({ date: dateStr, count });
    }

    // Group into weeks (columns)
    const weekColumns: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
        weekColumns.push(days.slice(i, i + 7));
    }

    const getColor = (count: number) => {
        if (count === 0) return "var(--bg-tertiary)";
        if (count === 1) return "#2d5a3f";
        if (count === 2) return "#3d7a52";
        return "#4a9c6d";
    };

    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

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

            <style>{`
        .calendar-wrapper {
          margin: 2rem 0;
        }
        .calendar-title {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }
        .calendar-grid {
          display: flex;
          gap: 3px;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }
        .calendar-week {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .calendar-day {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .calendar-day:hover {
          opacity: 0.8;
          outline: 1px solid var(--text-muted);
        }
      `}</style>
        </div>
    );
}