import "server-only";
import { GoogleGenAI } from "@google/genai";

// ─────────────────────────────────────────────────────────────
// Gemini AI (server only) — powers the RESCUEN safety assistant.
// Set GEMINI_API_KEY in .env.local. The key never reaches the browser;
// the client talks only to our /api/chat route.
// ─────────────────────────────────────────────────────────────

export const isGeminiConfigured = !!process.env.GEMINI_API_KEY;

const SYSTEM_INSTRUCTION = `You are the RESCUEN Safety Companion — a calm, concise assistant for personal-safety questions, first-aid steps, local emergency guidance and help using the RESCUEN app.
Rules:
- Be brief, clear and practical. Use short bullet points and bold mini-headings.
- For any active, life-threatening emergency, tell the person to call local emergency services immediately (India: 112 / police 100 / ambulance 108) BEFORE anything else.
- Never give medical, legal or financial advice beyond general safety first-aid guidance; recommend professionals when appropriate.
- Never ask for or store passwords, OTPs, card or bank details.
- Stay supportive and non-judgemental. Keep answers focused on safety.`;

type Msg = { role: "user" | "model"; text: string };

const OFFLINE_REPLY =
  "I’m the RESCUEN Safety Companion. (The AI service isn’t configured yet, so here’s general guidance.)\n\n" +
  "• **Active emergency?** Call **112** (India) / **100** police / **108** ambulance right away.\n" +
  "• Move to a well-lit, public place and share your live location with a trusted contact.\n" +
  "• Keep RESCUEN running in the background so SOS and the radar stay ready.\n\n" +
  "Add a GEMINI_API_KEY to enable full AI answers.";

export async function generateSafetyReply(
  message: string,
  history: Msg[] = []
): Promise<{ reply: string; ai: boolean }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { reply: OFFLINE_REPLY, ai: false };

  const ai = new GoogleGenAI({ apiKey: key });
  const contents = [
    ...history.slice(-8).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    { role: "user" as const, parts: [{ text: message }] },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents,
    config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.6, maxOutputTokens: 700 },
  });

  return { reply: response.text ?? "Sorry, I couldn’t generate a response. Please try again.", ai: true };
}
