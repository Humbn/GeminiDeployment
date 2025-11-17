// src/App.jsx
import { useState } from "react";

const BACKEND_URL = "http://localhost:8000"; // change when you deploy

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I am your AI Assistant",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setErrorText("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = data?.detail || "Unexpected error from backend.";
        throw new Error(detail);
      }

      const data = await res.json();
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.reply,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setErrorText(err.message || "Something went wrong.");
      const botMsg = {
        id: Date.now() + 2,
        sender: "bot",
        text: "Sorry, I ran into an error reaching the server.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-root">
      <div className="chat-shell">
        <header className="chat-header">
          <div>
            <h1>AI Chatbot</h1>
            <p>CodeCrew Assignment</p>
          </div>
        </header>

        <section className="chat-card">
          <div className="chat-window">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${
                  msg.sender === "user"
                    ? "chat-message-user"
                    : "chat-message-bot"
                }`}
              >
                <div className="chat-avatar">
                  {msg.sender === "user" ? "You" : "Gemini"}
                </div>
                <div className="chat-bubble">{msg.text}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-message chat-message-bot">
                <div className="chat-avatar">Chatbot</div>
                <div className="chat-bubble chat-bubble-loading">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <footer className="chat-footer">
            {errorText && <div className="error-banner">{errorText}</div>}

            <form className="chat-input-row" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Ask about FastAPI, React, or Gemini..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}>
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </footer>
        </section>
      </div>
    </div>
  );
}
