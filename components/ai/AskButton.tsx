"use client";

import type { ReactNode } from "react";
import { openAssistant } from "@/components/feedback/bus";

/** Opens RESCUEN AI, optionally with a question already asked. */
export default function AskButton({
  question,
  children,
  className = "",
  label,
}: {
  question?: string;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <button type="button" aria-label={label} onClick={() => openAssistant({ question })} className={className}>
      {children}
    </button>
  );
}
