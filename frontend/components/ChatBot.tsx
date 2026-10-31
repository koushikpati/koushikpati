"use client";

// src/components/ChatBot.tsx
// Streams the assistant's reply token-by-token from POST /chat/stream.
// Falls back to the regular POST /chat if streaming fails before any text arrives.

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendChatMessage, streamChatMessage, StreamHttpError } from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

const WELCOME: Message = {
  role: "assistant",
  content: "Ask me about my projects, skills, experience, or how to get in touch.",
};

const SUGGESTIONS = [
  "What is Koushik's experience?",
  "Which projects use LangGraph?",
  "What are his key skills?",
  "How can I contact him?",
];

const NEAR_BOTTOM_PX = 120;

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const stickToBottom = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const sessionRef = useRef<string | null>(null); // backend session id, reused every turn

  // Cancel any in-flight stream when the component unmounts
  useEffect(() => () => abortRef.current?.abort(), []);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) {
      // "auto" while streaming avoids jitter from stacked smooth-scroll animations
      el.scrollTo({ top: el.scrollHeight, behavior: loading ? "auto" : "smooth" });
    }
  }, [messages, loading, status]);

  // Update the last message (the assistant placeholder being streamed into)
  const updateLast = useCallback((fn: (m: Message) => Message) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const copy = prev.slice();
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || loading) return;

      const controller = new AbortController();
      abortRef.current = controller;
      stickToBottom.current = true;

      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
        { role: "assistant", content: "", streaming: true }, // placeholder
      ]);
      setInput("");
      setLoading(true);
      setStatus(null);
      setError(null);

      let receivedText = false;

      try {
        await streamChatMessage(
          text,
          (event) => {
            if (event.type === "token") {
              receivedText = true;
              setStatus(null);
              updateLast((m) => ({ ...m, content: m.content + event.text }));
            } else if (event.type === "session") {
              sessionRef.current = event.session_id;
            } else if (event.type === "tool") {
              setStatus(`Checking ${event.name.replace(/_/g, " ")}…`);
            } else if (event.type === "error") {
              throw new Error(event.message);
            }
          },
          controller.signal,
          sessionRef.current
        );
      } catch (err) {
        if (controller.signal.aborted) return;

        // Rate limit or rejected message: show the real reason, don't retry
        if (err instanceof StreamHttpError && err.status < 500) {
          setMessages((prev) => prev.slice(0, -1)); // drop empty placeholder
          setError(
            err.status === 429
              ? "You're sending messages too quickly. Please wait a minute and try again."
              : "That message couldn't be processed. Try rephrasing it."
          );
          return;
        }

        if (!receivedText) {
          // Streaming failed before anything showed up: try the normal endpoint
          try {
            const data = await sendChatMessage(text);
            updateLast((m) => ({ ...m, content: data.reply }));
          } catch {
            setMessages((prev) => prev.slice(0, -1)); // drop empty placeholder
            setError("Couldn't reach the assistant. Is the backend running?");
          }
        } else {
          setError("Connection interrupted. The answer above may be incomplete.");
        }
      } finally {
        updateLast((m) => (m.role === "assistant" ? { ...m, streaming: false } : m));
        setLoading(false);
        setStatus(null);
      }
    },
    [loading, updateLast]
  );

  // Lets other sections (AskButton) send a prompt to the chat
  const sendRef = useRef(send);
  useEffect(() => {
    sendRef.current = send;
  }, [send]);
  useEffect(() => {
    const onAsk = (e: Event) => sendRef.current((e as CustomEvent<string>).detail);
    window.addEventListener("chat:ask", onAsk);
    return () => window.removeEventListener("chat:ask", onAsk);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    send(input);
  }

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <section className="chatbot" id="ask">
      <div className="chatbot__window">
        <div className="chatbot__bar">
          <h2>Ask the assistant</h2>
        </div>
        <div
          className="chatbot__log"
          ref={scrollRef}
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
        >
          {messages.map((m, i) => {
            const waiting = m.role === "assistant" && m.streaming && m.content === "";

            return (
              <div
                key={i}
                className={`chatbot__msg chatbot__msg--${m.role}${
                  m.streaming && !waiting ? " chatbot__msg--streaming" : ""
                }${waiting ? " chatbot__msg--typing" : ""}`}
              >
                <span className="chatbot__prompt">
                  {m.role === "user" ? "you >" : "bot >"}
                </span>

                {waiting ? (
                  <span className="chatbot__waiting">
                    <span className="chatbot__dots" aria-label="Assistant is typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                    {status && <span className="chatbot__status">{status}</span>}
                  </span>
                ) : m.role === "assistant" ? (
                  <div className="chatbot__content chatbot__md">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" />
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="chatbot__content chatbot__plain">{m.content}</div>
                )}
              </div>
            );
          })}

          {showSuggestions && (
            <div className="chatbot__chips">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chatbot__chip"
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
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
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="chatbot__send"
          >
            Send
          </button>
        </form>

        {error && (
          <p className="chatbot__error" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
