# 💪 AI Fitness Coach

> Your personal AI-powered fitness & diet assistant — Get dynamic workout & diet plans instantly! 🥗🏋️‍♂️  

---

## 🔥 Project Overview

**AI Fitness Coach** is a modern full-stack web application that leverages **Groq AI** and **MongoDB Atlas** to provide personalized, fully readable workout and diet plans. Users can interact via a chat interface, get historical chats, and even delete previous sessions.  

**Tech Stack:**  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Groq AI  
- **Frontend:** React, Bootstrap, CSS  
- **Database:** MongoDB Atlas  

---

## 🗂 Folder Structure

```bash
AI-Fitness-Coach/
│
├── backend/                 # Node.js API & MongoDB Models
│   ├── models/
│   │   └── Chart.js         # Mongoose schema for chat history
│   ├── .env                 # API keys & DB connection
│   └── Server.js            # Express server & API routes
│
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── App.jsx          # Main chat component & UI
│   │   ├── App.css          # Custom CSS styling & themes
│   │   └── index.js         # React entry point
│   └── public/              # Static assets
│
└── README.md                # Project documentation
```

## ✨ Features

- 💬 **Interactive Chat:** Ask for workout, diet, or both — AI responds in beautifully formatted text  
- 🏋️ **Workout Plans:** Muscle gain, weight loss, cardio, stay fit, etc.  
- 🥗 **Diet Plans:** Vegan, Vegetarian, Non-Vegetarian, with detailed calorie & macros  
- 📜 **Chat History:** Fetch previous messages with AI  
- 🗑 **Delete History:** Clear all past chats instantly  
- 🎨 **UI Highlights:** Collapsible sections, emoji highlights, syntax-styled headers & lists  

---

## 🚀 Setup & Installation

### 1️⃣ Backend

```bash
cd backend
npm install
```

### Create .env file:

```bash
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb+srv://admin:password@cluster0.mongodb.net/fitness
```

### Start server:

node Server.js

```bash
Server runs on http://localhost:5000 ✅
```

### 2️⃣ Frontend
```bash
cd frontend
npm install
npm start
```

# Frontend runs on http://localhost:3000 💻

## 💬 Usage

- Type your fitness or diet query in the input field.
- Receive AI-generated responses in structured text format:
  - 💪 **Workout Plan**
  - 🥗 **Diet Plan**
- Expand/collapse days or meals for a clean view.
- Delete chat history with the **Delete All History** button.

## 🛠 Technology Stack

| Layer    | Tools & Libraries                        |
|----------|-----------------------------------------|
| Backend  | Node.js, Express, Groq AI, Mongoose     |
| Frontend | React, Bootstrap, CSS, HTML             |
| Database | MongoDB Atlas                            |
| Styling  | Flexbox, Gradients, Collapsible UI, Emojis |

---

## 📂 API Endpoints

| Method | Endpoint    | Description                        |
|--------|------------|------------------------------------|
| GET    | `/`        | Backend health check                |
| POST   | `/chat`    | Send message to AI & get response   |
| GET    | `/history` | Fetch all chat history              |
| DELETE | `/history` | Delete all chat history             |

---

## 🎨 UI Highlights

- Collapsible days/meals for clean organization  
- Keyword highlighting (e.g., squats, breakfast)  
- Dynamic emojis to make AI chat feel lively  
- Gradient AI bubbles & responsive design  
- Smooth scrolling and shadow effects on messages  

---

## 📝 Notes

- Keep your `.env` file secure and **do not push it to GitHub**  
- MongoDB Atlas cluster must be accessible  
- Groq API key is required for AI responses  

---

## 💡 Future Improvements

- 🔗 Add user authentication & profiles  
- 📊 Display charts for progress tracking  
- 🌐 Deploy frontend & backend on **Vercel / Render**  
- ⚡ Add voice input for chat  

---

## 📸 Preview

<div align="center">
  <img src="frontend/public/chat-screenshot.png" width="80%" alt="Chat Screenshot">
</div>

---

## 🧑‍💻 Author

**Hrushikesh Chothe** – Full-stack Developer & AI Enthusiast
