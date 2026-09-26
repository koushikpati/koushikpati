// src/app/page.jsx
// App Router server component. Fetches resume + projects on the server
// (equivalent to your old React app's initial GET /resume and /projects
// calls) and passes them down as props. ChatBot is the only client
// component that talks to the backend at runtime (POST /chat).

import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ChatBot from "@/components/ChatBot";
import { getResume, getProjects } from "@/lib/api";
import {Analytics} from "@vercel/analytics/react";

export default async function HomePage() {
  const [resume, projects] = await Promise.all([
    getResume().catch(() => null),
    getProjects().catch(() => []),
  ]);

  return (
    <main id="top" className="page">
      <Hero resume={resume} />
      <Skills skills={resume?.skills} />
      <Projects projects={projects} />
      <ChatBot />
      <Analytics />
    </main>
  );
}
