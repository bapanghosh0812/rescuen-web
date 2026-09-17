"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send, Loader2, ShieldCheck } from "lucide-react";

type Msg = { role: "user" | "model"; text: string };

const WELCOME: Msg = {
  role: "model",
  text: "Hi, I’m the RESCUEN Safety Companion 🛟\nAsk me about staying safe, first-aid steps, or how the app works. In a real emergency, call **112** first.",
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...msgs, { role: "user" as const, text }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: msgs.filter((m) => m !== WELCOME) }),
      });
      const data = await res.json();
      setMsgs((m) => [
        ...m,
        { role: "model", text: data.reply || data.error || "Sorry, please try again." },
      ]);
    } catch {
      setMsgs((m) => [...m, { role: "model", text: "Network error. In an emergency, call 112." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open RESCUEN AI assistant"
        className="fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-brand-gradient text-white shadow-glow transition-transform hover:scale-105"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="b" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-gold" />
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-24 right-5 z-[60] flex h-[520px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-lift"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-brand-gradient px-4 py-3.5 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold">RESCUEN AI Companion</p>
                <p className="text-[11px] text-white/80">Safety guidance · 24×7</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-paper px-4 py-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-soft ${
                      m.role === "user"
                        ? "rounded-br-md bg-ink text-white"
                        : "rounded-bl-md border border-line bg-white text-ink-soft"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-line bg-white px-3.5 py-2.5 text-ink-faint shadow-soft">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-line bg-white p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about safety…"
                  className="flex-1 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint/70 focus:border-brand focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow disabled:opacity-50"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-ink-faint">
                <ShieldCheck className="h-3 w-3" /> Private · Never share OTPs or passwords
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
