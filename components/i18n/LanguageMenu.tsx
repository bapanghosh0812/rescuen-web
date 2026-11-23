"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { setLang, useLang } from "@/components/i18n/store";
import { LANGS } from "@/lib/i18n/languages";

/** Language picker. Names stay in their own script so everyone can find theirs. */
export default function LanguageMenu({ className = "", inline = false }: { className?: string; inline?: boolean }) {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (inline) {
    return (
      <div role="group" aria-label="Choose language" className={`grid grid-cols-3 gap-2 ${className}`}>
        {LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            lang={l.locale}
            data-no-translate
            aria-pressed={lang === l.id}
            onClick={() => setLang(l.id)}
            className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition-colors ${
              lang === l.id ? "border-brand bg-brand text-white" : "border-line bg-white text-ink-soft hover:border-brand/40"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={box}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Choose language"
        aria-haspopup="true"
        aria-expanded={open}
        className={className}
      >
        <Globe className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
      {open && (
        <div data-no-translate className="menu-pop absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl border border-line bg-white p-1.5 shadow-lift">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              lang={l.locale}
              aria-pressed={lang === l.id}
              onClick={() => {
                setLang(l.id);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-mist ${
                lang === l.id ? "text-brand" : "text-ink-soft"
              }`}
            >
              {l.label}
              {lang === l.id && <Check className="h-4 w-4" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
