import { getResume } from "@/lib/api";

export default async function Footer() {
  const r = await getResume().catch(() => null);
  const c = r?.contact ?? {};
  const email = String(c.email ?? "").split(",")[0].trim();
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL;
  const links: [string, string | undefined][] = [
    ["Email", email ? `mailto:${email}` : undefined],
    ["LinkedIn", c.linkedin],
    ["GitHub", c.github],
    ["Resume", resumeUrl],
  ];

  return (
    <footer id="contact" className="footer">
      <h2 className="footer__title">Open to work. Say hello.</h2>
      <div className="footer-links">
        {links.filter(([, h]) => h).map(([label, href]) => (
          <a key={label} href={href} target={href!.startsWith("http") || href!.startsWith("/") ? "_blank" : undefined} rel="noopener noreferrer">
            {label}
          </a>
        ))}
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} {r?.name ?? "Koushik Pati"}</p>
    </footer>
  );
}
