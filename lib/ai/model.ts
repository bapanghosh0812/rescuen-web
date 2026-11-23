import "server-only";
import type { ChatMessage } from "@/lib/ai/types";

// Talks to the AI service over HTTPS. Keys stay on the server and are sent in a
// header. Several keys and models can be listed; a failing one is rested and
// the next is tried.

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const clean = (v: string | undefined) => (v || "").trim().replace(/^["']|["']$/g, "");

function keys(): string[] {
  const list = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3];
  return [...new Set(list.map(clean).filter((k) => k.length > 20))];
}

function models(): string[] {
  const preferred = clean(process.env.GEMINI_MODEL);
  return [
    ...new Set(
      [preferred, "gemini-flash-latest", "gemini-3.5-flash", "gemini-flash-lite-latest", "gemini-2.5-flash"].filter(
        Boolean
      )
    ),
  ];
}

const resting = new Map<string, number>();
const isResting = (id: string) => (resting.get(id) || 0) > Date.now();
const rest = (id: string, ms: number) => resting.set(id, Date.now() + ms);

function* attempts() {
  for (const [i, key] of keys().entries()) {
    for (const model of models()) {
      if (isResting(`k${i}`)) break;
      if (!isResting(`k${i}:${model}`)) yield { key, model, id: `k${i}` };
    }
  }
}

/** Out of credit or refused rests the whole key; busy or missing rests one model. */
function noteFailure(id: string, model: string, status: number) {
  console.warn(`[ai] ${id} ${model} -> ${status}`);
  if ([401, 402, 403].includes(status)) rest(id, 10 * 60_000);
  else if (status === 404) rest(`${id}:${model}`, 60 * 60_000);
  else if (status === 429) rest(`${id}:${model}`, 60_000);
  else rest(`${id}:${model}`, 15_000);
}

type Request = {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  /** Set to receive JSON matching this schema. */
  schema?: Record<string, unknown>;
};

// Safety topics (harassment, assault, self-harm) are exactly what people ask
// about here, so only the most severe content is refused by the service.
const SAFETY = ["HARASSMENT", "HATE_SPEECH", "SEXUALLY_EXPLICIT", "DANGEROUS_CONTENT"].map((c) => ({
  category: `HARM_CATEGORY_${c}`,
  threshold: "BLOCK_ONLY_HIGH",
}));

function body({ system, messages, maxTokens = 2048, temperature = 0.5, schema }: Request, thinking: unknown) {
  return JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    safetySettings: SAFETY,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      ...(thinking ? { thinkingConfig: thinking } : {}),
      ...(schema ? { responseMimeType: "application/json", responseSchema: schema } : {}),
    },
  });
}

/** Keeps replies quick. Models differ, so it is dropped if one rejects it. */
const quick = (model: string) => (/2\.5/.test(model) ? { thinkingBudget: 0 } : { thinkingLevel: "low" });

type Part = { text?: string; thought?: boolean };
type Chunk = { candidates?: { content?: { parts?: Part[] } }[] };
const textOf = (c: Chunk) =>
  (c.candidates?.[0]?.content?.parts || [])
    .filter((p) => !p.thought)
    .map((p) => p.text || "")
    .join("");

const FIRST_TOKEN_MS = 7_000;
const TOTAL_MS = 22_000;

/** Streams a reply. Throws if no configured key or model can answer. */
export async function* streamReply(request: Request): AsyncGenerator<string> {
  const started = Date.now();

  for (const { key, model, id } of attempts()) {
    if (Date.now() - started > 12_000) break;
    const ctrl = new AbortController();
    const hardStop = setTimeout(() => ctrl.abort(), TOTAL_MS - (Date.now() - started));
    const firstToken = setTimeout(() => ctrl.abort(), FIRST_TOKEN_MS);
    let emitted = false;
    try {
      const call = (thinking: unknown) =>
        fetch(`${BASE}/${model}:streamGenerateContent?alt=sse`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: body(request, thinking),
          signal: ctrl.signal,
          cache: "no-store",
        });
      let res = await call(quick(model));
      if (res.status === 400) res = await call(null);
      if (!res.ok || !res.body) {
        noteFailure(id, model, res.status);
        continue;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let end: number;
        while ((end = buffer.indexOf("\n")) >= 0) {
          const row = buffer.slice(0, end).trim();
          buffer = buffer.slice(end + 1);
          if (!row.startsWith("data:")) continue;
          let text = "";
          try {
            text = textOf(JSON.parse(row.slice(5)) as Chunk);
          } catch {
            continue;
          }
          if (text) {
            if (!emitted) clearTimeout(firstToken);
            emitted = true;
            yield text;
          }
        }
      }
      if (emitted) return;
      // Answered but with no words (refused). Trying other models would only be slower.
      break;
    } catch {
      if (emitted) return;
      noteFailure(id, model, 504);
    } finally {
      clearTimeout(firstToken);
      clearTimeout(hardStop);
      ctrl.abort();
    }
  }
  throw new Error("ai unavailable");
}

/** One complete reply, or null when the AI cannot answer right now. */
export async function completeReply(request: Request): Promise<string | null> {
  let out = "";
  try {
    for await (const piece of streamReply(request)) {
      out += piece;
      if (out.length > 12_000) break;
    }
  } catch {
    return null;
  }
  return out.trim() || null;
}
