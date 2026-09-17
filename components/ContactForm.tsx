"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "received" | "error";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", company: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus(data.delivered ? "sent" : "received");
      setForm({ name: "", email: "", subject: "", message: "", company: "" });
    } catch {
      setStatus("error");
      setError("Network error. Please check your connection and try again.");
    }
  };

  const done = status === "sent" || status === "received";

  return (
    <div className="card p-7 sm:p-8">
      {done ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h3 className="mt-4 text-xl font-bold text-ink">Message received!</h3>
          <p className="mt-2 max-w-sm text-sm text-ink-faint">
            {status === "sent"
              ? "Thank you — we’ve emailed you a confirmation and our team will reply shortly."
              : "Thank you — we’ve got your message and our team will reply shortly."}
          </p>
          <button onClick={() => setStatus("idle")} className="btn-ghost mt-6">
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name">
              <input
                required
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Ananya Sharma"
                className={inputCls}
              />
            </Field>
            <Field label="Email address">
              <input
                required
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Subject (optional)">
            <input
              value={form.subject}
              onChange={set("subject")}
              placeholder="How can we help?"
              className={inputCls}
            />
          </Field>

          <Field label="Message">
            <textarea
              required
              value={form.message}
              onChange={set("message")}
              rows={5}
              placeholder="Tell us what’s on your mind…"
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Honeypot — hidden from humans, catches bots */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={set("company")}
            className="hidden"
            aria-hidden="true"
          />

          {status === "error" && (
            <p className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "sending" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send className="h-5 w-5" /> Send Message
              </>
            )}
          </button>

          <p className="text-center text-xs text-ink-faint">
            🔒 Your details are encrypted and never shared. Please don’t send passwords or OTPs.
          </p>
        </form>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint/70 transition-colors focus:border-brand focus:bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      {children}
    </label>
  );
}
