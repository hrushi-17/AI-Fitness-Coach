# 💪 AI Fitness Coach

> Your personal AI-powered fitness & diet assistant — Get dynamic workout & diet plans instantly! 🥗🏋️‍♂️  

---

🌐 **Live Demo:** https://ai-fitness-coach.vercel.app/  
🖥 **Backend API (Render):** https://ai-fitness-coach-35n1.onrender.com  

---

## 🔥 Project Overview

**AI Fitness Coach** is a modern full-stack web application that leverages **Groq AI** and **MongoDB Atlas** to provide personalized, fully readable workout and diet plans. Users can interact via a chat interface, get historical chats, securely manage their accounts with JWT authentication, and reset their passwords via OTP.

### **Tech Stack**
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Groq AI, JWT, NodeMailer
- **Frontend:** React, Bootstrap, React Router, Axios, CSS  
- **Database:** MongoDB Atlas  
- **Deployment:** Render (Backend), Vercel (Frontend)

---

## ✨ Features

- 🔐 **Secure Authentication:** JWT-based user login & registration.
- 💬 **Interactive Chat:** Ask for workout, diet, or both — AI responds in beautifully formatted text.
- 🏋️ **Workout Plans:** Muscle gain, weight loss, cardio, stay fit.
- 🥗 **Diet Plans:** Vegan, Vegetarian, Non-Vegetarian with calories & macros.
- 📜 **Chat History:** Fetch previous messages from MongoDB tied to your user account.
- 🗑  **Delete History:** Clear all past chats instantly.
- 📧 **Password Recovery:** Secure OTP-based password reset via email.
- 🎨 **Modern UI:** Collapsible sections, emoji highlights, gradient AI cards based on Netflix UI.
- 📱 **Responsive Design:** Mobile, tablet & desktop friendly.

---

## 🗂 Folder Structure

```bash
AI-Fitness-Coach/
│
├── backend/                 # Node.js API & MongoDB Models
│   ├── controllers/         # Logic for auth and chat routes
│   ├── middleware/          # JWT protection middleware
│   ├── models/              # Mongoose schemas (Chat, User, Admin)
│   ├── routes/              # Express API endpoints
│   ├── utils/               # Helpers like sendEmail for OTP
│   ├── .env                 # API keys & DB connection
│   └── server.js            # Express server entry point
│
├── frontend/                # React Frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Pages (Home, Login, Register, Forgot/Reset Password, etc.)
│   │   ├── services/        # Axios API configurations
│   │   ├── App.jsx          # Router & Main App component
│   │   ├── App.css          # Custom CSS styling (Netflix themes)
│   │   └── main.jsx         # React application entry point
│   └── public/              # Static assets
│
└── README.md                # Project documentation
```

---

## 🚀 Setup & Installation

### 1️⃣ Backend

```bash
cd backend
npm install
```

**Create `.env` file in the `backend/` directory:**
```bash
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb+srv://admin:password@cluster0.mongodb.net/fitness
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@fitnesscoach.ai
```

**Start server:**
```bash
npm start
```
*Server runs on http://localhost:5000 ✅*

### 2️⃣ Frontend
```bash
cd frontend
npm install
```

**Create `.env` file in the `frontend/` directory:**
```bash
VITE_API_URL=http://localhost:5000/api
```

**Start frontend:**
```bash
npm run dev
```
*Frontend runs on http://localhost:5173 💻*

---

## 🌐 Deployment

### 🖥 **Backend → Render**
- Hosted on **Render**  
- Ensure **all Environment Variables** from your `.env` are added to your Render Web Service settings.

### 🌐 **Frontend → Vercel**
- Hosted on **Vercel**  
- Add `VITE_API_URL=https://ai-fitness-coach-35n1.onrender.com/api` matching the deployed backend to Vercel Environment Variables.

---

## 📂 API Endpoints

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | `/`                             | Backend health check               |
| POST   | `/api/auth/register`            | Register a new user account        |
| POST   | `/api/auth/login`               | Login and get JWT token            |
| POST   | `/api/auth/forgotpassword`      | Send OTP to user's email           |
| POST   | `/api/auth/verifyotp`           | Verify OTP code                    |
| PUT    | `/api/auth/resetpassword`       | Reset user password                |
| POST   | `/api/chat`                     | Send message to AI & get response  |
| GET    | `/api/history`                  | Fetch all chat history             |
| DELETE | `/api/history`                  | Delete all chat history            |

*(Make sure to use Authorization: Bearer <token> headers for chat & history requests).*

---

## 🎨 UI Highlights

- Collapsible days/meals for clean organization  
- Keyword highlighting (e.g., squats, breakfast)  
- Dynamic emojis to make AI chat feel lively  
- Gradient AI bubbles & responsive design  
- Smooth scrolling and shadow effects on messages  

---

## 📝 Notes

- Keep your `.env` file secure and **do not push it to GitHub.**
- Add `.env` to `.gitignore`.
- MongoDB Atlas cluster IP settings must be accessible (0.0.0.0/0).
- Groq API key is required for AI responses.

---

## 💡 Future Improvements

- 👤 User profiles & saved plans  
- 📊 Fitness progress charts  
- 🎙 Voice-to-text input  
- 📅 Weekly structured planner  
- 🌎 Multi-language support 

---

## 🧑‍💻 Author

**Hrushikesh Chothe** – Full-stack Developer & AI Enthusiast
