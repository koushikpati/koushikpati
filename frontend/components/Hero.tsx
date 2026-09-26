// src/components/Hero.jsx
// Server component — receives resume data as a prop from the page.

type Contact = {
  github?: string;
  linkedin?: string;
  email?: string;
};

type Resume = {
  name: string;
  title: string;
  summary: string;
  contact?: Contact;
};

export default function Hero({ resume }: { resume?: Resume | null }) {
  if (!resume) return null;

  const { name, title, summary, contact } = resume;

  return (
    <section id="about" className="hero">
      <p className="hero__eyebrow">// whoami</p>
      <h1 className="hero__name">{name}</h1>
      <p className="hero__title">{title}</p>
      <p className="hero__summary">{summary}</p>

      <div className="hero__links">
        {contact?.github && (
          <a href={contact.github} target="_blank" rel="noreferrer" className="hero__link">
            GitHub
          </a>
        )}
        {contact?.linkedin && (
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="hero__link">
            LinkedIn
          </a>
        )}
        {contact?.email && (
          <a href={`mailto:${contact.email}`} className="hero__link">
            Email
          </a>
        )}
      </div>
    </section>
  );
}
