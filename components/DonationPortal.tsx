"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Smartphone,
  CreditCard,
  Building2,
  Wallet,
  Lock,
  CheckCircle2,
  ArrowRight,
  Download,
  RefreshCw,
  MailCheck,
  AlertCircle,
  QrCode,
} from "lucide-react";
import NamasteIllustration from "@/components/NamasteIllustration";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (res: unknown) => void) => void;
    };
  }
}

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

type VerifiedReceipt = {
  receiptId: string;
  name: string;
  email: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  timestamp: string;
  message: string;
  emailDelivered: boolean;
};

const PRESET_AMOUNTS = [
  { value: 51, tag: "Shagun 🙏" },
  { value: 101, tag: "Popular ❤️" },
  { value: 501, tag: "Safety Shield 🛡️" },
  { value: 1100, tag: "Radar Hero ⚡" },
  { value: 5000, tag: "Guardian 🌟" },
  { value: 11000, tag: "Patron 👑" },
];

const PAYMENT_METHODS: {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  badge: string;
  icon: typeof Smartphone;
}[] = [
  {
    id: "upi",
    title: "UPI & Official QR",
    subtitle: "GPay, PhonePe, Paytm, BHIM & Auto-Verified QR",
    badge: "Instant & QR",
    icon: QrCode,
  },
  {
    id: "card",
    title: "Debit / Credit Card",
    subtitle: "RuPay, Visa, Mastercard, Maestro",
    badge: "256-Bit SSL",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    title: "NetBanking",
    subtitle: "SBI, HDFC, ICICI, Axis & 50+ Banks",
    badge: "Direct Bank",
    icon: Building2,
  },
  {
    id: "wallet",
    title: "Mobile Wallets",
    subtitle: "Amazon Pay, Mobikwik, Airtel Money",
    badge: "One-Tap",
    icon: Wallet,
  },
];

const PUBLIC_RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TwHgq9sFTpjuIL";

// On-demand SDK loader: Loads Razorpay script only when user clicks Pay, keeping Lighthouse 95+!
function loadRazorpaySdk(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.getElementById("razorpay-checkout-sdk") as HTMLScriptElement | null;
    if (existing) {
      if (window.Razorpay) return resolve(true);
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function DonationPortal({ compact = false }: { compact?: boolean }) {
  const [amount, setAmount] = useState<number>(101);
  const [customAmountStr, setCustomAmountStr] = useState<string>("101");
  // Name and Email are 100% optional: only used for sending receipt email if user enters email
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [company, setCompany] = useState<string>(""); // Honeypot
  const [method, setMethod] = useState<PaymentMethod>("upi");

  const [loading, setLoading] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // STRICT RULE: Receipt state is ONLY set when Razorpay server-to-server signature is verified!
  const [receipt, setReceipt] = useState<VerifiedReceipt | null>(null);

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setCustomAmountStr(String(val));
    setError(null);
  };

  const handleCustomAmountChange = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, "");
    setCustomAmountStr(cleaned);
    if (!cleaned) {
      setAmount(0);
      return;
    }
    const num = Math.min(100000, Math.max(0, parseInt(cleaned, 10)));
    setAmount(num);
    if (parseInt(cleaned, 10) > 100000) {
      setCustomAmountStr("100000");
    }
    setError(null);
  };

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

  // 100% OFFICIAL RAZORPAY STANDARD CHECKOUT FLOW
  async function initiateRazorpayPayment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatusText("");

    if (!amount || amount < 1 || amount > 100000) {
      setError("Daan rashi ₹1 se ₹1,00,000 ke beech honi chahiye.");
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(
        "Kripya sahi email address daalein (ya agar receipt nahi chahiye toh email khali chhod dein)."
      );
      return;
    }

    setLoading(true);
    setStatusText("Razorpay Order create ho raha hai...");

    try {
      // 1. Create order on backend with Razorpay API
      const res = await fetch("/api/donate/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          amount,
          method,
          message: message.trim() || undefined,
          company,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok || !data.order_id) {
        setError(data.error || "Order create karne me dikkat aayi. Kripya punah prayas karein.");
        setLoading(false);
        setStatusText("");
        return;
      }

      // 2. Load official Razorpay Checkout SDK
      setStatusText("Razorpay Secure Checkout khul raha hai...");
      const sdkReady = await loadRazorpaySdk();
      if (!sdkReady || !window.Razorpay) {
        setError("Razorpay SDK load nahi ho paaya. Kripya apna internet connection check karein.");
        setLoading(false);
        setStatusText("");
        return;
      }

      const rzpKey = PUBLIC_RAZORPAY_KEY_ID || data.keyId;

      const rzpOptions: Record<string, unknown> = {
        key: rzpKey,
        amount: data.amount, // in paise
        currency: data.currency || "INR",
        name: "Team RESCUEN",
        description: `Surakshit Bharat Mission Daan (${formattedAmount})`,
        image: "/rescuen-logo.png",
        order_id: data.order_id,
        prefill: {
          name: name.trim() || "Well-Wisher",
          email: email.trim() || "supporter@rescuen.app",
        },
        config: {
          display: {
            blocks: {
              preferred: {
                name: "Recommended for Quick Payment",
                instruments: [{ method }],
              },
            },
            sequence: ["block.preferred", "upi", "card", "netbanking", "wallet"],
            preferences: { show_default_blocks: true },
          },
        },
        theme: {
          color: "#004aad",
          backdrop_color: "rgba(10, 37, 64, 0.8)",
        },
        // STRICT: Called ONLY when user actually completes payment inside Razorpay!
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setStatusText("Bank & Signature verify ho raha hai...");
          await verifyPaymentOnServer({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderToken: data.orderToken,
          });
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStatusText("");
            setError("Payment cancel ho gaya ya window close ho gayi. Koi paisa nahi kata.");
          },
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on("payment.failed", (failRes: unknown) => {
        setLoading(false);
        setStatusText("");
        const desc =
          typeof failRes === "object" &&
          failRes !== null &&
          "error" in failRes &&
          typeof (failRes as { error?: { description?: string } }).error?.description === "string"
            ? (failRes as { error: { description: string } }).error.description
            : "Payment fail ho gaya. Koi paisa nahi kata.";
        setError(desc);
      });

      rzp.open();
      setLoading(false);
      setStatusText("");
    } catch {
      setError("Network error. Kripya dubara try karein.");
      setLoading(false);
      setStatusText("");
    }
  }

  // 3. Cryptographic Signature + Bank Capture Verification
  async function verifyPaymentOnServer(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderToken: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: payload.razorpay_order_id,
          razorpay_payment_id: payload.razorpay_payment_id,
          razorpay_signature: payload.razorpay_signature,
          orderToken: payload.orderToken,
          paymentMethod: method.toUpperCase(),
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          amount,
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok || !data.verified) {
        setError(data.error || "Payment verification failed. Please contact support.");
        setLoading(false);
        setStatusText("");
        return;
      }

      // SUCCESS: Payment is genuinely captured by bank and signature verified!
      setReceipt(data.receipt);
      setLoading(false);
      setStatusText("");
    } catch {
      setError("Verification network request failed. Please check your internet connection.");
      setLoading(false);
      setStatusText("");
    }
  }

  function handlePrintReceipt() {
    if (typeof window !== "undefined") window.print();
  }

  return (
    <div className="relative">
      {/* Decorative Luxury Background Glows (Static, zero GPU lag) */}
      <div className="pointer-events-none absolute -top-16 -left-16 -z-10 h-72 w-72 rounded-full bg-brand-200/35 blur-2xl" />
      <div className="pointer-events-none absolute top-1/3 -right-16 -z-10 h-80 w-80 rounded-full bg-gold-200/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 left-1/3 -z-10 h-64 w-64 rounded-full bg-safe-200/25 blur-2xl" />

      <div className={`grid items-start gap-10 lg:grid-cols-12 ${compact ? "" : "pt-4"}`}>
        {/* ───────── LEFT COLUMN: NAMASTE ILLUSTRATION & MISSION TRUST ───────── */}
        <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-28">
          <div className="w-full rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/95 via-brand-50/50 to-gold-100/35 p-6 sm:p-8 shadow-lift backdrop-blur-2xl ring-1 ring-brand-900/5">
            <NamasteIllustration celebrating={!!receipt} amount={amount} />

            <div className="mt-5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand">
                <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                100% Citizen-Powered Safety Mission
              </span>
              <h3 className="h-display mt-3 text-2xl sm:text-3xl text-ink">
                Har Ek Daan,{" "}
                <span className="text-gradient-brand">Kisi Ki Jaan Bachata Hai</span>
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                <b>Team RESCUEN</b> ne is life-saving safety platform ko har beti, mahila aur citizen
                ke liye <b>100% Free</b> rakha hai. Aapka ₹1 se ₹1,00,000 tak ka chhota sa sahyog
                (Daan) direct hamare 24×7 SOS servers, 1&nbsp;KM Rescue Radar, aur nationwide
                safety mission ko aage badhata hai.
              </p>
            </div>

            {/* Luxury Glass Impact Pillars */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-2xl border border-white/90 bg-white/80 p-3 shadow-soft backdrop-blur-md">
                <div className="font-display text-lg font-extrabold text-brand">₹1 – ₹1L</div>
                <div className="text-[11px] font-semibold text-ink-faint">Apni Marzi Se</div>
              </div>
              <div className="rounded-2xl border border-white/90 bg-white/80 p-3 shadow-soft backdrop-blur-md">
                <div className="font-display text-lg font-extrabold text-safe-600">100%</div>
                <div className="text-[11px] font-semibold text-ink-faint">Direct Mission</div>
              </div>
              <div className="rounded-2xl border border-white/90 bg-white/80 p-3 shadow-soft backdrop-blur-md">
                <div className="font-display text-lg font-extrabold text-gold-600">Optional</div>
                <div className="text-[11px] font-semibold text-ink-faint">Email Receipt</div>
              </div>
            </div>

            {/* Security Guarantee Badge */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 px-4 py-3 text-xs text-ink-soft">
              <ShieldCheck className="h-5 w-5 shrink-0 text-brand" />
              <span>
                <b>Official Razorpay Bank Gateway:</b> Only genuine bank-captured transactions with
                HMAC-SHA256 cryptographic signatures receive receipts and greetings.
              </span>
            </div>
          </div>
        </div>

        {/* ───────── RIGHT COLUMN: ULTRA-LUXURY PAYMENT CARD ───────── */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {/* STATE 1: COMPLETED RECEIPT & CELEBRATION GREETING (ONLY AFTER REAL BANK PAYMENT!) */}
            {receipt ? (
              <motion.div
                key="receipt-view"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden rounded-[2.2rem] border border-gold-300/70 bg-white p-6 sm:p-9 shadow-lift ring-1 ring-gold-400/20"
              >
                <div className="text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-safe-gradient text-white shadow-lg">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-gold-600">
                    🙏 Koti-Koti Dhanyavaad · Bank Verified Contribution
                  </span>
                  <h2 className="h-display mt-3 text-3xl sm:text-4xl text-ink">
                    Namaste &amp; Thank You,{" "}
                    <span className="text-gradient-brand">{receipt.name}!</span>
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-ink-soft">
                    <b>Team RESCUEN</b> ki taraf se aapko dil se koti-koti pranaam! Aapka sahyog
                    Bharat ki har beti aur citizen ko 24×7 surakshit rakhne mein madad karega.
                  </p>
                </div>

                {/* Exact Dark-Mode RESCUEN Support Frame (Matches User's Screenshot!) */}
                <div className="mt-7 overflow-hidden rounded-3xl border border-[#222836] bg-[#12151c] text-[#e5e9f0] shadow-2xl">
                  <div className="flex items-center justify-center gap-3 bg-[#004aad] px-6 py-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/rescuen-logo.png" alt="RESCUEN" className="h-7 w-7 object-contain" />
                    </span>
                    <span className="font-serif text-xl font-bold tracking-wider text-white">
                      RESCUEN
                    </span>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="font-serif text-lg sm:text-xl font-bold text-white">
                      Hi {receipt.name} , we’ve got your contribution ✅
                    </div>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#b8c1d1]">
                      Thank you for supporting <b className="text-white">Team RESCUEN</b>.{" "}
                      {receipt.email ? (
                        <>
                          An official copy of this Daan receipt has been sent to{" "}
                          <b className="text-white">{receipt.email}</b>.
                        </>
                      ) : (
                        <>Your contribution has been verified by bank and recorded.</>
                      )}
                    </p>

                    <div className="my-5 rounded-2xl border-l-4 border-[#3b82f6] bg-[#1c2029] p-4 sm:p-5 text-xs sm:text-sm">
                      <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#7e8b9f]">
                        OFFICIAL CONTRIBUTION RECEIPT · TEAM RESCUEN
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between gap-2">
                          <span className="text-[#8b96a9]">Receipt ID:</span>
                          <span className="font-mono font-bold text-white">{receipt.receiptId}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#8b96a9]">Supporter:</span>
                          <span className="font-bold text-white">{receipt.name}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#8b96a9]">Amount Contributed:</span>
                          <span className="font-extrabold text-[#4ade80] text-base">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 0,
                            }).format(receipt.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#8b96a9]">Payment Gateway:</span>
                          <span className="font-semibold text-[#93c5fd]">Razorpay Official ({receipt.paymentMethod})</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#8b96a9]">Razorpay Payment ID:</span>
                          <span className="font-mono font-semibold text-white">
                            {receipt.transactionId}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#8b96a9]">Date &amp; Time:</span>
                          <span className="text-[#d8dee9]">{receipt.timestamp}</span>
                        </div>
                      </div>
                      {receipt.message && (
                        <div className="mt-3.5 border-t border-[#2a303c] pt-3 italic text-[#e5e9f0]">
                          “{receipt.message}”
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border border-[#e67e22]/45 bg-[#e67e22]/10 p-3.5 text-xs leading-relaxed text-[#f39c12]">
                      ⚠️ If you are in immediate danger, use the SOS button in the RESCUEN app or
                      call your local emergency number right now — please don’t wait for this email.
                    </div>

                    <div className="mt-5 flex items-center justify-between text-xs text-[#b8c1d1]">
                      <div>
                        Stay safe,
                        <div className="font-bold text-white text-sm">Team RESCUEN</div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#4ade80]">
                        <MailCheck className="h-3.5 w-3.5" />
                        {receipt.email
                          ? receipt.emailDelivered
                            ? `Receipt Emailed to ${receipt.email}`
                            : "Verified & Recorded"
                          : "Gupt Daan / Bank Verified"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#082347] px-6 py-3.5 text-center text-[11px] text-[#8fa6c9]">
                    RESCUEN — Women’s safety, reimagined. · Official Citizen Support Receipt
                  </div>
                </div>

                {/* Post-Receipt Actions */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button onClick={handlePrintReceipt} type="button" className="btn-primary">
                    <Download className="h-4 w-4" />
                    Save / Print Receipt
                  </button>
                  <button
                    onClick={() => {
                      setReceipt(null);
                    }}
                    type="button"
                    className="btn-ghost"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Make Another Contribution
                  </button>
                </div>
              </motion.div>
            ) : (
              /* STATE 2: 1-CLICK OFFICIAL RAZORPAY DONATION FORM */
              <motion.form
                key="donate-form-view"
                onSubmit={initiateRazorpayPayment}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/95 p-6 sm:p-9 shadow-lift backdrop-blur-2xl ring-1 ring-brand-900/5"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="chip border-gold-300/60 bg-gold-100/70 text-gold-600">
                    <HeartHandshake className="h-4 w-4 text-gold-600" />
                    Team RESCUEN · Official Daan Portal
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-safe-600">
                    <Lock className="h-3.5 w-3.5" /> Razorpay 256-Bit SSL
                  </span>
                </div>

                <h2 className="h-display mt-4 text-2xl sm:text-3xl text-ink">
                  Support <span className="text-gradient-brand">Team RESCUEN</span> via Razorpay
                </h2>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Choose any amount from <b>₹1 to ₹1,00,000</b>. Official Razorpay checkout supports{" "}
                  <b>UPI, QR, Cards, and NetBanking</b> with instant automated verification.
                </p>

                {/* 1. Preset Amount Chips */}
                <div className="mt-6">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft">
                    1. Select or Type Contribution Amount (₹1 – ₹1,00,000)
                  </label>
                  <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                    {PRESET_AMOUNTS.map((item) => {
                      const active = amount === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => handlePresetClick(item.value)}
                          className={`relative flex flex-col items-center justify-center rounded-2xl border px-2 py-3 text-center transition-all ${
                            active
                              ? "border-brand bg-brand-gradient text-white shadow-glow"
                              : "border-line bg-paper/90 text-ink hover:border-brand/40 hover:bg-white"
                          }`}
                        >
                          <span className="font-display text-base font-extrabold">
                            ₹{item.value.toLocaleString("en-IN")}
                          </span>
                          <span
                            className={`mt-0.5 text-[10px] font-semibold ${
                              active ? "text-brand-100" : "text-ink-faint"
                            }`}
                          >
                            {item.tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Rupee Input */}
                  <div className="relative mt-3.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 font-display text-xl font-extrabold text-brand">
                      ₹
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customAmountStr}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="Enter any amount (1 to 100000)"
                      aria-label="Custom contribution amount in INR"
                      className="w-full rounded-2xl border border-line bg-paper pl-10 pr-28 py-3.5 font-display text-lg font-extrabold text-ink transition-all focus:border-brand focus:bg-white"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-bold text-ink-faint">
                      INR · Max ₹1L
                    </span>
                  </div>
                </div>

                {/* 2. Payment Method Preference */}
                <div className="mt-6">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft">
                    2. Preferred Razorpay Payment Instrument
                  </label>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {PAYMENT_METHODS.map((pm) => {
                      const Icon = pm.icon;
                      const selected = method === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setMethod(pm.id)}
                          className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                            selected
                              ? "border-brand bg-brand-50/80 shadow-soft ring-1 ring-brand"
                              : "border-line bg-paper/70 hover:border-brand/30 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`grid h-10 w-10 place-items-center rounded-xl ${
                                selected
                                  ? "bg-brand text-white"
                                  : "bg-white text-ink-soft border border-line"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            <div>
                              <div className="text-sm font-bold text-ink">{pm.title}</div>
                              <div className="text-[11px] text-ink-faint">{pm.subtitle}</div>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                              selected
                                ? "bg-brand text-white"
                                : "bg-white text-ink-faint border border-line"
                            }`}
                          >
                            {pm.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. OPTIONAL Donor Name & Email for Official Email Receipt */}
                <div className="mt-6 rounded-3xl border border-line bg-paper/70 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-ink">
                      3. Official Daan Receipt on Email (100% Optional)
                    </span>
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-bold text-brand">
                      Optional
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-faint">
                    Agar aapko <b>RESCUEN Support</b> se official receipt email par chahiye toh Name
                    aur Email daalein, warna khali chhod kar seedha pay karein:
                  </p>

                  <div className="mt-3 grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <input
                        id="donor-name"
                        type="text"
                        maxLength={80}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name (Optional)"
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-faint focus:border-brand"
                      />
                    </div>
                    <div>
                      <input
                        id="donor-email"
                        type="email"
                        maxLength={120}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email for Receipt (Optional)"
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-faint focus:border-brand"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <input
                      id="donor-message"
                      type="text"
                      maxLength={250}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Blessing or Message for Team RESCUEN (Optional) 🙏"
                      className="w-full rounded-2xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand"
                    />
                  </div>
                </div>

                {/* Hidden Honeypot against Bots */}
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Status / Loading Notification */}
                {statusText && (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-xs font-semibold text-brand">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                    <span>{statusText}</span>
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-sos-200 bg-sos-50 px-4 py-3 text-xs font-semibold text-sos-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Primary Submit CTA — Launches Official Razorpay Modal */}
                <button
                  type="submit"
                  disabled={loading || !amount || amount < 1}
                  className="btn-primary mt-6 w-full py-4 text-base font-extrabold shadow-glow disabled:opacity-50"
                >
                  {loading ? (
                    "Opening Razorpay Secure Gateway..."
                  ) : (
                    <>
                      <HeartHandshake className="h-5 w-5" />
                      Pay {formattedAmount} via Razorpay
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-ink-soft">
                  <ShieldCheck className="h-4 w-4 text-brand" />
                  <span>
                    Official Razorpay Checkout · Instant QR &amp; UPI · 256-Bit Bank Encryption
                  </span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
