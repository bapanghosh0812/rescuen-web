"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Flag, Loader2, Mail, X } from "lucide-react";
import { post, type Problem } from "@/components/feedback/api";
import type { ReportDetail } from "@/components/feedback/bus";
import { SITE } from "@/lib/site";

export default function ReportDialog({ detail, onClose }: { detail: ReportDetail; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState(detail.note || "");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [reference, setReference] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
    return () => el?.close();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setProblem(null);
    const result = await post<{ ref: string }>("/api/report", {
      code: detail.code || "",
      area: detail.area || "",
      page: location.pathname,
      device: `${navigator.userAgent.slice(0, 160)} ${innerWidth}x${innerHeight}`,
      message: message.trim(),
      email: email.trim(),
      company,
    });
    setBusy(false);
    if (result.ok) setReference(result.data.ref);
    else setProblem(result.problem);
  };

  const mailto = `mailto:${SITE.supportEmail}?subject=${encodeURIComponent(
    `Website report${detail.code ? ` (${detail.code})` : ""}`
  )}&body=${encodeURIComponent(message)}`;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      aria-labelledby="report-title"
      className="dialog w-[min(94vw,460px)] rounded-3xl border border-line bg-white p-0 text-ink shadow-lift"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand">
              <Flag className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="report-title" className="font-display text-lg font-extrabold">
                Report a problem
              </h2>
              <p className="text-xs text-ink-faint">It goes straight to Team RESCUEN.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-xl text-ink-faint hover:bg-mist hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {reference ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-safe-600" aria-hidden="true" />
            <p className="mt-4 font-bold">Thank you. Your report is with our team.</p>
            <p className="mt-1 text-sm text-ink-faint">
              Reference <span className="font-mono font-bold text-ink">{reference}</span>
            </p>
            <button type="button" onClick={() => ref.current?.close()} className="btn-primary mt-6">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block">
              <span className="field-label">What happened?</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={2000}
                rows={4}
                placeholder="A line or two is enough. Please don’t include passwords or OTPs."
                className="field resize-none"
              />
            </label>
            <label className="block">
              <span className="field-label">Your email (optional, if you want a reply)</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={120}
                autoComplete="email"
                placeholder="you@example.com"
                className="field"
              />
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            {problem && (
              <div role="alert" className="rounded-2xl border border-sos-200 bg-sos-50 px-4 py-3 text-sm text-ink-soft">
                {problem.message}{" "}
                <a href={mailto} className="inline-flex items-center gap-1 font-bold text-brand hover:underline">
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email us
                </a>
              </div>
            )}
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-70">
              {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-label="Sending" /> : "Send report"}
            </button>
            <p className="text-center text-[11px] leading-relaxed text-ink-faint">
              We also receive this page’s address, your browser type and a problem code so we can find the cause.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
