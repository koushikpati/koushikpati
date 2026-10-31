import AskButton from "./AskButton";
import type { Resume } from "@/lib/resume";

export default function Hero({ resume }: { resume: Resume | null}) {
  if (!resume) return null;
  const c = resume.contact ?? {};
  const email = String(c.email ?? "").split(",")[0].trim();
  const links = [
    ["GitHub", c.github],
    ["LinkedIn", c.linkedin],
    ["Email", email && `mailto:${email}`],
  ].filter(([, href]) => href) as [string, string][];

  return (
    <section className="hero">
      <p className="hero__eyebrow">{"// whoami"}</p>
      <h1 className="hero__name">{resume.name}</h1>
      <p className="hero__title">{resume.title}</p>
      <p className="hero__summary">{resume.tagline ?? resume.summary}</p>

      {(resume.metrics?.length ?? 0) > 0 && (
        <ul className="metrics">
          {resume.metrics?.map((m) => (
            <li key={m.label} className="metric">
              <span className="metric__value">{m.value}</span>
              <span className="metric__label">{m.label}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="hero__links">
        <AskButton prompt="Give me a quick overview of Koushik's experience.">Ask my AI</AskButton>
        {links.map(([label, href]) => (
          <a key={label} className="hero__link" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}
