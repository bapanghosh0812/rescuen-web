"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Compass, CornerDownLeft, MessageCircleQuestion, Phone, Search, Wand2, type LucideIcon } from "lucide-react";
import BotAvatar from "@/components/ai/BotAvatar";
import { openAssistant, openReport } from "@/components/feedback/bus";
import { search as searchKnowledge } from "@/lib/ai/engine";
import { GUIDES } from "@/lib/guides";

type Item = { id: string; label: string; hint: string; icon: LucideIcon; run: () => void; words: string };

const HELPLINES = [
  ["112", "All emergencies"],
  ["181", "Women helpline"],
  ["108", "Ambulance"],
  ["1098", "Child helpline"],
  ["1930", "Cyber fraud"],
  ["14416", "Mental health"],
];

const PAGES: [string, string, string][] = [
  ["Home", "/", "home start"],
  ["AI tools", "/ai", "ai tools planner check message"],
  ["Safety Planner", "/ai#planner", "plan planner night cab travel"],
  ["Safety Check", "/ai#check", "quiz score prepared"],
  ["Message Writer", "/ai#message", "message whatsapp location family"],
  ["Safety Guides", "/guides", "guides articles tips"],
  ["Emergency numbers", "/emergency-numbers", "helpline numbers police ambulance"],
  ["Features", "/#features", "features sos radar"],
  ["Trust & Security Centre", "/security", "security encryption"],
  ["Support the mission", "/donate", "donate daan support"],
  ["Contact", "/#contact", "contact email support help"],
  ["About RESCUEN", "/about", "about team story"],
  ["Privacy Policy", "/legal/privacy", "privacy data"],
  ["Terms & Conditions", "/legal/terms", "terms legal"],
];

/** Ctrl+K: find any page, number or answer, or ask RESCUEN AI. */
export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
    return () => el?.close();
  }, []);

  const items = useMemo<Item[]>(() => {
    const done = (fn: () => void) => () => {
      dialog.current?.close();
      fn();
    };
    const text = q.trim();
    const all: Item[] = [
      ...PAGES.map(([label, href, words]) => ({
        id: `p${href}`,
        label,
        hint: "Page",
        icon: Compass,
        words: `${label} ${words}`.toLowerCase(),
        run: done(() => router.push(href)),
      })),
      ...GUIDES.map((g) => ({
        id: `g${g.slug}`,
        label: g.title,
        hint: "Guide",
        icon: BookOpen,
        words: `${g.title} ${g.summary}`.toLowerCase(),
        run: done(() => router.push(`/guides/${g.slug}`)),
      })),
      ...HELPLINES.map(([n, label]) => ({
        id: `h${n}`,
        label: `Call ${n}`,
        hint: label,
        icon: Phone,
        words: `${n} ${label} call helpline emergency`.toLowerCase(),
        run: done(() => (window.location.href = `tel:${n}`)),
      })),
      {
        id: "report",
        label: "Report a problem",
        hint: "Support",
        icon: MessageCircleQuestion,
        words: "report problem bug issue broken",
        run: done(() => openReport({ area: "Search" })),
      },
    ];
    if (!text) return all.slice(0, 7);
    const words = text.toLowerCase().split(/\s+/);
    const hits = all.filter((i) => words.every((w) => i.words.includes(w))).slice(0, 5);
    const answers = searchKnowledge(text)
      .slice(0, 4)
      .map(({ entry }) => ({
        id: `k${entry.id}`,
        label: entry.q,
        hint: "Answer",
        icon: Wand2,
        words: "",
        run: done(() => openAssistant({ question: entry.q })),
      }));
    return [
      {
        id: "ask",
        label: `Ask RESCUEN AI: “${text}”`,
        hint: "AI",
        icon: Wand2,
        words: "",
        run: done(() => openAssistant({ question: text })),
      },
      ...hits,
      ...answers,
    ];
  }, [q, router]);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      aria-label="Search RESCUEN"
      className="dialog mt-[12vh] w-[min(94vw,600px)] rounded-3xl border border-line bg-white p-0 text-ink shadow-lift"
    >
      <div className="flex items-center gap-3 border-b border-line px-5">
        <Search className="h-5 w-5 shrink-0 text-ink-faint" aria-hidden="true" />
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setCursor(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              const step = e.key === "ArrowDown" ? 1 : -1;
              setCursor((c) => (c + step + items.length) % items.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              items[cursor]?.run();
            }
          }}
          maxLength={300}
          placeholder="Search pages, numbers, or ask anything"
          aria-label="Search"
          className="w-full bg-transparent py-5 text-base placeholder:text-ink-faint focus:outline-none"
        />
        <BotAvatar size={34} className="shrink-0" />
      </div>
      <ul className="max-h-[52vh] overflow-y-auto p-2">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={item.run}
              onMouseEnter={() => setCursor(i)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left ${i === cursor ? "bg-mist" : ""}`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
                <item.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{item.label}</span>
              <span className="shrink-0 text-xs text-ink-faint">{item.hint}</span>
              {i === cursor && <CornerDownLeft className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
