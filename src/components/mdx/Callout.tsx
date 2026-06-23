interface CalloutProps {
    type?: "tip" | "warning" | "note" | "danger";
    title?: string;
    children: React.ReactNode;
}

const icons: Record<string, string> = {
    tip: "💡",
    warning: "⚠️",
    note: "ℹ️",
    danger: "🚨",
};

const defaultTitles: Record<string, string> = {
    tip: "Tip",
    warning: "Advertencia",
    note: "Nota",
    danger: "Importante",
};

export function Callout({ type = "note", title, children }: CalloutProps) {
    return (
        <div className={`callout callout-${type}`}>
            <div className="callout-header">
                <span className="callout-icon">{icons[type]}</span>
                <span className="callout-title">{title || defaultTitles[type]}</span>
            </div>
            <div className="callout-content">{children}</div>
        </div>
    );
}