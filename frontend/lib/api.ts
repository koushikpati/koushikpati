// src/lib/api.js
// Thin client around the FastAPI backend. Reads the base URL from
// NEXT_PUBLIC_API_URL so it can point at localhost in dev and your
// Render/Railway deployment in prod.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }

  return res.json();
}

// GET /resume — full resume payload (experience, education, skills, contact)
export function getResume() {
  return request("/resume", { cache: "no-store" });
}

// GET /projects — full project list
export function getProjects() {
  return request("/projects", { cache: "no-store" });
}

// POST /chat — send a message to the LangChain + FastMCP agent
export function sendChatMessage(message: string) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}
