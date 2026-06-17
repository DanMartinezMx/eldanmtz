export function Footer() {
    return (
        <footer className="site-footer">
            <p>© {new Date().getFullYear()} Dan Mtz.</p>

            <style>{`
        .site-footer {
          text-align: center;
          padding: 1rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border);
        }
      `}</style>
        </footer>
    );
}