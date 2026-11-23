"use client";

import { useRef, type ReactNode } from "react";

/** Subtle 3D tilt that follows the pointer. Writes styles directly, so nothing re-renders. */
export default function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${y * -6}deg) rotateY(${x * 8}deg)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={reset} className={`transition-transform duration-200 ease-out ${className}`}>
      {children}
    </div>
  );
}
