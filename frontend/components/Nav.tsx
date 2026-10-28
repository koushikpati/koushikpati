"use client";

import { useState } from "react";

const LINKS = [
  ["Work", "#work"],
  ["Stack", "#stack"],
  ["Ask AI", "#ask"],
  ["Contact", "#contact"],
];
// Set NEXT_PUBLIC_RESUME_URL (e.g. /resume.pdf) to show a Resume link
const RESUME = process.env.NEXT_PUBLIC_RESUME_URL;

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav" aria-label="Primary">
      <a href="#top" className="nav-logo">Koushik Pati</a>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="nav-links"
        aria-label="Toggle menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕" : "☰"}
      </button>
      <ul id="nav-links" className={`nav-links${open ? " nav-links-open" : ""}`}>
        {LINKS.map(([label, href]) => (
          <li key={href}>
            <a href={href} onClick={() => setOpen(false)}>{label}</a>
          </li>
        ))}
        {RESUME && (
          <li>
            <a href={RESUME} target="_blank" rel="noopener noreferrer" className="nav-resume">Resume</a>
          </li>
        )}
      </ul>
    </nav>
  );
}
