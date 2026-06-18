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
        <a href="https://github.com/DanMartinezMx" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://x.com/eldanmtz" target="_blank" rel="noopener noreferrer">X</a>
      </div>
    </aside>
  );
}
