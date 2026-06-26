/** Site footer: copyright line plus an RSS link. */
export function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} Creado con amor por Dan Martinez ♥️</p>
      <p className="footer-rss">
        Suscríbete - RSS
        <a href="/feed.xml" aria-label="RSS Feed">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795 0 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-8.18v4.819c12.484.076 22.59 10.167 22.66 22.661h4.82c-.07-15.148-12.326-27.392-27.48-27.48z" />
          </svg>
        </a>
      </p>
    </footer>
  );
}