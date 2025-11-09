import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5501;

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5501", // Change if frontend runs elsewhere
    credentials: true,
  })
);
app.use(express.static(path.join(process.cwd(), "first code")));

// ===== Multer Setup =====
const upload = multer({ dest: "uploads/" });

// ===== Config =====
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_TEXT_URL = "https://api.openRouter.com/chat/completions";
const JWT_SECRET = process.env.JWT_SECRET || "student_secret_key";
const CHAT_DB = path.join(process.cwd(), "chat_history.json");

if (!DEEPSEEK_API_KEY) {
  console.warn("⚠️ Missing  API key in .env file");
}

// ===== Utility: Load and Save Chat History =====
function loadChats() {
  try {
    if (!fs.existsSync(CHAT_DB)) fs.writeFileSync(CHAT_DB, "{}");
    return JSON.parse(fs.readFileSync(CHAT_DB, "utf8"));
  } catch (err) {
    console.error("Failed to load chat history:", err);
    return {};
  }
}
function saveChats(chats) {
  fs.writeFileSync(CHAT_DB, JSON.stringify(chats, null, 2));
}

// ===== Auth Middleware =====
function verifyUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not logged in" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

// ===== Routes =====

// Serve main app
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "first code", "ai.html"));
});

// Login
app.post("/api/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, secure: false });

  const chats = loadChats();
  if (!chats[username]) chats[username] = [];
  saveChats(chats);

  res.json({ message: `Welcome, ${username}!`, username });
});

// Check login
app.get("/api/user", verifyUser, (req, res) => {
  const { username } = req.user;
  const chats = loadChats();
  const history = chats[username] || [];
  res.json({ username, history });
});

// Logout
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully." });
});

// ===== AI Text Chat =====
app.post("/api/ask", verifyUser, async (req, res) => {
  const { message } = req.body;
  const username = req.user.username;
  if (!message) return res.status(400).json({ error: "Message required" });

  try {
    const chats = loadChats();
    const userHistory = chats[username] || [];

    const response = await fetch(OPENROUTER_TEXT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are Student Companion AI. The logged in student is ${username}.`,
          },
          ...userHistory.map((c) => ({ role: "user", content: c.user })),
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (
        errorText.includes("Insufficient balance") ||
        errorText.includes("quota")
      ) {
        return res.status(402).json({
          reply:
            "💰 Your DeepSeek account has no remaining credits. Please top up your balance to continue chatting.",
        });
      }

      if (
        errorText.includes("401") ||
        errorText.includes("Invalid") ||
        errorText.includes("unauthorized")
      ) {
        return res.status(401).json({
          reply: "🔑 Invalid or expired DeepSeek API key. Please check your .env file.",
        });
      }

      throw new Error(errorText);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "⚠️ No AI response.";

    userHistory.push({ user: message, ai: reply });
    chats[username] = userHistory.slice(-30);
    saveChats(chats);

    res.json({ username, reply });
  } catch (err) {
    console.error("DeepSeek Error:", err);
    res.status(500).json({
      reply: "❌ Could not reach DeepSeek AI. (Check your internet or API credits)",
    });
  }
});

// ===== Image Upload & DeepSeek Vision Analysis =====
app.post("/analyze-image", verifyUser, upload.single("image"), async (req, res) => {
  const imagePath = req.file?.path;
  const username = req.user.username;
  if (!imagePath) return res.status(400).json({ error: "No image uploaded" });

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const response = await fetch(DEEPSEEK_TEXT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are Student Companion AI. The logged in student is ${username}. Describe and analyze the uploaded image.`,
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Analyze this student's uploaded image for details or meaning.`,
              },
              {
                type: "input_image",
                image_base64: base64Image,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (
        errorText.includes("Insufficient balance") ||
        errorText.includes("quota")
      ) {
        return res.status(402).json({
          text:
            "💰 Your DeepSeek account has no remaining credits. Please top up your balance to continue image analysis.",
        });
      }

      if (
        errorText.includes("401") ||
        errorText.includes("Invalid") ||
        errorText.includes("unauthorized")
      ) {
        return res.status(401).json({
          text: "🔑 Invalid or expired DeepSeek API key. Please check your .env file.",
        });
      }

      throw new Error(errorText);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "⚠️ No AI analysis received.";

    const chats = loadChats();
    if (!chats[username]) chats[username] = [];
    chats[username].push({ user: "[image uploaded]", ai: reply });
    saveChats(chats);

    res.json({ text: reply });
  } catch (err) {
    console.error("Image analysis error:", err);
    res.status(500).json({
      text: "❌ Could not reach DeepSeek API. (Check your internet or API credits)",
    });
  } finally {
    setTimeout(() => fs.unlink(imagePath, () => {}), 5000);
  }
});

// ===== Health Check =====
app.get("/api/health", (req, res) => {
  res.json({ status: "✅ Server is running fine." });
});

// ===== Start Server =====
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });