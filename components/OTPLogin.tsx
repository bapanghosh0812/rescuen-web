"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, KeyRound, ListChecks, Loader2, LogOut, PencilLine, Phone, Route, ShieldCheck, Smartphone, Sparkles, UserRound } from "lucide-react";
import { openAssistant } from "@/components/feedback/bus";
import { post, type Problem } from "@/components/feedback/api";
import ProblemNotice from "@/components/feedback/ProblemNotice";
import type { ConfirmationResult, User } from "@/lib/firebase.client";
import { cleanName, maskPhone, rememberProfile, useProfile, type Profile } from "@/lib/profile";
import { SITE } from "@/lib/site";

// Codes are sent inside India only.
const CC = "+91";

type Step = "phone" | "otp" | "name" | "profile";

export default function OTPLogin({ google = false }: { google?: boolean }) {
  const [step, setStep] = useState<Step>("phone");
  const [opening, setOpening] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const error = !!problem;
  const setError = (message: string, code = "E-AUTH-FORM") => setProblem(message ? { message, code } : null);
  const [resendIn, setResendIn] = useState(0);
  // Who this device remembers, until Firebase has confirmed who is signed in.
  const remembered = useProfile();
  const [me, setMe] = useState<Profile | null>(null);
  const known = me || remembered;
  const [confirmed, setConfirmed] = useState(false);
  const [contact, setContact] = useState("");
  const [name, setName] = useState("");
  const arriving = useRef(false);
  const [shake, setShake] = useState(false);

  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fullNumber = useMemo(() => `${CC}${phone.replace(/\D/g, "")}`, [phone]);

  const open = (p: Profile) => {
    setMe(p);
    rememberProfile(p);
    setStep("profile");
  };
  const forget = () => {
    setMe(null);
    rememberProfile(null);
    setStep((s) => (s === "profile" || s === "name" ? "phone" : s));
  };

  /** Opens the profile, or asks for a name the first time. */
  const arrive = (user: User) => {
    const how = user.phoneNumber ? maskPhone(user.phoneNumber) : user.email || "";
    const saved = cleanName(user.displayName || "");
    setContact(how);
    setProblem(null);
    if (saved) {
      open({ name: saved, contact: how });
    } else {
      setName("");
      setStep("name");
    }
  };

  // Already signed in on this device? Then the profile opens and nothing is asked again.
  useEffect(() => {
    let stop = () => {};
    let gone = false;
    import("@/lib/firebase.client")
      .then(({ watchUser }) => {
        if (gone) return;
        stop = watchUser((user) => {
          setConfirmed(true);
          if (arriving.current) return;
          if (user) arrive(user);
          else forget();
        });
      })
      .catch(() => setConfirmed(true));
    return () => {
      gone = true;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** A fresh sign-in, checked by our server before the profile opens. */
  const welcome = async (user: User) => {
    const checked = await post("/api/verify-token", { idToken: await user.getIdToken() });
    if (!checked.ok && checked.problem.code === "E-TOKEN") {
      await import("@/lib/firebase.client").then((m) => m.endSession());
      setProblem(checked.problem);
      return;
    }
    arrive(user);
  };

  const submitName = async (e: React.FormEvent) => {
    e.preventDefault();
    const good = cleanName(name);
    if (!good) {
      setError("Please enter your name, using letters only.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { saveName } = await import("@/lib/firebase.client");
      await saveName(good);
      open({ name: good, contact });
    } catch (err: unknown) {
      setProblem(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const leave = async () => {
    setLoading(true);
    try {
      await import("@/lib/firebase.client").then((m) => m.endSession());
    } catch {
      // signing out on this device must always work
    }
    forget();
    setPhone("");
    setOtp(Array(6).fill(""));
    setProblem(null);
    setLoading(false);
  };

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
    if (digits.length !== 10) {
      setError("Please enter your 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const { sendOtp } = await import("@/lib/firebase.client");
      confirmationRef.current = await sendOtp(fullNumber, "recaptcha-container");
      setStep("otp");
      setResendIn(36);
      setOtp(Array(6).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 120);
    } catch (err: unknown) {
      setProblem(friendlyError(err));
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
    arriving.current = true;
    try {
      if (!confirmationRef.current) throw Object.assign(new Error("expired"), { code: "auth/code-expired" });
      const cred = await confirmationRef.current.confirm(code);
      await welcome(cred.user);
    } catch (err: unknown) {
      setProblem(friendlyError(err));
      triggerShake();
      setOtp(Array(6).fill(""));
      otpRefs.current[0]?.focus();
    } finally {
      arriving.current = false;
      setLoading(false);
    }
  };

  const withGoogle = async () => {
    setError("");
    setOpening(true);
    arriving.current = true;
    try {
      const { signInWithGoogle } = await import("@/lib/firebase.client");
      const { user } = await signInWithGoogle();
      await welcome(user);
    } catch (err: unknown) {
      setProblem(friendlyError(err));
    } finally {
      arriving.current = false;
      setOpening(false);
    }
  };

  // Known visitors see their profile at once, while the sign-in is confirmed behind it.
  const view: Step = !confirmed && known ? "profile" : step;

  const mmss = `00:${String(resendIn).padStart(2, "0")}`;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-clip bg-[#070b16] px-5 py-12">
      {/* Ambient luxury background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-96 w-96 glow [--g:theme(colors.brand.700/40%)]" />
        <div className="absolute -right-16 bottom-0 h-96 w-96 glow [--g:theme(colors.gold.600/20%)]" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 glow [--g:theme(colors.gold.500/10%)]" />
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
      <div className="relative z-10 w-full max-w-md overflow-clip rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-9">
        {/* warm streak */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-56 rotate-12 bg-gold-400/10 blur-2xl" />

        {/* Brand */}
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white">
            <Image src="/rescuen-logo.png" alt="" width={24} height={24} className="object-contain" />
          </span>
          <span data-no-translate className="font-display text-lg font-extrabold tracking-tight text-white">
            RESCU<span className="text-gold-400">EN</span>
          </span>
        </Link>

          {/* ── PHONE ── */}
          {view === "phone" && (
            <div className="menu-pop relative mt-7">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-gradient text-ink shadow-gold">
                <Phone className="h-5 w-5" />
              </div>
              <h1 className="mt-4 font-display text-2xl font-extrabold text-white sm:text-3xl">
                Welcome to <span className="text-gold-400">RESCUEN</span>
              </h1>
              <p className="mt-1.5 text-sm text-white/70">
                Enter your phone number — we’ll text you a secure code.
              </p>

              {google && (
                <>
                  <button
                    type="button"
                    onClick={withGoogle}
                    disabled={opening}
                    className="btn mt-7 w-full bg-white text-base text-ink shadow-card hover:bg-mist disabled:opacity-70"
                  >
                    {opening ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <GoogleMark />}
                    Continue with Google
                  </button>
                  <p className="mt-6 flex items-center gap-3 text-center text-xs font-semibold text-white/55 before:h-px before:flex-1 before:bg-white/15 after:h-px after:flex-1 after:bg-white/15">
                    or use your phone number
                  </p>
                </>
              )}

              <form onSubmit={startOtp} className={`${google ? "mt-5" : "mt-7"} space-y-5`}>
                <div className="flex items-stretch rounded-xl border border-white/10 bg-white/5 focus-within:border-gold-400">
                  <span className="grid place-items-center border-r border-white/10 px-4 text-sm font-semibold text-white" aria-hidden="true">
                    {CC}
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    aria-label="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, "").slice(0, 12))}
                    placeholder="98765 43210"
                    className="w-full min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none"
                    required
                  />
                </div>

                {problem && <ProblemNotice dark problem={problem} area="Sign in" />}

                <button type="submit" disabled={loading} className="btn-gold w-full text-base disabled:opacity-70">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" aria-label="Sending" /> : "Send code"}
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn border border-white/15 bg-white/5 px-3 py-3 text-xs text-white hover:bg-white/10">
                    <Smartphone className="h-4 w-4" aria-hidden="true" /> Use the app
                  </a>
                  <button type="button" onClick={() => openAssistant({ question: "I can’t sign in" })} className="btn border border-white/15 bg-white/5 px-3 py-3 text-xs text-white hover:bg-white/10">
                    <Sparkles className="h-4 w-4 text-gold-400" aria-hidden="true" /> Get help
                  </button>
                </div>

                <p className="flex items-center justify-center gap-1.5 text-xs text-white/60">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" /> Private and encrypted. No password needed.
                </p>
              </form>
            </div>
          )}

          {/* ── OTP (video style) ── */}
          {view === "otp" && (
            <div className="menu-pop relative mt-7 text-center">
              <button onClick={() => {
                  setProblem(null);
                  setStep("phone");
                }} className="absolute -top-1 left-0 inline-flex items-center gap-1 text-xs font-semibold text-white/50 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-gradient text-ink shadow-gold">
                <KeyRound className="h-5 w-5" />
              </div>
              <h1 className="mt-4 font-display text-2xl font-extrabold text-white sm:text-3xl">
                Verify <span className="text-gold-400">OTP</span>
              </h1>
              <p className="mt-1.5 text-sm text-white/70">
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

                {problem && <ProblemNotice dark problem={problem} area="Sign in code" className="mt-4" />}

                <p className="mt-5 text-xs text-white/60">
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

              </form>
            </div>
          )}

          {/* ── NAME (first time, or to change it) ── */}
          {view === "name" && (
            <div className="menu-pop relative mt-7">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-gradient text-ink shadow-gold">
                <UserRound className="h-5 w-5" />
              </div>
              <h1 className="mt-4 font-display text-2xl font-extrabold text-white sm:text-3xl">What should we call you?</h1>
              <p className="mt-1.5 text-sm text-white/70">
                Just your name. It becomes your profile, and signing in the same way always opens it.
              </p>
              <form onSubmit={submitName} className="mt-7 space-y-5">
                <input
                  autoComplete="name"
                  aria-label="Your name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value.slice(0, 40));
                    if (problem) setProblem(null);
                  }}
                  autoFocus
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-white placeholder:text-white/35 outline-none focus:border-gold-400"
                />
                {problem && <ProblemNotice dark problem={problem} area="Profile name" />}
                <button type="submit" disabled={loading} className="btn-gold w-full text-base disabled:opacity-70">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" aria-label="Saving" /> : "Save my profile"}
                </button>
              </form>
            </div>
          )}

          {/* ── PROFILE ── */}
          {view === "profile" && known && (
            <div className="menu-pop relative mt-8 text-center">
              <span data-no-translate className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold-gradient font-display text-3xl font-extrabold text-ink shadow-gold" aria-hidden="true">
                {initial(known.name)}
              </span>
              <h1 className="mt-5 font-display text-2xl font-extrabold text-white [overflow-wrap:anywhere] sm:text-3xl">
                <span>Namaste,</span> <span data-no-translate className="text-gold-400">{known.name}</span>
              </h1>
              {known.contact && <p data-no-translate className="mt-1.5 text-sm text-white/65">{known.contact}</p>}
              <div className="mt-7 flex flex-col gap-3">
                <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-gold w-full text-base">
                  <Smartphone className="h-5 w-5" aria-hidden="true" /> Continue to the App
                </a>
                <div className="grid grid-cols-2 gap-2.5">
                  <Link href="/ai#planner" className="btn border border-white/15 bg-white/5 px-3 py-3 text-xs text-white hover:bg-white/10">
                    <Route className="h-4 w-4 text-gold-400" aria-hidden="true" /> Safety Planner
                  </Link>
                  <Link href="/ai#check" className="btn border border-white/15 bg-white/5 px-3 py-3 text-xs text-white hover:bg-white/10">
                    <ListChecks className="h-4 w-4 text-gold-400" aria-hidden="true" /> Safety Check
                  </Link>
                </div>
                <Link href="/" className="btn w-full border border-white/15 bg-white/5 text-white hover:bg-white/10">
                  Back to Home
                </Link>
              </div>
              {problem && <ProblemNotice dark problem={problem} area="Profile" className="mt-5" />}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setName(known.name);
                    setContact(known.contact);
                    setProblem(null);
                    setConfirmed(true);
                    setStep("name");
                  }}
                  className="inline-flex items-center gap-1.5 py-2 text-white/70 hover:text-gold-400"
                >
                  <PencilLine className="h-3.5 w-3.5" aria-hidden="true" /> Change name
                </button>
                <button type="button" onClick={leave} disabled={loading} className="inline-flex items-center gap-1.5 py-2 text-white/70 hover:text-gold-400">
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
                </button>
              </div>
              <p className="mt-2 text-[11px] text-white/55">You stay signed in on this device until you sign out.</p>
            </div>
          )}

        {view !== "profile" && (
          <p className="relative mt-7 text-center text-[11px] text-white/60">
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

/** The first letter of a name, in any script. */
const initial = (name: string) => [...name][0]?.toUpperCase() || "R";

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.600 0-12-5.400-12-12s5.400-12 12-12c3.100 0 5.800 1.200 8 3l5.700-5.700C34 6 29.300 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.300-.1-2.400-.4-3.500z" />
      <path fill="#FF3D00" d="m6.300 14.700 6.600 4.800C14.700 15.100 19 12 24 12c3.100 0 5.800 1.200 8 3l5.700-5.700C34 6 29.300 4 24 4 16.300 4 9.700 8.300 6.300 14.700z" />
      <path fill="#4CAF50" d="M24 44c5.200 0 9.900-2 13.400-5.200l-6.200-5.200C29.200 35.100 26.700 36 24 36c-5.200 0-9.600-3.300-11.300-8l-6.500 5C9.500 39.600 16.200 44 24 44z" />
      <path fill="#1976D2" d="M43.600 20.500H42V20H24v8h11.300c-.8 2.200-2.200 4.200-4.100 5.600l6.200 5.200C37 39.200 44 34 44 24c0-1.300-.1-2.400-.4-3.500z" />
    </svg>
  );
}

const LATER = "Website sign-in is taking a short break. Your RESCUEN app works as usual.";

/** What a visitor is told, and the short code our team sees in a report. */
const PROBLEMS: Record<string, [string, string]> = {
  "auth/invalid-phone-number": ["That phone number doesn’t look right. Please check it and try again.", "E-AUTH-NUMBER"],
  "auth/missing-phone-number": ["Please enter your phone number.", "E-AUTH-NUMBER"],
  "auth/too-many-requests": ["You’ve tried a few times. Please wait a little and try again.", "E-AUTH-LIMIT"],
  "auth/invalid-verification-code": ["That code isn’t right. Please check the SMS and try again.", "E-AUTH-CODE"],
  "auth/code-expired": ["That code has expired. Please request a new one.", "E-AUTH-EXPIRED"],
  "auth/network-request-failed": ["You seem to be offline. Please check your connection and try again.", "E-AUTH-NET"],
  "auth/captcha-check-failed": ["We couldn’t confirm this device. Please refresh the page and try again.", "E-AUTH-CHECK"],
  "auth/invalid-app-credential": ["We couldn’t confirm this device. Please refresh the page and try again.", "E-AUTH-CHECK"],
  "auth/popup-closed-by-user": ["The sign-in window was closed. Please try again.", "E-AUTH-CLOSED"],
  "auth/cancelled-popup-request": ["The sign-in window was closed. Please try again.", "E-AUTH-CLOSED"],
  "auth/popup-blocked": ["Your browser blocked the sign-in window. Please allow it and try again.", "E-AUTH-POPUP"],
  "auth/billing-not-enabled": [LATER, "E-AUTH-SMS"],
  "auth/operation-not-allowed": [LATER, "E-AUTH-SMS"],
  "auth/quota-exceeded": [LATER, "E-AUTH-SMS"],
  "auth/unauthorized-domain": [LATER, "E-AUTH-DOMAIN"],
  "auth/user-token-expired": ["Your sign-in has expired. Please sign in again.", "E-AUTH-EXPIRED"],
  "auth/requires-recent-login": ["Your sign-in has expired. Please sign in again.", "E-AUTH-EXPIRED"],
};

/** Turns any sign-in failure into plain words. Technical details never reach the page. */
function friendlyError(err: unknown): Problem {
  const [message, code] = PROBLEMS[(err as { code?: string })?.code || ""] || [LATER, "E-AUTH-OTHER"];
  return { message, code };
}
