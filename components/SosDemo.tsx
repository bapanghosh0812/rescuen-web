"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BellRing, Camera, Check, MapPin, Radar, RotateCcw } from "lucide-react";

const HOLD_MS = 2000;
const STEPS = [
  { icon: Radar, text: "People within 1 km are alerted" },
  { icon: MapPin, text: "Your circle gets your live location" },
  { icon: BellRing, text: "A loud siren starts" },
  { icon: Camera, text: "Evidence starts saving" },
];

/** A hands-on practice of the 2-second hold. Clearly a demo: it never sends anything. */
export default function SosDemo() {
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(0);
  const [hint, setHint] = useState(false);
  const frame = useRef(0);
  const startedAt = useRef(0);
  const fired = shown > 0;
  const done = shown > STEPS.length;

  const release = useCallback(() => {
    if (!startedAt.current) return;
    cancelAnimationFrame(frame.current);
    startedAt.current = 0;
    setProgress(0);
    setHint(true);
  }, []);

  const press = () => {
    if (fired || startedAt.current) return;
    setHint(false);
    startedAt.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - startedAt.current) / HOLD_MS));
      setProgress(p);
      if (p < 1) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      startedAt.current = 0;
      navigator.vibrate?.(60);
      setShown(1);
    };
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!fired || done) return;
    const t = setTimeout(() => setShown((n) => n + 1), 800);
    return () => clearTimeout(t);
  }, [shown, fired, done]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const reset = () => {
    setShown(0);
    setProgress(0);
    setHint(false);
  };

  const r = 92;
  const length = 2 * Math.PI * r;

  return (
    <div className="relative overflow-hidden rounded-4xl bg-ink p-6 text-center text-white shadow-lift sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 glow [--g:theme(colors.brand.DEFAULT/50%)]" />
      <p className="relative mx-auto w-fit rounded-full border border-gold-400/50 bg-gold-400/10 px-3.5 py-1.5 text-xs font-bold text-gold-300">
        Practice only. Nothing is sent.
      </p>

      <div className="relative mx-auto mt-6 grid h-56 w-56 place-items-center">
        {fired && <span className="sos-wave" aria-hidden="true" />}
        <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="7" />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={fired ? "#2ecc71" : "#e6b02f"}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={length}
            strokeDashoffset={length * (1 - (fired ? 1 : progress))}
          />
        </svg>
        <button
          type="button"
          aria-disabled={fired}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            press();
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "Enter") && !e.repeat) {
              e.preventDefault();
              press();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") release();
          }}
          onBlur={release}
          className="sos-button relative z-10 grid h-40 w-40 touch-none select-none place-items-center rounded-full text-white transition-transform duration-200 active:scale-95"
        >
          <span>
            <span className="block font-display text-5xl font-extrabold tracking-wide">SOS</span>
            <span className="mt-1 block text-xs font-bold uppercase tracking-[0.2em] text-white/85">
              {fired ? "Active" : "Hold"}
            </span>
            <span className="sr-only">for 2 seconds to practise. Nothing is sent.</span>
          </span>
        </button>
      </div>

      <div className="relative mt-5 min-h-[13.5rem]" aria-live="polite">
        {fired ? (
          <>
            <ul className="mx-auto max-w-xs space-y-2 text-left">
              {STEPS.slice(0, shown).map((s) => (
                <li key={s.text} className="menu-pop flex items-center gap-3 rounded-2xl bg-white/[0.07] px-4 py-2.5 text-sm font-semibold">
                  <s.icon className="h-[18px] w-[18px] shrink-0 text-gold-300" aria-hidden="true" />
                  <span className="flex-1">{s.text}</span>
                  <Check className="h-4 w-4 shrink-0 text-safe" aria-hidden="true" />
                </li>
              ))}
            </ul>
            {done && (
              <button
                type="button"
                onClick={reset}
                className="menu-pop mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white/75 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Try again
              </button>
            )}
          </>
        ) : (
          <p className="mx-auto max-w-[16rem] pt-3 text-sm leading-relaxed text-white/70">
            {hint
              ? "Almost. Keep holding for the full 2 seconds."
              : "Press and hold the button for 2 seconds to see what RESCUEN does."}
          </p>
        )}
      </div>

      <p className="relative text-xs text-white/60">
        Real emergency? Call{" "}
        <a href="tel:112" className="font-bold text-white underline underline-offset-2">
          112
        </a>
      </p>
    </div>
  );
}
