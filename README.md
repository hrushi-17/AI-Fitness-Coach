# 💪 AI Fitness Coach

> Your personal AI-powered fitness & diet assistant — Get dynamic workout & diet plans instantly! 🥗🏋️‍♂️  

---

🌐 **Live Demo:** https://ai-fitness-coach-rust.vercel.app/  
🖥 **Backend API (Render):** https://ai-fitness-coach-35n1.onrender.com  

---

## 🔥 - **Project Overview**

**AI Fitness Coach** is a modern full-stack web application that leverages **Groq AI** and **MongoDB Atlas** to provide personalized, fully readable workout and diet plans. Users can interact via a chat interface, get historical chats, and delete previous sessions.

### **Tech Stack**
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Groq AI  
- **Frontend:** React, Bootstrap, CSS  
- **Database:** MongoDB Atlas  
- **Deployment:** Render (Backend), Vercel (Frontend)

---

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

## ## ✨ - **Features**

- 💬 **Interactive Chat:** Ask for workout, diet, or both — AI responds in beautifully formatted text  
- 🏋️ **Workout Plans:** Muscle gain, weight loss, cardio, stay fit  
- 🥗 **Diet Plans:** Vegan, Vegetarian, Non-Vegetarian with calories & macros  
- 📜 **Chat History:** Fetch previous messages from MongoDB  
- 🗑  **Delete History:** Clear all past chats instantly  
- 🎨 **Modern UI:** Collapsible sections, emoji highlights, gradient AI cards  
- 📱 **Responsive Design:** Mobile, tablet & desktop friendly  


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

### Server runs on http://localhost:5000 ✅

### 2️⃣ Frontend
```bash
cd frontend
npm install
npm start
```

### Frontend runs on http://localhost:3000 💻

## 🌐 - **Deployment**

### 🖥 **Backend → Render**

- Hosted on Render  
- Environment Variables configured:
  - `GROQ_API_KEY`
  - `MONGO_URI`

---

### 🌐 **Frontend → Vercel**

- Hosted on Vercel  
- Connected to production backend:

https://ai-fitness-coach-35n1.onrender.com


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

- 🔐 Add JWT Authentication  
- 👤 User profiles & saved plans  
- 📊 Fitness progress charts  
- 🎙 Voice-to-text input  
- 📅 Weekly structured planner  
- 🌎 Multi-language support 

---

## 📸 Preview


---

## 🧑‍💻 Author

**Hrushikesh Chothe** – Full-stack Developer & AI Enthusiast
