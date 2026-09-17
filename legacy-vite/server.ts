import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables in development
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 4000;

  // Middleware
  app.use(express.json());

  // Initialize Gemini AI
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
  }

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiEnabled: !!ai });
  });

  // Chat integration endpoints
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!ai) {
      return res.json({ 
        reply: "Hello! I am the RESCUEN AI Assistant. (Note: Gemini API Key is currently not configured, so I am running in local backup safety mode). Here are some general guidelines:\n\n1. For active emergencies, immediately locate outdoor safe zones or dial local police (100 in India, 911 in US).\n2. Keep RESCUEN background location settings to 'Always Allow' for the 1KM Radar.\n3. Make sure to list reliable emergency contacts." 
      });
    }

    try {
      const systemInstruction = 
        "You are the RESCUEN safety companion. Your role is to provide quick, calm, and practical guidance in case of personal safety concerns, local emergencies, first aid, battery optimization, or app feature help. Keep your answers clear, visually structured, extremely concise, and helpful for human safety scenarios. Format critical points in bullet points or short bold headings.";

      // map history format to GoogleGenAI expected structure if exists
      const formattedHistory = (history || []).map((msg: { sender: string; text: string }) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate safety advice: " + error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
