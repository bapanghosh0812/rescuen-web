"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Info,
} from "lucide-react";
import {
  isFirebaseConfigured,
  createRecaptcha,
  sendOtp,
  type ConfirmationResult,
} from "@/lib/firebase.client";
import { SITE } from "@/lib/site";

const COUNTRIES = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+61", label: "🇦🇺 +61" },
];

type Step = "phone" | "otp" | "success";

export default function OTPLogin() {
  const [step, setStep] = useState<Step>("phone");
  const [cc, setCc] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [serverVerified, setServerVerified] = useState<boolean | null>(null);
  const [shake, setShake] = useState(false);

  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const demo = !isFirebaseConfigured;

  const fullNumber = useMemo(() => `${cc}${phone.replace(/\D/g, "")}`, [cc, phone]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  // WebOTP — on a phone, auto-detect the incoming SMS code and auto-verify.
  useEffect(() => {
    if (step !== "otp") return;
    if (typeof window === "undefined" || !("OTPCredential" in window)) return;
    const ac = new AbortController();
    (navigator.credentials as unknown as {
      get: (o: unknown) => Promise<{ code?: string } | null>;
    })
      .get({ otp: { transport: ["sms"] }, signal: ac.signal })
      .then((cred) => {
        const code = cred?.code?.replace(/\D/g, "").slice(0, 6);
        if (code && code.length === 6) {
          setOtp(code.split(""));
          verify(undefined, code);
        }
      })
      .catch(() => {});
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const startOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    try {
      if (demo) {
        await new Promise((r) => setTimeout(r, 700));
      } else {
        const verifier = createRecaptcha("recaptcha-container");
        if (!verifier) throw new Error("Verification unavailable.");
        confirmationRef.current = await sendOtp(fullNumber, verifier);
      }
      setStep("otp");
      setResendIn(36);
      setOtp(Array(6).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 120);
    } catch (err: unknown) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const onOtpChange = (i: number, val: string) => {
    const d = val.replace(/\D/g, "");
    setError("");
    if (!d) {
      setOtp((p) => p.map((x, k) => (k === i ? "" : x)));
      return;
    }
    if (d.length > 1) {
      const arr = d.slice(0, 6).split("");
      const next = Array(6).fill("").map((_, k) => arr[k] ?? "");
      setOtp(next);
      otpRefs.current[Math.min(arr.length, 5)]?.focus();
      if (next.every((x) => x)) verify(undefined, next.join(""));
      return;
    }
    const next = otp.map((x, k) => (k === i ? d : x));
    setOtp(next);
    if (i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every((x) => x)) verify(undefined, next.join(""));
  };

  const onOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const verify = async (e?: React.FormEvent, codeOverride?: string) => {
    e?.preventDefault();
    const code = codeOverride ?? otp.join("");
    if (code.length !== 6) {
      setError("Enter the full 6-digit code.");
      return;
    }
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      let idToken = "";
      if (demo) {
        await new Promise((r) => setTimeout(r, 800));
        if (code !== "123456") {
          setError("Demo code is 123456. (Live SMS activates once Firebase is fully set up.)");
          setLoading(false);
          triggerShake();
          setOtp(Array(6).fill(""));
          otpRefs.current[0]?.focus();
          return;
        }
      } else {
        if (!confirmationRef.current) throw new Error("Session expired. Please resend the code.");
        const cred = await confirmationRef.current.confirm(code);
        idToken = await cred.user.getIdToken();
      }

      if (idToken) {
        try {
          const res = await fetch("/api/verify-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
          setServerVerified(res.ok);
        } catch {
          setServerVerified(false);
        }
      }

      setVerifiedPhone(fullNumber);
      setStep("success");
    } catch (err: unknown) {
      setError(friendlyError(err));
      triggerShake();
      setOtp(Array(6).fill(""));
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const mmss = `00:${String(resendIn).padStart(2, "0")}`;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b16] px-5 py-12">
      {/* Ambient luxury background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-brand-700/40 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-gold-600/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />
      </div>

      {/* Glassy card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-9">
        {/* warm streak */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-56 rotate-12 bg-gold-400/10 blur-2xl" />

        {/* Brand */}
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white">
            <Image src="/rescuen-logo.png" alt="RESCUEN" width={24} height={24} className="object-contain" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-white">
            RESCU<span className="text-gold-400">EN</span>
          </span>
        </Link>

        {demo && step !== "success" && (
          <div className="relative mt-5 flex items-start gap-2 rounded-2xl border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-xs text-gold-100">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
            <span>
              <b>Demo mode.</b> Firebase keys not detected — use code <b>123456</b> to try the flow.
              It goes fully live once your keys are set.
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── PHONE ── */}
          {step === "phone" && (
            <motion.div key="phone" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="relative mt-7">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-gradient text-ink shadow-gold">
                <Phone className="h-5 w-5" />
              </div>
              <h1 className="mt-4 font-display text-2xl font-extrabold text-white sm:text-3xl">
                Welcome to <span className="text-gold-400">RESCUEN</span>
              </h1>
              <p className="mt-1.5 text-sm text-white/55">
                Enter your phone number — we’ll text you a secure code.
              </p>

              <form onSubmit={startOtp} className="mt-7 space-y-5">
                <div className="flex gap-2">
                  <select
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-3.5 text-sm font-semibold text-white outline-none focus:border-gold-400 [&>option]:text-ink"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <input
                      inputMode="numeric"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
                      placeholder="98765 43210"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-gold-400"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-sm font-medium text-sos-300">{error}</p>}

                <button type="submit" disabled={loading} className="btn-gold w-full text-base disabled:opacity-70">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send OTP"}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-white/45">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold-400" /> Secured by Firebase · invisible reCAPTCHA
                </p>
              </form>
            </motion.div>
          )}

          {/* ── OTP (video style) ── */}
          {step === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="relative mt-7 text-center">
              <button onClick={() => setStep("phone")} className="absolute -top-1 left-0 inline-flex items-center gap-1 text-xs font-semibold text-white/50 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-gradient text-ink shadow-gold">
                <KeyRound className="h-5 w-5" />
              </div>
              <h1 className="mt-4 font-display text-2xl font-extrabold text-white sm:text-3xl">
                Verify <span className="text-gold-400">OTP</span>
              </h1>
              <p className="mt-1.5 text-sm text-white/55">
                Enter the 6-digit code sent to <b className="text-white/80">{fullNumber}</b>
              </p>

              <form onSubmit={(e) => verify(e)} className="mt-7">
                <div className={`flex justify-center gap-2.5 ${shake ? "animate-shake" : ""}`}>
                  {otp.map((d, i) => {
                    const activeIdx = otp.findIndex((x) => !x);
                    const isActive = i === activeIdx && !error;
                    const filled = !!d;
                    return (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        value={d}
                        onChange={(e) => onOtpChange(i, e.target.value)}
                        onKeyDown={(e) => onOtpKey(i, e)}
                        onFocus={(e) => e.currentTarget.select()}
                        inputMode="numeric"
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        maxLength={6}
                        aria-label={`Digit ${i + 1}`}
                        className={`h-12 w-11 rounded-xl border text-center text-lg font-extrabold outline-none transition-all duration-150 sm:h-14 sm:w-12 sm:text-xl ${
                          error
                            ? "border-sos-400 bg-sos-500/15 text-sos-200"
                            : filled
                              ? "animate-otp-pop border-gold-400 bg-gold-400/15 text-white shadow-gold"
                              : isActive
                                ? "border-gold-400 bg-white/[0.06] text-white ring-2 ring-gold-400/30"
                                : "border-white/12 bg-white/[0.05] text-white"
                        }`}
                      />
                    );
                  })}
                </div>

                {error && <p className="mt-4 text-sm font-medium text-sos-300">{error}</p>}

                <p className="mt-5 text-xs text-white/45">
                  Didn’t receive the code?{" "}
                  {resendIn > 0 ? (
                    <span className="text-white/70">Resend in {mmss}</span>
                  ) : (
                    <button type="button" onClick={() => startOtp()} className="font-semibold text-gold-400 hover:underline">
                      Resend
                    </button>
                  )}
                </p>

                <button type="submit" disabled={loading} className="btn-gold mt-6 w-full text-base disabled:opacity-80">
                  {loading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Verifying Code…</>
                  ) : (
                    "Verify & Proceed"
                  )}
                </button>

                <p className="mt-3 text-center text-[11px] text-white/40">
                  📲 On your phone, the code is detected &amp; filled automatically.
                </p>
              </form>
            </motion.div>
          )}

          {/* ── SUCCESS ── */}
          {step === "success" && (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative mt-8 text-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.05 }}
                className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold-gradient text-ink shadow-gold"
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.span>
              <h1 className="mt-6 font-display text-2xl font-extrabold text-white sm:text-3xl">You’re verified! 🎉</h1>
              <p className="mt-2 text-white/60">
                Signed in as <b className="text-white">{verifiedPhone}</b>
              </p>
              {serverVerified !== null && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold-400" />
                  {serverVerified ? "Confirmed on secured backend" : "Verified on device"}
                </p>
              )}
              <div className="mt-8 flex flex-col gap-3">
                <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-gold w-full text-base">
                  Continue to the App
                </a>
                <Link href="/" className="btn w-full border border-white/15 bg-white/5 text-white hover:bg-white/10">
                  Back to Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step !== "success" && (
          <p className="relative mt-7 text-center text-[11px] text-white/40">
            By continuing you agree to our{" "}
            <Link href="/legal/terms" className="font-semibold text-white/60 hover:text-gold-400">Terms</Link> &amp;{" "}
            <Link href="/legal/privacy" className="font-semibold text-white/60 hover:text-gold-400">Privacy</Link>.
          </p>
        )}

        <div id="recaptcha-container" />
      </div>
    </div>
  );
}

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code || "";
  const map: Record<string, string> = {
    "auth/invalid-phone-number": "That phone number doesn’t look right.",
    "auth/too-many-requests": "Too many attempts. Please wait a while and try again.",
    "auth/invalid-verification-code": "Incorrect code. Please check and try again.",
    "auth/code-expired": "The code expired. Please resend a new one.",
    "auth/quota-exceeded": "SMS limit reached. Please try again later.",
    "auth/captcha-check-failed": "Verification failed. Please refresh and try again.",
    "auth/billing-not-enabled": "Phone sign-in needs to be enabled in Firebase.",
    "auth/operation-not-allowed":
      "SMS for your region isn’t enabled yet. (Enable it in Firebase → Authentication → Settings → SMS region policy.)",
    "auth/admin-restricted-operation":
      "Phone sign-in is restricted. Please enable it in Firebase Authentication settings.",
  };
  if (map[code]) return map[code];
  const msg = (err as { message?: string })?.message || "";
  if (/region/i.test(msg))
    return "SMS for your region isn’t enabled yet. Enable it in Firebase → Authentication → Settings → SMS region policy.";
  return msg && !msg.includes("Firebase") ? msg : "Something went wrong. Please try again.";
}
