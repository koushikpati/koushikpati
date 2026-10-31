// src/lib/api.js
// Thin client around the FastAPI backend. Reads the base URL from
// NEXT_PUBLIC_API_URL so it can point at localhost in dev and your
// Render/Railway deployment in prod.
import type { Resume,Project } from "@/lib/resume";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}

// GET /resume — full resume payload (experience, education, skills, contact)
// GET /resume: full resume payload (experience, education, skills, contact)
export function getResume() {
  return request<Resume>("/resume", { cache: "no-store" });
}

// GET /projects — full project list
export function getProjects() {
  return request("/projects", { cache: "no-store" });
}

// POST /chat — send a message to the LangChain + FastMCP agent
export function sendChatMessage(message: string) {
  return request<{ reply: string }>("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export type StreamEvent =
  | { type: "session"; session_id: string }
  | { type: "token"; text: string }
  | { type: "tool"; name: string }
  | { type: "done" }
  | { type: "error"; message: string };
 
/** Thrown when the server rejects the request before streaming (400, 429, 500...). */
export class StreamHttpError extends Error {
  status: number;
  constructor(status: number) {
    super(`Stream request failed (${status})`);
    this.status = status;
  }
}
 
/**
 * POSTs to /chat/stream and calls onEvent for every Server-Sent Event.
 * (EventSource only supports GET, so we read the response body manually.)
 */
export async function streamChatMessage(
  message: string,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal,
  sessionId?: string | null
): Promise<void> {
  const res = await fetch(`${API_URL}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId ?? null }),
    signal,
  });
 
  if (!res.ok || !res.body) {
    throw new StreamHttpError(res.status);
  }
 
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
 
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
 
    buffer += decoder.decode(value, { stream: true });
 
    // SSE events are separated by a blank line
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
 
    for (const part of parts) {
      const line = part.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;
 
      let event: StreamEvent | null = null;
      try {
        event = JSON.parse(line.slice(6)) as StreamEvent;
      } catch {
        continue; // ignore malformed chunk
      }
      onEvent(event); // outside try/catch so errors thrown by the handler propagate
    }
  }
}
