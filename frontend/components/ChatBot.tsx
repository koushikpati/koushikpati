"use client";

// src/components/ChatBot.jsx
// Client component — talks to POST /chat, which runs the LangChain
// agent backed by your FastMCP tools (get_resume, search_projects, etc).

import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/lib/api";

const WELCOME = {
  role: "assistant",
  content: "Ask me about my projects, skills, experience, or how to get in touch.",
};

export default function ChatBot() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const data = await sendChatMessage(text);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  } catch {
      setError("Couldn't reach the assistant. Is the backend running?");
  } finally {
      setLoading(false);
    } 
  }
  return (
    <section className="chatbot">
      <h2 className="section-title">Ask the assistant</h2>

      <div className="chatbot__window">
        <div className="chatbot__log" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`chatbot__msg chatbot__msg--${m.role}`}>
              <span className="chatbot__prompt">{m.role === "user" ? "you >" : "bot >"}</span>
              <span>{m.content}</span>
            </div>
          ))}
          {loading && (
            <div className="chatbot__msg chatbot__msg--assistant chatbot__msg--typing">
              <span className="chatbot__prompt">bot &gt;</span>
              <span className="chatbot__dots" aria-label="Assistant is typing">
                <span></span><span></span><span></span>
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="chatbot__form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. What projects use React?"
            disabled={loading}
            className="chatbot__input"
            aria-label="Message"
          />
          <button type="submit" disabled={loading || !input.trim()} className="chatbot__send">
            Send
          </button>
        </form>

        {error && <p className="chatbot__error">{error}</p>}
      </div>
    </section>
  );
}
