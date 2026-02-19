require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");
const Chat = require("./models/Chat");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Atlas - proper connection options
// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGO_URI) // no extra options needed
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err.message));

mongoose.connection.once("open", () =>
  console.log("MongoDB connection is ready ✅")
);

mongoose.connection.on("error", (err) =>
  console.error("MongoDB connection error:", err)
);

// Optional: monitor connection state
mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));
mongoose.connection.once("open", () => console.log("MongoDB connection is ready ✅"));

// Groq AI setup
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Root route
app.get("/", (req, res) => {
  res.send("AI Fitness Coach Backend Running ✅");
});

// Chat route
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Check DB connection before inserting
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: "Database not connected yet" });
    }

    const systemPrompt = `
You are a professional fitness coach and AI assistant. 
Rules for AI responses:

1. If user asks for **Workout only**, provide a fully readable formatted workout plan:
- Include day, focus, exercises, sets, reps, weight if applicable.
- Use bullet points, bold headers, emojis (💪 for workout).
- Do NOT return JSON.

2. If user asks for **Diet only**, provide a fully readable formatted diet plan:
- Include meal name, items, calories, protein, carbs, fat.
- Use bullet points, bold headers, emojis (🥗 for diet).
- Do NOT return JSON.

3. If user asks for **both Workout + Diet**, provide both plans in a readable format:
- Use separate sections with headers, emojis, and bullet points.
- Keep consistent formatting for ChatGPT UI style.

4. Handle all types: Muscle Gain, Weight Loss, Stay Fit, Cardio; and diet: Vegan, Vegetarian, Non-Vegetarian.
- Determine user's request by matching keywords in the message.
- Generate dynamic plan accordingly, do not hardcode exact exercises or meals.

5. NEVER mix JSON and text. Always return human-readable, ChatGPT-style formatted text.

Example formatting:

💪 **Workout Plan — Muscle Gain**
**Monday — Chest**
- Barbell Bench Press: 3 sets × 8-12 reps, optional weight
- Incline Dumbbell Press: 3 sets × 8-12 reps

🥗 **Diet Plan — Vegan**
**Breakfast**
- Oatmeal with almond milk
- Fresh berries
- Calories: 450, Protein: 25g, Carbs: 70g, Fat: 15g
`;

    // Groq AI completion
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content.trim();

    // Save chat in DB
    await Chat.create({ message, reply });

    res.json({ reply });
  } catch (error) {
    console.error("FULL GROQ ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Chat history
app.get("/history", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Delete all history
app.delete("/history", async (req, res) => {
  try {
    await Chat.deleteMany({});
    res.json({ message: "All chat history deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete history" });
  }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000 🚀"));
