"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import BotAvatar from "@/components/ai/BotAvatar";
import { onAsk } from "@/components/feedback/bus";

const load = () => import("@/components/ai/AssistantPanel");
const AssistantPanel = dynamic(load, { ssr: false });

const read = (k: string) => {
  try {
    return sessionStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    sessionStorage.setItem(k, v);
  } catch {
    // private mode: the assistant still works, it just won't remember
  }
};

/** The floating guardian. Can be dragged to either side; opens the chat. */
export default function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [queue, setQueue] = useState<{ text: string; id: number }[]>([]);
  const nextId = useRef(0);
  const [teaser, setTeaser] = useState(false);
  const [side, setSide] = useState<"right" | "left">("right");
  const drag = useRef({ x: 0, active: false, moved: false });
  const button = useRef<HTMLButtonElement>(null);

  const show = useCallback((text?: string) => {
    setMounted(true);
    setOpen(true);
    setTeaser(false);
    if (text) {
      nextId.current += 1;
      const item = { text, id: nextId.current };
      setQueue((q) => [...q.slice(-4), item]);
    }
  }, []);

  useEffect(() => onAsk((d) => show(d.question)), [show]);

  // A natural blink now and then, without keeping the page busy in between.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    let off: ReturnType<typeof setTimeout> | undefined;
    const blink = setInterval(() => {
      if (document.hidden) return;
      root.setAttribute("data-blink", "");
      off = setTimeout(() => root.removeAttribute("data-blink"), 140);
    }, 4300);
    return () => {
      clearInterval(blink);
      clearTimeout(off);
      root.removeAttribute("data-blink");
    };
  }, []);

  useEffect(() => {
    if (read("rescuen-side") === "left") setSide("left");
    if (read("rescuen-teaser")) return;
    const t = setTimeout(() => setTeaser(true), 7000);
    return () => clearTimeout(t);
  }, []);

  const closeTeaser = () => {
    setTeaser(false);
    write("rescuen-teaser", "1");
  };

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => button.current?.focus({ preventScroll: true }));
  }, []);

  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (drag.current.moved) {
      const next = e.clientX < window.innerWidth / 2 ? "left" : "right";
      setSide(next);
      write("rescuen-side", next);
    }
  };

  const edge = side === "right" ? "right-4 sm:right-6" : "left-4 sm:left-6";

  return (
    <>
      {!open && (
        <div className={`fixed bottom-4 z-[60] flex flex-col gap-3 sm:bottom-6 ${edge} ${side === "right" ? "items-end" : "items-start"}`}>
          {teaser && (
            <div className="bot-teaser relative max-w-[250px] rounded-2xl border border-line bg-white/95 py-3 pl-4 pr-10 shadow-lift backdrop-blur-xl">
              <button type="button" onClick={() => show()} className="text-left text-[13px] leading-snug text-ink-soft">
                <b className="text-ink">Namaste!</b> I’m RESCUEN AI. Ask me anything about staying safe.
              </button>
              <button
                type="button"
                onClick={closeTeaser}
                aria-label="Dismiss"
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full text-ink-faint hover:bg-mist hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <button
            ref={button}
            type="button"
            aria-label="Open RESCUEN AI"
            onPointerEnter={() => void load()}
            onPointerDown={(e) => {
              drag.current = { x: e.clientX, active: true, moved: false };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (drag.current.active && Math.abs(e.clientX - drag.current.x) > 24) drag.current.moved = true;
            }}
            onPointerUp={onPointerUp}
            onClick={() => {
              if (drag.current.moved) drag.current.moved = false;
              else show();
            }}
            className="bot-launcher relative grid h-[62px] w-[62px] touch-none place-items-center rounded-full"
          >
            <span className="bot-ring" aria-hidden="true" />
            <BotAvatar size={62} className="relative" />
            <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-[3px] border-white bg-safe" aria-hidden="true" />
          </button>
        </div>
      )}
      {mounted && <AssistantPanel open={open} side={side} queue={queue} onClose={close} />}
    </>
  );
}
