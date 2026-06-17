"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MicroblogFeed } from "./MicroblogFeed";

export function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home", icon: "🏠" },
        { href: "/now", label: "Now", icon: "⚡" },
        { href: "/blog", label: "Blog", icon: "✍️" },
        { href: "/about", label: "About", icon: "👤" },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <Link href="/" className="logo">
                    Dan Mtz.
                </Link>

                <nav className="nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-link ${pathname === item.href ? "active" : ""}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="sidebar-section">
                <h3 className="sidebar-heading">Microblog</h3>
                <MicroblogFeed />
            </div>

            <div className="sidebar-section socials">
                <a href="https://github.com/DanMartinezMx" target="_blank" rel="noopener">GitHub</a>
                <a href="https://x.com/eldanmtz" target="_blank" rel="noopener">X</a>
            </div>

            <style>{`
        .sidebar {
          width: 280px;
          min-height: 100vh;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: sticky;
          top: 0;
          overflow-y: auto;
        }
        .logo {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
          display: block;
          margin-bottom: 1.5rem;
        }
        .nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          transition: all 0.15s;
        }
        .nav-link:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .nav-link.active {
          background: var(--bg-tertiary);
          color: var(--accent);
        }
        .nav-icon {
          font-size: 1rem;
        }
        .sidebar-heading {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }
        .socials {
          margin-top: auto;
          display: flex;
          gap: 1rem;
        }
        .socials a {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .socials a:hover {
          color: var(--accent);
        }
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            min-height: auto;
            position: relative;
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
        }
      `}</style>
        </aside>
    );
}