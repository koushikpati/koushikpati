// FILE PATH: src/components/Nav.tsx
"use client";

import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

const LINKS: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Main navigation" className="nav">
      <a href="#top" className="nav-logo">
        Your Name
      </a>

      <button
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="nav-links"
        aria-label="Toggle navigation menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✕" : "☰"}
      </button>

      <ul id="nav-links" className={`nav-links ${open ? "nav-links-open" : ""}`}>
        {LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
