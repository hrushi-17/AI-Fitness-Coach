import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  // =========================
  // UPDATE FOR DEPLOYMENT:
  // Use Render backend URL from env variable
  // Fallback to localhost for local development
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  // =========================

  // List of keywords for automatic highlighting
  const keywordColors = {
    breakfast: "red",
    lunch: "red",
    dinner: "red",
    squats: "blue",
    "bench press": "blue",
    deadlift: "blue",
    plank: "blue",
  };

  // List of emojis for casual AI messages
  const casualEmoji = ["🤖", "💡", "✅", "⚡", "💪", "🥗"];

  const fetchHistory = async () => {
    try {
      // =========================
      // UPDATED: use API_URL
      const res = await fetch(`${API_URL}/history`);
      // =========================
      const data = await res.json();

      const formattedChat = data.map((c) => {
        // Assign a fixed emoji once for each AI message
        const randomEmoji = casualEmoji[Math.floor(Math.random() * casualEmoji.length)];
        return {
          type: "ai",
          text: c.reply,
          userMsg: c.message,
          emoji: randomEmoji, // store emoji in message
        };
      });

      setChat(
        formattedChat.flatMap((item) => [
          { type: "user", text: item.userMsg },
          { type: "ai", text: item.text, emoji: item.emoji },
        ])
      );
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { type: "user", text: message };
    const loadingMsg = { type: "ai", text: "AI is preparing your response...", emoji: "🤖" };
    setChat((prev) => [...prev, userMsg, loadingMsg]);
    setMessage("");

    try {
      // =========================
      // UPDATED: use API_URL
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      // =========================

      const data = await res.json();

      // Assign fixed emoji once for this AI message
      const randomEmoji = casualEmoji[Math.floor(Math.random() * casualEmoji.length)];

      const aiMsg = { type: "ai", text: data.reply, emoji: randomEmoji };
      setChat((prev) => [...prev.slice(0, -1), aiMsg]);
    } catch (err) {
      setChat((prev) => [
        ...prev.slice(0, -1),
        { type: "ai", text: "Server error. Try again.", emoji: "⚠️" },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const deleteHistory = async () => {
    try {
      // =========================
      // UPDATED: use API_URL
      await fetch(`${API_URL}/history`, { method: "DELETE" });
      // =========================
      setChat([]);
    } catch (err) {
      console.error("Failed to delete history:", err);
    }
  };

  const renderStructuredText = (msg) => {
    const { text, emoji } = msg; // use stored emoji
    if (!text) return null;
    const lines = text.split("\n");

    return lines.map((line, idx) => {
      line = line.trim();
      if (!line) return <br key={idx} />;

      // Headings
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <strong
            key={idx}
            style={{
              display: "block",
              color: "#ff4d4d",
              fontSize: "1.1rem",
              margin: "8px 0",
            }}
          >
            {line.replace(/\*\*/g, "")}
          </strong>
        );
      }

      // Lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        // highlight keywords
        Object.keys(keywordColors).forEach((kw) => {
          const regex = new RegExp(`\\b${kw}\\b`, "gi");
          line = line.replace(
            regex,
            (match) => `<span style="color:${keywordColors[kw]}; font-weight:700">${match}</span>`
          );
        });

        return (
          <li
            key={idx}
            style={{ marginBottom: "5px", lineHeight: "1.4", color: "#f0f0f0" }}
            dangerouslySetInnerHTML={{ __html: line.replace(/^- |\* /, "") }}
          />
        );
      }

      // Collapsible sections for long lists
      if (line.startsWith("Day:")) {
        return (
          <div key={idx} style={{ margin: "8px 0" }}>
            <button className="collapsible">{line}</button>
            <div className="content">
              <p>Click to expand meals/exercises...</p>
            </div>
          </div>
        );
      }

      // Emoji highlights
      if (line.includes("🥗") || line.includes("💪") || line.includes("🍳") || line.includes("⚠️") || line.includes("💡") || line.includes("✅")) {
        return (
          <span key={idx} style={{ display: "block", margin: "5px 0", fontSize: "1rem" }}>
            {line}
          </span>
        );
      }

      // Casual text fallback: append fixed emoji
      line = line + " " + (emoji || "🤖");

      // Bold inline text
      line = line.replace(/\*\*(.*?)\*\*/g, (_, p1) => `<b>${p1}</b>`);

      return (
        <p
          key={idx}
          style={{
            margin: "5px 0",
            lineHeight: "1.5",
            fontSize: "0.95rem",
            color: "#ffffff",
          }}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      );
    });
  };

  // Collapsible toggle function
  useEffect(() => {
    const collapsibles = document.querySelectorAll(".collapsible");
    collapsibles.forEach((c) => {
      c.onclick = function () {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        content.style.display = content.style.display === "block" ? "none" : "block";
      };
    });
  }, [chat]);

  return (
    <div className="chat-container shadow-lg">
      <div className="chat-header d-flex justify-content-between align-items-center">
        💪 AI Fitness Coach
        <button className="btn btn-danger btn-sm" onClick={deleteHistory}>
          Delete All History
        </button>
      </div>

      <div className="chat-body">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-msg ${msg.type} ${msg.type === "ai" ? "ai-card" : ""}`}
          >
            {msg.type === "user" && <span>{msg.text}</span>}
            {msg.type === "ai" && <div>{renderStructuredText(msg)}</div>}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-input input-group">
        <input
          type="text"
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask your fitness or diet question..."
        />
        <button className="btn btn-danger" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
