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
  Lock,
  Radar,
  Sparkles,
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
        // Demo mode — no SMS sent. Any code, or 123456, verifies.
        await new Promise((r) => setTimeout(r, 700));
      } else {
        const verifier = createRecaptcha("recaptcha-container");
        if (!verifier) throw new Error("Verification unavailable.");
        confirmationRef.current = await sendOtp(fullNumber, verifier);
      }
      setStep("otp");
      setResendIn(30);
      setOtp(Array(6).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 120);
    } catch (err: unknown) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const onOtpChange = (i: number, val: string) => {
    const d = val.replace(/\D/g, "");
    setError("");
    if (!d) {
      setOtp((p) => p.map((x, k) => (k === i ? "" : x)));
      return;
    }
    // handle paste / auto-read of a full code
    if (d.length > 1) {
      const arr = d.slice(0, 6).split("");
      const next = Array(6)
        .fill("")
        .map((_, k) => arr[k] ?? "");
      setOtp(next);
      otpRefs.current[Math.min(arr.length, 5)]?.focus();
      if (next.every((x) => x)) verify(undefined, next.join(""));
      return;
    }
    const next = otp.map((x, k) => (k === i ? d : x));
    setOtp(next);
    if (i < 5) otpRefs.current[i + 1]?.focus();
    // Auto-verify the moment all six are filled — “video jaisa”.
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
        await new Promise((r) => setTimeout(r, 700));
        if (code !== "123456") {
          setError("Demo code is 123456. (Live SMS activates once Firebase keys are added.)");
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

      // Optional: verify the token on our secured backend.
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

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-10 h-80 w-80 rounded-full bg-brand/30 blur-3xl animate-aurora" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl animate-aurora [animation-delay:-8s]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white">
              <Image src="/rescuen-logo.png" alt="RESCUEN" width={28} height={28} className="object-contain" />
            </span>
            <span className="font-display text-xl font-extrabold text-white">
              RESCU<span className="text-brand-400">EN</span>
            </span>
          </Link>

          <div>
            <h2 className="h-display text-4xl font-extrabold leading-tight text-white">
              Sign in the safe way —<br />
              <span className="text-gradient-gold">no password, ever.</span>
            </h2>
            <p className="mt-4 max-w-md text-white/70">
              Just your phone number and a one-time code. Verified by Google Firebase and confirmed on
              our secured backend.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Lock, t: "Passwordless & phishing-proof" },
                { icon: Radar, t: "Instant access to your safety radar" },
                { icon: Sparkles, t: "No lengthy permissions to accept" },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-3 text-white/90">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                    <Icon className="h-5 w-5 text-brand-400" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/50">© {new Date().getFullYear()} {SITE.legalName}</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-canvas px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-soft ring-1 ring-line">
                <Image src="/rescuen-logo.png" alt="RESCUEN" width={28} height={28} className="object-contain" />
              </span>
              <span className="font-display text-xl font-extrabold">
                RESCU<span className="text-brand">EN</span>
              </span>
            </Link>
          </div>

          {demo && step !== "success" && (
            <div className="mb-5 flex items-start gap-2 rounded-2xl border border-gold-200 bg-gold-50 px-4 py-3 text-xs text-ink-soft">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              <span>
                <b>Demo mode.</b> Firebase keys not added yet, so no real SMS is sent — use code{" "}
                <b>123456</b> to try the flow. It goes fully live the moment you add your keys.
              </span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.div key="phone" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <h1 className="h-display text-3xl font-extrabold">Welcome to RESCUEN</h1>
                <p className="mt-2 text-ink-soft">Enter your phone number to continue.</p>

                <form onSubmit={startOtp} className="mt-8 space-y-5">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-faint">
                      Phone number
                    </span>
                    <div className="flex gap-2">
                      <select
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                        className="rounded-xl border border-line bg-paper px-3 py-3.5 text-sm font-semibold text-ink focus:border-brand focus:bg-white"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                        <input
                          inputMode="numeric"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
                          placeholder="98765 43210"
                          className="w-full rounded-xl border border-line bg-paper py-3.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-faint/70 focus:border-brand focus:bg-white"
                          required
                        />
                      </div>
                    </div>
                  </label>

                  {error && <p className="text-sm font-medium text-brand-700">{error}</p>}

                  <button type="submit" disabled={loading} className="btn-primary w-full text-base disabled:opacity-70">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send OTP"}
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-xs text-ink-faint">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Secured by Firebase · invisible reCAPTCHA
                  </p>
                </form>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <button onClick={() => setStep("phone")} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-faint hover:text-ink">
                  <ArrowLeft className="h-4 w-4" /> Change number
                </button>
                <h1 className="h-display text-3xl font-extrabold">Enter the code</h1>
                <p className="mt-2 text-ink-soft">
                  We sent a 6-digit code to <b className="text-ink">{fullNumber}</b>
                </p>

                <form onSubmit={(e) => verify(e)} className="mt-8">
                  <div className={`flex justify-between gap-2 ${shake ? "animate-shake" : ""}`}>
                    {otp.map((d, i) => {
                      const activeIdx = otp.findIndex((x) => !x);
                      const isActive = i === activeIdx && !error;
                      const filled = !!d;
                      return (
                        <input
                          key={i}
                          ref={(el) => {
                            otpRefs.current[i] = el;
                          }}
                          value={d}
                          onChange={(e) => onOtpChange(i, e.target.value)}
                          onKeyDown={(e) => onOtpKey(i, e)}
                          onFocus={(e) => e.currentTarget.select()}
                          inputMode="numeric"
                          autoComplete={i === 0 ? "one-time-code" : "off"}
                          maxLength={6}
                          aria-label={`Digit ${i + 1}`}
                          className={`h-14 w-full rounded-xl border text-center text-xl font-bold outline-none transition-all duration-150 ${
                            error
                              ? "border-sos bg-sos-50 text-sos-600"
                              : filled
                                ? "animate-otp-pop border-brand bg-brand-50 text-brand-700 shadow-soft"
                                : isActive
                                  ? "border-brand bg-white text-ink ring-2 ring-brand/30"
                                  : "border-line bg-paper text-ink"
                          }`}
                        />
                      );
                    })}
                  </div>

                  {error && <p className="mt-4 text-sm font-medium text-sos-600">{error}</p>}

                  <button type="submit" disabled={loading} className="btn-primary mt-6 w-full text-base disabled:opacity-70">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Continue"}
                  </button>

                  <p className="mt-3 text-center text-xs text-ink-faint">
                    📲 On your phone, the code fills in automatically.
                  </p>

                  <div className="mt-5 text-center text-sm text-ink-faint">
                    {resendIn > 0 ? (
                      <>Resend code in {resendIn}s</>
                    ) : (
                      <button type="button" onClick={() => startOtp()} className="font-semibold text-brand hover:underline">
                        Resend code
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.05 }}
                  className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </motion.span>
                <h1 className="h-display mt-6 text-3xl font-extrabold">You’re verified! 🎉</h1>
                <p className="mt-2 text-ink-soft">
                  Signed in as <b className="text-ink">{verifiedPhone}</b>
                </p>
                {serverVerified !== null && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-xs font-semibold text-ink-soft">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                    {serverVerified ? "Confirmed on secured backend" : "Verified on device"}
                  </p>
                )}
                <div className="mt-8 flex flex-col gap-3">
                  <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-primary w-full text-base">
                    Continue to the App
                  </a>
                  <Link href="/" className="btn-ghost w-full">
                    Back to Home
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step !== "success" && (
            <p className="mt-8 text-center text-xs text-ink-faint">
              By continuing you agree to our{" "}
              <Link href="/legal/terms" className="font-semibold text-ink-soft hover:text-brand">Terms</Link> and{" "}
              <Link href="/legal/privacy" className="font-semibold text-ink-soft hover:text-brand">Privacy Policy</Link>.
            </p>
          )}

          {/* invisible reCAPTCHA mount */}
          <div id="recaptcha-container" />
        </div>
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
  };
  if (map[code]) return map[code];
  const msg = (err as { message?: string })?.message;
  return msg && !msg.includes("Firebase") ? msg : "Something went wrong. Please try again.";
}
