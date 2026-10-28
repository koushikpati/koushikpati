"use client";

// Sends a prompt to the chatbot (ChatBot listens for "chat:ask") and scrolls to it.
export default function AskButton({
  prompt,
  children,
  className = "btn",
}: {
  prompt: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("chat:ask", { detail: prompt }));
        document.getElementById("ask")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }}
    >
      {children}
    </button>
  );
}
