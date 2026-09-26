// src/components/Skills.jsx
// Server component — renders the skills array from the resume payload.

export default function Skills({ skills = [] }) {
  if (!skills.length) return null;

  return (
    <section id="skills" className="skills">
      <h2 className="section-title">Skills</h2>
      <ul className="skills__list">
        {skills.map((skill) => (
          <li key={skill} className="skills__tag">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
