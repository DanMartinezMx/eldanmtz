"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MicroblogEntry {
  title: string;
  createdAt: string;
  slug: string;
}

interface SidebarProps {
  microblogEntries: MicroblogEntry[];
}

export function Sidebar({ microblogEntries }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/now", label: "Ahora", icon: "⚡" },
    { href: "/blog", label: "Blog", icon: "✍️" },
    { href: "/about", label: "Acerca de", icon: "👤" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <Link href="/" className="logo">
          El otro tab by Dan Mtz
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
        {microblogEntries.length > 0 ? (
          <div className="microblog-feed">
            {microblogEntries.map((entry) => (
              <div key={entry.slug} className="microblog-entry">
                <p className="microblog-text">{entry.title}</p>
                <time className="microblog-time">
                  {new Date(entry.createdAt).toLocaleDateString("es-MX", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            ))}
          </div>
        ) : (
          <p className="microblog-empty">No entries yet...</p>
        )}
      </div>

      <div className="sidebar-section socials">
        <a href="https://github.com/DanMartinezMx" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://x.com/eldanmtz" target="_blank" rel="noopener noreferrer">
          X
        </a>
      </div>
    </aside>
  );
}
