import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiActivity, FiLogOut, FiTrash2 } from "react-icons/fi";

function Home() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    // Keyword highlighting colors
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
            const res = await api.get("/history");
            const data = res.data;

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
            // Optional: Redirect to login if unauthorized, handled by protected route usually
            if (err.response && err.response.status === 401) {
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            const res = await api.post("/chat", { message });

            const data = res.data;
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
            await api.delete("/history");
            setChat([]);
        } catch (err) {
            console.error("Failed to delete history:", err);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? All your chats and account data will be permanently removed. This action cannot be undone.")) {
            try {
                await api.delete("/auth/delete");
                localStorage.removeItem("token");
                navigate("/");
            } catch (err) {
                console.error("Failed to delete account:", err);
                alert("Failed to delete account. Please try again.");
            }
        }
    };

    const renderStructuredText = (msg) => {
        const { text, emoji } = msg;

        if (!text) return null;

        // 1. Handle bold format ** ... **
        const lines = text.split("\n");

        return lines.map((line, idx) => {
            line = line.trim();
            if (!line) return <br key={idx} />;

            // Header style for lines wrapped in **
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

            // Check for keywords and highlight
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
                        style={{ marginBottom: "5px", lineHeight: "1.4", color: "#f0f0f0" }}
                        dangerouslySetInnerHTML={{
                            __html: line.replace(/^- |\* /, ""),
                        }}
                    />
                );
            }

            // Collapsible logic for "Day:"
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

            // Normal text with emoji at end
            line = line + " " + (emoji || "🤖");

            // Replace inline **bold** with <b>
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

    // Re-run collapsible logic when chat updates
    useEffect(() => {
        const collapsibles = document.querySelectorAll(".collapsible");
        collapsibles.forEach((c) => {
            c.onclick = function () {
                this.classList.toggle("active");
                const content = this.nextElementSibling;
                content.style.display =
                    content.style.display === "block" ? "none" : "block";
            };
        });
    }, [chat]);

    return (
        <>
            <div className="chat-container">
                {/* Header */}
                <div className="chat-header">
                    <button
                        className="header-icon-btn"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#historyCanvas"
                        title="Chat History"
                    >
                        <FiMenu />
                    </button>

                    <span>
                        AI Fitness Coach
                    </span>

                    <button className="logout-btn" onClick={logout} title="Logout">
                        <span className="d-none d-sm-inline">Logout</span>
                        <FiLogOut />
                    </button>
                </div>

                {/* Chat Body */}
                <div className="chat-body">
                    {chat.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`chat-msg ${msg.type} ${msg.type === "ai" ? "ai-card" : ""
                                }`}
                        >
                            {msg.type === "user" && <span>{msg.text}</span>}
                            {msg.type === "ai" && <div>{renderStructuredText(msg)}</div>}
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Input Area */}
                <div className="chat-input input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask your fitness or diet question..."
                    />
                    <button className="btn btn-netflix" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>

            {/* OFFCANVAS HISTORY */}
            <div
                className="offcanvas offcanvas-start custom-offcanvas"
                tabIndex="-1"
                id="historyCanvas"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Chat History</h5>
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
                            <div
                                key={index}
                                className="history-item" // Netflix UI card
                            >
                                {msg.text}
                            </div>
                        ))}

                    <button
                        className="btn btn-netflix w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
                        onClick={deleteHistory}
                    >
                        <FiTrash2 /> Clear All History
                    </button>

                    <button
                        className="btn btn-outline-danger w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleDeleteAccount}
                        style={{
                            border: "1px solid #dc3545",
                            color: "#dc3545",
                            background: "transparent",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "#dc3545";
                            e.currentTarget.style.color = "white";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#dc3545";
                        }}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </>
    );
}

export default Home;
