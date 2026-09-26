"use client";

// src/components/Projects.jsx
// Client component: receives the full project list as a prop (fetched
// server-side) and does instant local filtering by name/tech/category.
// If you want the filter to actually go through the MCP `search_projects`
// tool instead, swap the local filter for a call to sendChatMessage().

import { useState, useMemo } from "react";

type Project = {
  id: string | number;
  name: string;
  description: string;
  tech?: string[];
  category?: string;
  github?: string;
  live?: string;
};

export default function Projects({ projects = [] }: { projects?: Project[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return projects;
    const q = query.toLowerCase();
    return projects.filter((p) => {
      const haystack = `${p.name} ${p.description} ${p.tech?.join(" ")} ${p.category}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, projects]);

  return (
    <section id="projects" className="projects">
      <div className="projects__header">
        <h2 className="section-title">Projects</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by tech, category, keyword..."
          className="projects__search"
          aria-label="Filter projects"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="projects__empty">No projects match “{query}”.</p>
      ) : (
        <div className="projects__grid">
          {filtered.map((p) => (
            <article key={p.id} className="project-card">
              <div className="project-card__top">
                <h3>{p.name}</h3>
                <span className="project-card__category">{p.category}</span>
              </div>
              <p className="project-card__desc">{p.description}</p>
              <ul className="project-card__tech">
                {p.tech?.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="project-card__links">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer">
                    Code
                  </a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer">
                    Live
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
