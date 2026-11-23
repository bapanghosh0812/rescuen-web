"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import AskButton from "@/components/ai/AskButton";
import { LEGAL_SUMMARY } from "@/lib/ai/legal";
import type { Lang, LegalDoc } from "@/lib/ai/types";

export default function PolicySummary({ doc, title }: { doc: LegalDoc; title: string }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <div className="rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
          <Sparkles className="h-5 w-5 text-brand" aria-hidden="true" /> In simple words
        </p>
        <div role="group" aria-label="Language" className="flex rounded-xl border border-line bg-white p-1 text-xs font-bold">
          {(["en", "hg"] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
              className={`rounded-lg px-3 py-2 ${lang === l ? "bg-brand text-white" : "text-ink-faint"}`}
            >
              {l === "en" ? "English" : "Hinglish"}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-ink-soft">
        {LEGAL_SUMMARY[doc][lang].map((s) => (
          <li key={s} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <AskButton question={`Explain the ${title} to me in simple words`} className="btn-primary px-4 py-2.5 text-xs">
          <Sparkles className="h-4 w-4" aria-hidden="true" /> Ask a question
        </AskButton>
        <p className="text-xs text-ink-faint">This summary is for convenience. The full policy below applies.</p>
      </div>
    </div>
  );
}
