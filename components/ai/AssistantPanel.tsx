"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Check, Copy, Flag, Mic, Phone, RotateCcw, Square, Volume2, X } from "lucide-react";
import BotAvatar from "@/components/ai/BotAvatar";
import RichText, { safeHref } from "@/components/ai/RichText";
import { openReport } from "@/components/feedback/bus";
import { getLang } from "@/components/i18n/store";
import { STARTERS } from "@/lib/ai/knowledge";
import { detectUrgency, URGENT, type Urgency } from "@/lib/ai/safety";
import type { Action, StreamEvent } from "@/lib/ai/types";
import { localeOf } from "@/lib/i18n/languages";

type Msg = {
  id: number;
  role: "user" | "model";
  text: string;
  actions?: Action[];
  urgent?: Urgency;
};

const STORE = "rescuen-chat-v2";
const MAX = 800;

type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void;
  onend: () => void;
  onerror: () => void;
  start: () => void;
  stop: () => void;
};

function speechRecognition(): (new () => Recognition) | null {
  const w = window as unknown as Record<string, new () => Recognition>;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

const plain = (t: string) => t.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

export default function AssistantPanel({
  open,
  side,
  queue,
  onClose,
}: {
  open: boolean;
  side: "left" | "right";
  queue: { text: string; id: number }[];
  onClose: () => void;
}) {
  const path = usePathname() || "/";
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [chips, setChips] = useState<string[]>(STARTERS);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [canListen, setCanListen] = useState(false);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const panel = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const recognition = useRef<Recognition | null>(null);
  const abort = useRef<AbortController | null>(null);
  const msgsRef = useRef<Msg[]>([]);
  const busyRef = useRef(false);
  const asked = useRef(0);
  const run = useRef(0);
  msgsRef.current = msgs;

  useEffect(() => {
    setCanListen(!!speechRecognition());
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) || "[]") as Msg[];
      if (Array.isArray(saved) && saved.length) {
        setMsgs(saved.filter((m) => m && typeof m.text === "string").slice(-30));
        setChips([]);
      }
    } catch {
      // nothing saved
    }
  }, []);

  useEffect(() => {
    if (busy) return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-30)));
    } catch {
      // storage unavailable
    }
  }, [msgs, busy]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [msgs, open, chips]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX);
      if (!text || busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      setInput("");
      setChips([]);
      window.speechSynthesis?.cancel();

      const history = msgsRef.current.slice(-8).map((m) => ({ role: m.role, text: m.text.slice(0, 2400) }));
      const urgent = detectUrgency(text) || undefined;
      const id = Date.now();
      const mine = ++run.current;
      setMsgs((m) => [...m, { id, role: "user", text }, { id: id + 1, role: "model", text: "", urgent }]);
      const update = (patch: Partial<Msg>) =>
        setMsgs((m) => m.map((x) => (x.id === id + 1 ? { ...x, ...patch } : x)));

      let full = "";
      let actions: Action[] = [];
      let next: string[] = [];
      const ctrl = new AbortController();
      abort.current = ctrl;
      const timer = setTimeout(() => ctrl.abort(), 30_000);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history, page: path, lang: getLang() }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) throw new Error("unavailable");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let end: number;
          while ((end = buffer.indexOf("\n")) >= 0) {
            const row = buffer.slice(0, end);
            buffer = buffer.slice(end + 1);
            if (!row.trim()) continue;
            const event = JSON.parse(row) as StreamEvent;
            if (event.t === "d") {
              full += event.v;
              update({ text: full });
            } else if (event.t === "a") actions = event.v;
            else if (event.t === "q") next = event.v;
          }
        }
        if (!full) throw new Error("empty");
      } catch {
        if (!full) {
          const { answerLocally } = await import("@/lib/ai/engine");
          const local = answerLocally(text, getLang() === "hi");
          full = local.text;
          actions = urgent ? URGENT[urgent].actions : local.actions;
          next = local.next;
        }
      }
      clearTimeout(timer);
      if (mine !== run.current) return;
      update({ text: full, actions });
      setChips(next);
      busyRef.current = false;
      setBusy(false);
    },
    [path]
  );

  useEffect(() => {
    if (!open || busy) return;
    const next = queue.find((q) => q.id > asked.current);
    if (!next) return;
    asked.current = next.id;
    void send(next.text);
  }, [open, busy, queue, send]);

  // Focus, Escape and (on phones) keeping Tab inside the panel.
  useEffect(() => {
    if (!open) return;
    const small = window.matchMedia("(max-width: 639px)").matches;
    if (!small) field.current?.focus({ preventScroll: true });
    if (small) document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !small || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>("button:not([disabled]),a[href],textarea");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      recognition.current?.stop();
      window.speechSynthesis?.cancel();
      setSpeaking(null);
    };
  }, [open, onClose]);

  const listen = () => {
    if (recognition.current) return recognition.current.stop();
    const Rec = speechRecognition();
    if (!Rec) return;
    const r = new Rec();
    r.lang = localeOf(getLang());
    r.interimResults = true;
    r.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      const said = Array.from(e.results, (x) => x[0].transcript).join(" ").slice(0, MAX);
      setInput(said);
      if (last.isFinal) {
        r.stop();
        void send(said);
      }
    };
    r.onend = () => {
      recognition.current = null;
      setListening(false);
    };
    r.onerror = r.onend;
    recognition.current = r;
    setListening(true);
    r.start();
  };

  const speak = (m: Msg) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    if (speaking === m.id) return setSpeaking(null);
    const u = new SpeechSynthesisUtterance(plain(m.text));
    u.lang = /[ঀ-৿]/.test(m.text) ? "bn-IN" : /[ऀ-ॿ]/.test(m.text) ? "hi-IN" : "en-IN";
    u.onend = () => setSpeaking(null);
    setSpeaking(m.id);
    synth.speak(u);
  };

  const copy = async (m: Msg) => {
    try {
      await navigator.clipboard.writeText(plain(m.text));
      setCopied(m.id);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      // clipboard blocked
    }
  };

  const reset = () => {
    run.current += 1;
    abort.current?.abort();
    window.speechSynthesis?.cancel();
    busyRef.current = false;
    setBusy(false);
    setMsgs([]);
    setChips(STARTERS);
  };

  const iconBtn =
    "grid h-9 w-9 place-items-center rounded-xl text-white/75 transition-colors hover:bg-white/15 hover:text-white";

  return (
    <section
      ref={panel}
      role="dialog"
      aria-label="RESCUEN AI"
      hidden={!open}
      className={`bot-panel fixed inset-0 z-[70] flex-col overflow-hidden bg-white sm:inset-auto sm:bottom-6 sm:h-[min(680px,calc(100dvh-7rem))] sm:w-[410px] sm:rounded-[1.75rem] sm:border sm:border-line sm:shadow-lift ${
        open ? "flex" : "hidden"
      } ${side === "right" ? "sm:right-6" : "sm:left-6"}`}
    >
      <header className="relative flex items-center gap-3 overflow-hidden bg-brand-gradient px-4 py-3 text-white">
        <span className="pointer-events-none absolute -right-8 -top-14 h-36 w-36 glow [--g:theme(colors.gold.DEFAULT/25%)]" aria-hidden="true" />
        <BotAvatar size={48} mood={busy ? "thinking" : "idle"} className="relative shrink-0" />
        <div className="relative min-w-0 flex-1 leading-tight">
          <p className="font-display text-base font-bold">RESCUEN AI</p>
          <p className="flex items-center gap-1.5 text-[11px] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-safe" aria-hidden="true" />
            {busy ? "Thinking…" : "Your safety companion"}
          </p>
        </div>
        <button type="button" onClick={() => openReport({ area: "RESCUEN AI" })} aria-label="Report a problem" title="Report a problem" className={iconBtn}>
          <Flag className="h-[18px] w-[18px]" />
        </button>
        <button type="button" onClick={reset} aria-label="Start a new chat" title="New chat" className={iconBtn}>
          <RotateCcw className="h-[18px] w-[18px]" />
        </button>
        <button type="button" onClick={onClose} aria-label="Close" title="Close" className={iconBtn}>
          <X className="h-5 w-5" />
        </button>
      </header>

      <div ref={scroller} role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-paper px-4 py-5">
        {!msgs.length && (
          <div className="pb-2 pt-3 text-center">
            <BotAvatar size={84} mood="talking" className="mx-auto" />
            <p className="mt-4 font-display text-xl font-extrabold text-ink">How can I keep you safe?</p>
            <p className="mx-auto mt-1.5 max-w-[270px] text-[13px] leading-relaxed text-ink-faint">
              Ask in English, हिन्दी, বাংলা or Hinglish. In an emergency, call{" "}
              <a href="tel:112" className="font-bold text-sos-600">
                112
              </a>{" "}
              first.
            </p>
          </div>
        )}
        {msgs.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[84%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm leading-relaxed text-white">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex gap-2.5">
              <BotAvatar size={30} mood={m.text ? "idle" : "thinking"} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                {m.urgent && (
                  <div className="rounded-2xl border border-sos-200 bg-sos-50 p-3.5 text-[13px] leading-relaxed text-ink-soft">
                    <p className="font-bold text-sos-700">{URGENT[m.urgent].title}</p>
                    <div className="mt-1">
                      <RichText text={URGENT[m.urgent].body} />
                    </div>
                    <Actions actions={URGENT[m.urgent].actions} onAsk={send} urgent />
                  </div>
                )}
                <div className="break-words rounded-2xl rounded-tl-md border border-line bg-white px-4 py-3 text-sm leading-relaxed text-ink-soft shadow-soft">
                  {m.text ? (
                    <RichText text={m.text} />
                  ) : (
                    <span className="bot-typing" role="status" aria-label="RESCUEN AI is typing">
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                  {!m.urgent && m.actions && m.actions.length > 0 && <Actions actions={m.actions} onAsk={send} />}
                </div>
                {m.text && (
                  <div className="flex gap-1 pl-1 text-ink-faint">
                    <button type="button" onClick={() => copy(m)} aria-label="Copy answer" className="rounded-lg p-1.5 hover:bg-mist hover:text-ink">
                      {copied === m.id ? <Check className="h-3.5 w-3.5 text-safe-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => speak(m)}
                      aria-label={speaking === m.id ? "Stop reading" : "Read aloud"}
                      className="rounded-lg p-1.5 hover:bg-mist hover:text-ink"
                    >
                      {speaking === m.id ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => openReport({ area: "RESCUEN AI answer", note: "This answer was not right: " })}
                      aria-label="Report this answer"
                      className="rounded-lg p-1.5 hover:bg-mist hover:text-ink"
                    >
                      <Flag className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        )}
        {chips.length > 0 && !busy && (
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => (c === "Report a problem" ? openReport({ area: "RESCUEN AI" }) : send(c))}
                className="rounded-full border border-brand-100 bg-white px-3.5 py-2 text-left text-xs font-semibold text-brand transition-colors hover:border-brand hover:bg-brand-50"
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="border-t border-line bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
      >
        <div className="flex items-end gap-1.5 rounded-2xl border border-line bg-paper p-1.5 pl-3.5 transition-colors focus-within:border-brand focus-within:bg-white">
          <textarea
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            maxLength={MAX}
            placeholder={listening ? "Listening…" : "Ask RESCUEN AI anything"}
            aria-label="Message RESCUEN AI"
            className="bot-input max-h-28 flex-1 resize-none bg-transparent py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
          {canListen && (
            <button
              type="button"
              onClick={listen}
              aria-label={listening ? "Stop listening" : "Speak your question"}
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors ${
                listening ? "animate-pulse bg-sos text-white" : "text-ink-faint hover:bg-mist hover:text-ink"
              }`}
            >
              <Mic className="h-[18px] w-[18px]" />
            </button>
          )}
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white transition-opacity disabled:opacity-35"
          >
            <ArrowUp className="h-[18px] w-[18px]" />
          </button>
        </div>
        <p className="mt-2 text-center text-[10.5px] leading-snug text-ink-faint">
          Automated guidance, can be wrong. Please leave out names, addresses, OTPs and passwords.
        </p>
      </form>
    </section>
  );
}

function Actions({ actions, onAsk, urgent = false }: { actions: Action[]; onAsk: (q: string) => void; urgent?: boolean }) {
  const cls = urgent
    ? "inline-flex items-center gap-1.5 rounded-full bg-sos px-3.5 py-2 text-xs font-bold text-white hover:brightness-110"
    : "inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand hover:border-brand";
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((a) => {
        if (a.type === "call")
          return (
            <a key={a.label} href={`tel:${a.number.replace(/\D/g, "")}`} className={cls}>
              <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {a.label}
            </a>
          );
        if (a.type === "link") {
          const ok = safeHref(a.href);
          if (!ok) return null;
          return ok.external ? (
            <a key={a.label} href={ok.href} target="_blank" rel="noopener noreferrer" className={cls}>
              {a.label}
            </a>
          ) : (
            <Link key={a.label} href={ok.href} className={cls}>
              {a.label}
            </Link>
          );
        }
        return (
          <button
            key={a.label}
            type="button"
            onClick={() => (a.type === "ask" ? onAsk(a.question) : openReport({ area: "RESCUEN AI" }))}
            className={cls}
          >
            {a.label}
          </button>
        );
      })}
    </div>
  );
}
