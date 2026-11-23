"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send, Undo2, Wand2 } from "lucide-react";
import { post, type Problem } from "@/components/feedback/api";
import ProblemNotice from "@/components/feedback/ProblemNotice";

const EMPTY = { name: "", email: "", subject: "", message: "", company: "" };

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const [before, setBefore] = useState<string | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [done, setDone] = useState<{ ref: string; replied: boolean } | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setProblem(null);
    const r = await post<{ ref: string; replied: boolean }>("/api/contact", form);
    setBusy(false);
    if (!r.ok) return setProblem(r.problem);
    setDone(r.data);
    setForm(EMPTY);
    setBefore(null);
  };

  const polish = async () => {
    if (polishing) return;
    setPolishing(true);
    setProblem(null);
    const r = await post<{ text: string }>("/api/assist", { task: "polish", text: form.message });
    setPolishing(false);
    if (!r.ok) return setProblem(r.problem);
    setBefore(form.message);
    setForm((f) => ({ ...f, message: r.data.text }));
  };

  if (done) {
    return (
      <div className="card flex flex-col items-center justify-center p-10 text-center" role="status">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-safe-50 text-safe-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-xl font-bold text-ink">Message received</h3>
        <p className="mt-2 max-w-sm text-sm text-ink-faint">
          Our team will reply within 1-2 working days.{done.replied && " We’ve also emailed you a confirmation."}
        </p>
        <p className="mt-3 text-sm text-ink-faint">
          Reference <span className="font-mono font-bold text-ink">{done.ref}</span>
        </p>
        <button type="button" onClick={() => setDone(null)} className="btn-ghost mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-7 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Your name</span>
          <input required value={form.name} onChange={set("name")} maxLength={80} autoComplete="name" placeholder="Your full name" className="field" />
        </label>
        <label className="block">
          <span className="field-label">Email address</span>
          <input required type="email" value={form.email} onChange={set("email")} maxLength={120} autoComplete="email" placeholder="you@example.com" className="field" />
        </label>
      </div>
      <label className="block">
        <span className="field-label">Subject (optional)</span>
        <input value={form.subject} onChange={set("subject")} maxLength={120} placeholder="How can we help?" className="field" />
      </label>
      <div>
        <label className="block">
          <span className="field-label">Message</span>
          <textarea required value={form.message} onChange={set("message")} maxLength={2000} rows={5} placeholder="Tell us what’s on your mind" className="field resize-none" />
        </label>
        <div className="mt-2 flex items-center justify-end gap-2">
          {before !== null && (
            <button
              type="button"
              onClick={() => {
                setForm((f) => ({ ...f, message: before }));
                setBefore(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-ink-faint hover:bg-mist hover:text-ink"
            >
              <Undo2 className="h-3.5 w-3.5" aria-hidden="true" /> Undo
            </button>
          )}
          <button
            type="button"
            onClick={polish}
            disabled={polishing || form.message.trim().length < 10}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand transition-opacity hover:bg-brand-100 disabled:opacity-40"
          >
            {polishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />}
            Improve with AI
          </button>
        </div>
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" value={form.company} onChange={set("company")} className="hidden" aria-hidden="true" />
      {problem && <ProblemNotice problem={problem} area="Contact form" />}
      <button type="submit" disabled={busy} className="btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-70">
        {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
        {busy ? "Sending" : "Send message"}
      </button>
      <p className="text-center text-xs text-ink-faint">Please don’t send passwords, card details or OTPs.</p>
    </form>
  );
}
