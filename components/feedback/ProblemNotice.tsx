"use client";

import { CircleAlert, Flag } from "lucide-react";
import { openReport } from "@/components/feedback/bus";
import type { Problem } from "@/components/feedback/api";

/** The one way errors are shown on this site: plain words and a Report button. */
export default function ProblemNotice({
  problem,
  area,
  note,
  dark = false,
  className = "",
}: {
  problem: Problem;
  area: string;
  note?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 text-left text-sm sm:flex-row sm:items-center ${
        dark ? "border-white/15 bg-white/[0.07] text-white/85" : "border-sos-200 bg-sos-50 text-ink-soft"
      } ${className}`}
    >
      <span className="flex flex-1 items-start gap-2.5">
        <CircleAlert className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-gold-400" : "text-sos-600"}`} aria-hidden="true" />
        <span>{problem.message}</span>
      </span>
      <button
        type="button"
        onClick={() => openReport({ code: problem.code, area, note })}
        className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
          dark
            ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
            : "border-sos-200 bg-white text-sos-700 hover:bg-sos-100"
        }`}
      >
        <Flag className="h-3.5 w-3.5" aria-hidden="true" /> Report
      </button>
    </div>
  );
}
