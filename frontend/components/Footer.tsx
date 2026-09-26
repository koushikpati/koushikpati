// FILE PATH: src/components/Footer.tsx

import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="footer">
      <div className="footer-links">
        <a href="mailto:you@example.com">Email</a>
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
      <p className="footer-copy">
        © {year} Koushik. Built with Next.js, LangChain, and FastMCP.
      </p>
    </footer>
  );
}
