import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // IMPORTANT for offcanvas
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  const API_URL = "https://ai-fitness-coach-35n1.onrender.com";

  const keywordColors = {
    breakfast: "red",
    lunch: "red",
    dinner: "red",
    squats: "blue",
    "bench press": "blue",
    deadlift: "blue",
    plank: "blue",
  };

  const casualEmoji = ["🤖", "💡", "✅", "⚡", "💪", "🥗"];

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/history`);
      const data = await res.json();

      const formattedChat = data.map((c) => {
        const randomEmoji =
          casualEmoji[Math.floor(Math.random() * casualEmoji.length)];
        return {
          type: "ai",
          text: c.reply,
          userMsg: c.message,
          emoji: randomEmoji,
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
    const loadingMsg = {
      type: "ai",
      text: "AI is preparing your response...",
      emoji: "🤖",
    };

    setChat((prev) => [...prev, userMsg, loadingMsg]);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const randomEmoji =
        casualEmoji[Math.floor(Math.random() * casualEmoji.length)];

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
      await fetch(`${API_URL}/history`, { method: "DELETE" });
      setChat([]);
    } catch (err) {
      console.error("Failed to delete history:", err);
    }
  };

  const renderStructuredText = (msg) => {
    const { text, emoji } = msg;
    if (!text) return null;
    const lines = text.split("\n");

    return lines.map((line, idx) => {
      line = line.trim();
      if (!line) return <br key={idx} />;

      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <strong key={idx} className="ai-heading">
            {line.replace(/\*\*/g, "")}
          </strong>
        );
      }

      if (line.startsWith("- ") || line.startsWith("* ")) {
        Object.keys(keywordColors).forEach((kw) => {
          const regex = new RegExp(`\\b${kw}\\b`, "gi");
          line = line.replace(
            regex,
            (match) =>
              `<span style="color:${keywordColors[kw]}; font-weight:700">${match}</span>`
          );
        });

        return (
          <li
            key={idx}
            dangerouslySetInnerHTML={{
              __html: line.replace(/^- |\* /, ""),
            }}
          />
        );
      }

      line = line + " " + (emoji || "🤖");
      line = line.replace(/\*\*(.*?)\*\*/g, (_, p1) => `<b>${p1}</b>`);

      return (
        <p
          key={idx}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      );
    });
  };

  return (
    <>
      <div className="chat-container">
        {/* HEADER */}
        <div className="chat-header d-flex justify-content-between align-items-center">
          <button
            className="btn btn-light btn-sm"
            data-bs-toggle="offcanvas"
            data-bs-target="#historyCanvas"
          >
            ☰
          </button>

          <span>💪 AI Fitness Coach</span>

          <div style={{ width: "40px" }}></div>
        </div>

        {/* BODY */}
        <div className="chat-body">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-msg ${msg.type} ${
                msg.type === "ai" ? "ai-card" : ""
              }`}
            >
              {msg.type === "user" && <span>{msg.text}</span>}
              {msg.type === "ai" && <div>{renderStructuredText(msg)}</div>}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* INPUT */}
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

      {/* OFFCANVAS HISTORY */}
      <div
        className="offcanvas offcanvas-start text-bg-dark"
        tabIndex="-1"
        id="historyCanvas"
      >
        <div className="offcanvas-header">
          <h5>Chat History</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body">
          {chat.length === 0 && <p>No history yet.</p>}

          {chat
            .filter((msg) => msg.type === "user")
            .map((msg, index) => (
              <div key={index} className="history-item">
                {msg.text}
              </div>
            ))}

          <button
            className="btn btn-danger w-100 mt-3"
            onClick={deleteHistory}
          >
            Delete All History
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
