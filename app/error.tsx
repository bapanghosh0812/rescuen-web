"use client";

import Link from "next/link";
import { Flag, RotateCcw } from "lucide-react";
import BotAvatar from "@/components/ai/BotAvatar";
import { openReport } from "@/components/feedback/bus";
import SiteShell from "@/components/feedback/SiteShell";

export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const code = `E-PAGE${error.digest ? `-${error.digest.replace(/\W/g, "").slice(0, 12).toUpperCase()}` : ""}`;
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 py-16 text-center">
      <div className="max-w-md">
        <BotAvatar size={96} className="mx-auto" />
        <h1 className="h-display mt-6 text-3xl">This page needs a moment</h1>
        <p className="mt-3 text-ink-soft">Please try again. If it keeps happening, let us know and we’ll look into it right away.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <button type="button" onClick={() => openReport({ code, area: "Page" })} className="btn-ghost">
            <Flag className="h-4 w-4 text-sos-600" /> Report
          </button>
          <Link href="/" className="btn-ghost">
            Home
          </Link>
        </div>
        <p className="mt-8 text-sm text-ink-faint">
          In an emergency, call{" "}
          <a href="tel:112" className="font-bold text-sos-600">
            112
          </a>
          .
        </p>
      </div>
      <SiteShell assistant={false} />
    </main>
  );
}
