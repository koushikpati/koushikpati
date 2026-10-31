type Row = [string, string[]];

const GROUPS: [string, string[]][] = [
  ["GenAI", ["generative_ai"]],
  ["ML", ["data_science_and_ml"]],
  ["Build", ["programming_languages", "frameworks"]],
  ["Cloud", ["cloud_platforms", "devops_and_tools"]],
];
const MAX = 6;

export default function Skills({ skill, skills }: { skill?: Record<string, string[]>; skills?: string[] }) {
  const rows: Row[] = skill
    ? GROUPS.map(([label, keys]) => [label, keys.flatMap((k) => skill[k] ?? [])] as Row).filter(([, v]) => v.length)
    : skills?.length
      ? [["Skills", skills]]
      : [];
  if (!rows.length) return null;

  return (
    <section id="stack">
      <h2 className="section-title">Stack</h2>
      <dl className="stack">
        {rows.map(([label, items]) => (
          <div key={label} className="stack__row">
            <dt>{label}</dt>
            <dd>
              {items.slice(0, MAX).map((s) => <span key={s} className="skills__tag">{s}</span>)}
              {items.length > MAX && <span className="stack__more">+{items.length - MAX}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
