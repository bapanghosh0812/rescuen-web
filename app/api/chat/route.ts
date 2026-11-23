import { z } from "zod";
import { answerLocally, suggestFor } from "@/lib/ai/engine";
import { streamReply } from "@/lib/ai/model";
import { CANARY, scrub, systemPrompt } from "@/lib/ai/prompt";
import { detectUrgency, URGENT } from "@/lib/ai/safety";
import type { StreamEvent } from "@/lib/ai/types";
import { guard } from "@/lib/http";
import { LANG_IDS, LANGS } from "@/lib/i18n/languages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const schema = z.object({
  message: z.string().trim().min(1, "Please type a question.").max(800, "Please shorten your question."),
  history: z
    .array(z.object({ role: z.enum(["user", "model"]), text: z.string().max(2500) }))
    .max(12)
    .optional(),
  page: z.string().max(120).optional(),
  lang: z.enum(LANG_IDS).optional(),
});

export async function POST(req: Request) {
  const { data, res } = await guard(req, {
    name: "chat",
    schema,
    limit: { limit: 30, windowMs: 5 * 60_000 },
    globalLimit: { limit: 1200, windowMs: 60 * 60_000 },
    maxBytes: 40_000,
  });
  if (res) return res;

  const question = data.message;
  const page = (data.page || "/").replace(/[^\w\-/#]/g, "").slice(0, 80) || "/";
  const urgency = detectUrgency(question);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (e: StreamEvent) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
      const local = () => {
        const a = answerLocally(question, data.lang === "hi");
        send({ t: "d", v: a.text });
        send({ t: "a", v: urgency ? URGENT[urgency].actions : a.actions });
        send({ t: "q", v: a.next });
        send({ t: "done", live: false });
      };

      let emitted = false;
      try {
        const history = (data.history || []).slice(-8);
        while (history.length && history[0].role !== "user") history.shift();

        let pending = "";
        let full = "";
        for await (const piece of streamReply({
          system: systemPrompt(page, LANGS.find((l) => l.id === data.lang)?.label),
          messages: [...history, { role: "user", text: question }],
        })) {
          full += piece;
          if (full.includes(CANARY)) throw new Error("leak");
          if (full.length > 8_000) break;
          pending += piece;
          // Hold back the tail so a marker split across pieces is still caught.
          const cut = Math.max(pending.lastIndexOf(" "), pending.lastIndexOf("\n"));
          if (cut > 40) {
            send({ t: "d", v: scrub(pending.slice(0, cut + 1)) });
            pending = pending.slice(cut + 1);
            emitted = true;
          }
        }
        if (pending) {
          send({ t: "d", v: scrub(pending) });
          emitted = true;
        }
        const extra = suggestFor(question);
        send({ t: "a", v: urgency ? URGENT[urgency].actions : extra.actions });
        send({ t: "q", v: extra.next });
        send({ t: "done", live: true });
      } catch (err) {
        if ((err as Error).message === "leak") {
          send({ t: "d", v: "\n\nMy instructions are private, but I’m glad to help with your safety." });
          send({ t: "done", live: true });
        } else if (emitted) {
          send({ t: "done", live: true });
        } else {
          local();
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Accel-Buffering": "no",
    },
  });
}
