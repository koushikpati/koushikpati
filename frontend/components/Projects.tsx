import AskButton from "./AskButton";

type Project = {
  id: number;
  name: string;
  description: string;
  tech: string[];
  github: string | null;
  live: string | null;
  category: string;
  featured?: boolean;
  highlight?: string;
};

export default function Projects({ projects }: { projects: Project[] }) {
  if (!projects?.length) return null;
  const flagged = projects.filter((p) => p.featured);
  const featured = (flagged.length ? flagged : projects).slice(0, 3);

  return (
    <section id="work">
      <div className="projects__header">
        <h2 className="section-title">Featured work</h2>
        <AskButton className="link-btn" prompt="List all of Koushik's projects with a one-line summary each.">
          See all {projects.length} projects →
        </AskButton>
      </div>

      <div className="projects__grid">
        {featured.map((p) => (
          <article key={p.id} className="project-card">
            <div className="project-card__top">
              <h3>{p.name}</h3>
              <span className="project-card__category">{p.category}</span>
            </div>
            {p.highlight && <p className="project-card__highlight">{p.highlight}</p>}
            <p className="project-card__desc">{p.description}</p>
            <ul className="project-card__tech">
              {p.tech.slice(0, 3).map((t) => <li key={t}>{t}</li>)}
              {p.tech.length > 3 && <li>+{p.tech.length - 3}</li>}
            </ul>
            {(p.github || p.live) && (
              <div className="project-card__links">
                {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer">Code</a>}
                {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer">Live</a>}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
