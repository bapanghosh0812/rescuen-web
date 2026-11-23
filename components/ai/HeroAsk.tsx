"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import BotAvatar from "@/components/ai/BotAvatar";
import { openAssistant } from "@/components/feedback/bus";

const PROMPTS = [
  "What should I do if someone follows me?",
  "Make me a safety plan for late cabs",
  "How does the 1 KM radar work?",
  "How do I get home safely at night?",
];

/** The ask bar in the hero. */
export default function HeroAsk() {
  const [value, setValue] = useState("");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % PROMPTS.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        openAssistant({ question: value.trim() || PROMPTS[i] });
        setValue("");
      }}
      className="ask-bar mt-7 w-full min-w-0 max-w-xl shadow-card"
    >
      <div className="flex items-center gap-3 py-2 pl-2.5 pr-2">
      <BotAvatar size={42} className="shrink-0" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={300}
        aria-label="Ask RESCUEN AI"
        placeholder={PROMPTS[i]}
        className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
      />
      <button type="submit" aria-label="Ask" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white transition-transform hover:scale-105">
        <ArrowUp className="h-5 w-5" />
      </button>
      </div>
    </form>
  );
}
