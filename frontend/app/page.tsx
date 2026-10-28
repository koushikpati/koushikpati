// src/app/page.tsx
// Server component: fetches resume + projects, composes the sections.
// <Analytics /> lives in layout.tsx only (it was rendered twice before).

import Hero from "@/components/Hero";
import ChatBot from "@/components/ChatBot";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import { getResume, getProjects } from "@/lib/api";

export default async function HomePage() {
  const [resume, projects] = await Promise.all([
    getResume().catch(() => null),
    getProjects().catch(() => []),
  ]);

  return (
    <main id="top" className="page">
      <div className="hero-grid">
        <Hero resume={resume} />
        <ChatBot />
      </div>
      <Projects projects={projects} />
      <div className="split">
        <Skills skill={resume?.skill} skills={resume?.skills} />
        <Experience items={resume?.experience} />
      </div>
    </main>
  );
}
