import AskButton from "./AskButton";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "01/08/2022–25/10/2025" -> "Aug 2022 – Oct 2025" (tolerates typos like "01/011/2021")
function fmt(d: string) {
  return d
    .replace(/(\d{1,2})\/(\d{1,3})\/(\d{4})/g, (_, _d, m, y) => `${MON[parseInt(m, 10) - 1] ?? m} ${y}`)
    .replace("–", " – ")
    .trim();
}
const rank = (d: string) => (/present/i.test(d) ? 9999 : Number(d.match(/(\d{4})\D*$/)?.[1] ?? 0));

type Job = { company: string; role: string; duration: string };

export default function Experience({ items }: { items?: Job[] }) {
  if (!items?.length) return null;
  const jobs = [...items].sort((a, b) => rank(b.duration) - rank(a.duration));

  return (
    <section id="experience">
      <h2 className="section-title">Experience</h2>
      <ol className="exp">
        {jobs.map((j) => (
          <li key={j.company + j.role}>
            <span className="exp__role">{j.role}</span>
            <span className="exp__meta">{j.company} · {fmt(j.duration)}</span>
          </li>
        ))}
      </ol>
      <AskButton className="link-btn" prompt="Tell me about Koushik's experience in detail.">
        Full details →
      </AskButton>
    </section>
  );
}
