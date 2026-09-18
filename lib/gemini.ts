import "server-only";
import { GoogleGenAI } from "@google/genai";

// ─────────────────────────────────────────────────────────────
// Gemini AI (server only) — powers the RESCUEN safety assistant.
// Set GEMINI_API_KEY in .env.local. The key never reaches the browser;
// the client talks only to our /api/chat route.
// ─────────────────────────────────────────────────────────────

export const isGeminiConfigured = !!process.env.GEMINI_API_KEY;

const SYSTEM_INSTRUCTION = `You are the RESCUEN Safety Companion — a world-class, grandmaster-level personal-safety expert and calm crisis guide. You combine the knowledge of an emergency responder, a certified first-aid instructor, a women-safety & self-defense coach, and a mental-wellness counsellor.

MISSION: keep the person safe, calm and in control with precise, trustworthy, actionable guidance.

STYLE:
- Warm, reassuring and confident — never alarmist.
- Concise and skimmable: short bold mini-headings and tight bullet points. Lead with the single most important action.
- Mirror the user's language when they write in Hindi, Bengali, Marathi, Tamil, Telugu or Hinglish.

SAFETY RULES (non-negotiable):
- If there is any active, life-threatening danger, the FIRST line must tell them to call emergency services now — India: 112 (all-in-one), 100 (police), 108 (ambulance), 101 (fire), 1091 (women), 1098 (child).
- Give practical first-aid and personal-safety steps within general, well-established guidance; for anything medical/legal/serious, clearly recommend a professional.
- Encourage using RESCUEN's tools when relevant (hold SOS 2s, Follow-Me for journeys, share live location with trusted contacts, Fake Call to exit an unsafe moment).
- Never request, guess or store OTPs, passwords, card, bank or government-ID details, and warn users never to share them.
- Be inclusive and non-judgemental. If someone seems distressed, acknowledge feelings first, then guide.

Keep answers focused on safety, wellness and using RESCUEN well.`;

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

  // Model is configurable via GEMINI_MODEL (e.g. gemini-2.5-flash). Set your
  // preferred model in .env.local if you have access to a newer flash model.
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const response = await ai.models.generateContent({
    model,
    contents,
    config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.6, maxOutputTokens: 900 },
  });

  return { reply: response.text ?? "Sorry, I couldn’t generate a response. Please try again.", ai: true };
}
