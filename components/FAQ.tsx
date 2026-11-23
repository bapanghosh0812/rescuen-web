"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { openAssistant } from "@/components/feedback/bus";
import { FAQS } from "@/lib/site";

/** Searchable FAQ. Anything it can't find goes to RESCUEN AI. */
export default function FAQ() {
  const [q, setQ] = useState("");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = FAQS.filter((f) => words.every((w) => `${f.q} ${f.a}`.toLowerCase().includes(w)));

  return (
    <section id="faq" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <div className="container-x max-w-3xl">
        <h2 className="h-display text-center text-3xl sm:text-4xl lg:text-5xl">Questions, answered</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) openAssistant({ question: q.trim() });
          }}
          className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-white py-1.5 pl-4 pr-1.5 shadow-soft focus-within:border-brand"
        >
          <Search className="h-5 w-5 shrink-0 text-ink-faint" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={300}
            aria-label="Search questions"
            placeholder="Search, or ask in your own words"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] placeholder:text-ink-faint focus:outline-none"
          />
          <button type="submit" className="btn-primary px-4 py-2.5 text-xs">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Ask
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              hidden={!matches.includes(f)}
              className="faq-item rounded-2xl border border-line bg-white shadow-soft"
            >
              <summary className="cursor-pointer px-5 py-4 text-base font-semibold text-ink">{f.q}</summary>
              <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
          {!matches.length && (
            <div className="rounded-2xl border border-dashed border-brand-200 bg-white px-5 py-8 text-center">
              <p className="font-semibold text-ink">Nothing here matches that yet.</p>
              <button type="button" onClick={() => openAssistant({ question: q.trim() })} className="btn-primary mt-4">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> Ask RESCUEN AI
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
