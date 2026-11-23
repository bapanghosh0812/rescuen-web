import type { CSSProperties, ReactNode } from "react";

/** Gentle reveal on scroll. CSS only: content is visible even without JavaScript. */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`reveal ${className}`} style={{ "--reveal-shift": `${Math.round(delay * 60)}px` } as CSSProperties}>
      {children}
    </div>
  );
}
