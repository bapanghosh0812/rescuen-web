"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Smartphone,
  QrCode,
  CreditCard,
  Wallet,
  Building2,
  Lock,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Copy,
  Check,
  Download,
  RefreshCw,
  MailCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import NamasteIllustration from "@/components/NamasteIllustration";
import { SITE } from "@/lib/site";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (res: unknown) => void) => void;
    };
  }
}

type PaymentMethod = "upi" | "qr" | "card" | "wallet" | "netbanking";

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
    title: "UPI Instant App",
    subtitle: "GPay, PhonePe, Paytm, BHIM",
    badge: "1-Click Pay",
    icon: Smartphone,
  },
  {
    id: "qr",
    title: "Dynamic QR Code",
    subtitle: "Auto-generates QR of your exact ₹ amount",
    badge: "Scan & Pay",
    icon: QrCode,
  },
  {
    id: "card",
    title: "Debit / Credit Card",
    subtitle: "RuPay, Visa, Mastercard",
    badge: "256-Bit Encrypted",
    icon: CreditCard,
  },
  {
    id: "wallet",
    title: "Mobile Wallets",
    subtitle: "Amazon Pay, Paytm, Mobikwik",
    badge: "One-Tap",
    icon: Wallet,
  },
  {
    id: "netbanking",
    title: "NetBanking",
    subtitle: "SBI, HDFC, ICICI, Axis & All Banks",
    badge: "Direct Bank",
    icon: Building2,
  },
];

const PUBLIC_UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "bapanghosh081204@oksbi";
const PUBLIC_RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
const RAZORPAY_ME_URL =
  process.env.NEXT_PUBLIC_RAZORPAY_ME_URL || "https://razorpay.me/@bapanghosh8243";

export default function DonationPortal({ compact = false }: { compact?: boolean }) {
  const [amount, setAmount] = useState<number>(101);
  const [customAmountStr, setCustomAmountStr] = useState<string>("101");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [company, setCompany] = useState<string>(""); // Honeypot
  const [method, setMethod] = useState<PaymentMethod>("upi");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Direct UPI / Dynamic QR / Razorpay.me fallback session state
  const [upiSession, setUpiSession] = useState<{
    upiId: string;
    payeeName: string;
    orderRef: string;
    orderToken: string;
    upiUri: string;
    isQrSelected: boolean;
  } | null>(null);
  const [utrInput, setUtrInput] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Completed Receipt State
  const [receipt, setReceipt] = useState<VerifiedReceipt | null>(null);

  // Load Razorpay Standard Checkout SDK (<script src="https://checkout.razorpay.com/v1/checkout.js">)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("razorpay-checkout-sdk")) return;
    const script = document.createElement("script");
    script.id = "razorpay-checkout-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

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

  // Live NPCI UPI URI locked to the exact user-typed amount (₹1 to ₹1,00,000)
  const liveDynamicUpiUri = `upi://pay?pa=${encodeURIComponent(
    PUBLIC_UPI_ID
  )}&pn=${encodeURIComponent("Team RESCUEN")}&am=${encodeURIComponent(
    (amount || 1).toFixed(2)
  )}&cu=INR&tn=${encodeURIComponent("Team RESCUEN Mission Daan")}`;

  const liveDynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&color=0a2540&bgcolor=ffffff&data=${encodeURIComponent(
    liveDynamicUpiUri
  )}`;

  function openFallbackSession(data: {
    upiId?: string;
    payeeName?: string;
    orderRef: string;
    orderToken: string;
  }) {
    const upiUri = `upi://pay?pa=${encodeURIComponent(
      data.upiId || PUBLIC_UPI_ID
    )}&pn=${encodeURIComponent("Team RESCUEN")}&am=${encodeURIComponent(
      (amount || 101).toFixed(2)
    )}&cu=INR&tn=${encodeURIComponent(`RESCUEN Mission Daan ${data.orderRef}`)}`;

    setUpiSession({
      upiId: data.upiId || PUBLIC_UPI_ID,
      payeeName: data.payeeName || "Team RESCUEN",
      orderRef: data.orderRef,
      orderToken: data.orderToken,
      upiUri,
      isQrSelected: method === "qr",
    });
  }

  // Direct 1-Click Razorpay.me Official Link Handler (with Receipt Verification session!)
  async function handleRazorpayMeDirectClick() {
    window.open(RAZORPAY_ME_URL, "_blank", "noopener,noreferrer");

    // If user filled Name & Email, prepare a verification session so they can claim their official email receipt right after paying!
    if (name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && amount >= 1) {
      try {
        const res = await fetch("/api/donate/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            amount,
            method,
            message: message.trim() || undefined,
            company,
          }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          openFallbackSession(data);
        }
      } catch {
        // Ignore network error; Razorpay.me tab is already open
      }
    }
  }

  async function initiateContribution(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError("Kripya apna shubh naam darj karein (Please enter your name).");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Kripya sahi email address dein taaki Team RESCUEN aapko Daan Receipt bhej sake.");
      return;
    }
    if (!amount || amount < 1 || amount > 100000) {
      setError("Daan rashi ₹1 se ₹1,00,000 ke beech honi chahiye.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/donate/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          amount,
          method,
          message: message.trim() || undefined,
          company,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(
          data.error ||
            "Standard gateway busy — you can pay directly via our official Razorpay.me link below!"
        );
        setLoading(false);
        return;
      }

      // If user scanned the inline Dynamic QR and already entered their 12-digit UTR, verify immediately
      if (method === "qr" && utrInput.trim().length >= 8) {
        await verifyDirectUpi({
          orderToken: data.orderToken,
          paymentMethod: "qr",
          upiTransactionId: utrInput.trim(),
        });
        return;
      }

      // PRIMARY: Open Razorpay Standard Web Checkout Modal
      const rzpOrderId = data.order_id || data.razorpayOrderId;
      const rzpKey = PUBLIC_RAZORPAY_KEY_ID || data.keyId;

      if (data.mode === "razorpay" && rzpOrderId && rzpKey && window.Razorpay) {
        const preferredInstrument = method === "qr" ? "upi" : method;

        const rzpOptions: Record<string, unknown> = {
          key: rzpKey,
          amount: data.amount, // amount in paise from backend
          currency: data.currency || "INR",
          name: "Team RESCUEN",
          description: `Surakshit Bharat Daan (${formattedAmount})`,
          image: "/rescuen-logo.png",
          order_id: rzpOrderId,
          prefill: {
            name: name.trim(),
            email: email.trim(),
          },
          config: {
            display: {
              blocks: {
                highlighted: {
                  name:
                    method === "qr"
                      ? "Scan Dynamic UPI QR or Pay via UPI"
                      : "Preferred Payment Method",
                  instruments: [{ method: preferredInstrument }],
                },
              },
              sequence: ["block.highlighted", "upi", "card", "wallet", "netbanking"],
              preferences: { show_default_blocks: true },
            },
          },
          theme: {
            color: "#004aad",
            backdrop_color: "rgba(10, 37, 64, 0.78)",
          },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            await verifyRazorpayPayment({
              orderToken: data.orderToken,
              paymentMethod: method,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              // Automatically open the Direct QR / Razorpay.me fallback card so the user can still complete payment seamlessly!
              openFallbackSession(data);
            },
          },
        };

        const rzp = new window.Razorpay(rzpOptions);
        rzp.on("payment.failed", (failEvent: unknown) => {
          const errDesc =
            typeof failEvent === "object" &&
            failEvent !== null &&
            "error" in failEvent &&
            typeof (failEvent as { error?: { description?: string } }).error?.description ===
              "string"
              ? (failEvent as { error: { description: string } }).error.description
              : "Payment failed in modal — use our direct QR or official Razorpay.me link below!";
          setError(errDesc);
          setLoading(false);
          openFallbackSession(data);
        });
        rzp.open();
        return;
      }

      // FALLBACK: Direct UPI App Intent, Dynamic QR & Razorpay.me Screen
      openFallbackSession(data);

      if (
        method === "upi" &&
        typeof window !== "undefined" &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      ) {
        const upiUri = `upi://pay?pa=${encodeURIComponent(
          data.upiId || PUBLIC_UPI_ID
        )}&pn=${encodeURIComponent("Team RESCUEN")}&am=${encodeURIComponent(
          amount.toFixed(2)
        )}&cu=INR&tn=${encodeURIComponent(`RESCUEN Mission Daan ${data.orderRef}`)}`;
        window.location.href = upiUri;
      }
      setLoading(false);
    } catch {
      setError(
        "Could not reach checkout server — click the official Razorpay.me direct button below to complete your contribution!"
      );
      setLoading(false);
    }
  }

  // Step 3: Verify Razorpay signature via POST /api/verify-payment
  async function verifyRazorpayPayment(payload: {
    orderToken: string;
    paymentMethod: PaymentMethod;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
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
          paymentMethod: payload.paymentMethod === "qr" ? "UPI DYNAMIC QR" : payload.paymentMethod,
          name: name.trim(),
          email: email.trim(),
          amount,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Payment signature verification failed.");
        setLoading(false);
        return;
      }
      setReceipt(data.receipt);
      setUpiSession(null);
      setLoading(false);
    } catch {
      setError("Verification request failed. Please check your internet connection.");
      setLoading(false);
    }
  }

  // Verify Direct UPI / Dynamic QR / Razorpay.me UTR via POST /api/donate/verify
  async function verifyDirectUpi(payload: {
    orderToken: string;
    paymentMethod: PaymentMethod;
    upiTransactionId: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/donate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderToken: payload.orderToken,
          mode: "upi_direct",
          paymentMethod: payload.paymentMethod,
          upiTransactionId: payload.upiTransactionId,
          message: message.trim() || undefined,
          company,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Could not verify transaction. Please check your Reference ID.");
        setLoading(false);
        return;
      }
      setReceipt(data.receipt);
      setUpiSession(null);
      setLoading(false);
    } catch {
      setError("Verification request failed. Please check your internet connection.");
      setLoading(false);
    }
  }

  function handleCopyUpi(upi: string) {
    navigator.clipboard.writeText(upi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  }

  function handlePrintReceipt() {
    if (typeof window !== "undefined") window.print();
  }

  return (
    <div className="relative">
      {/* Decorative Luxury Glass Orbs */}
      <div className="pointer-events-none absolute -top-20 -left-20 -z-10 h-80 w-80 rounded-full bg-brand-200/45 blur-3xl animate-aurora" />
      <div className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-96 w-96 rounded-full bg-gold-200/45 blur-3xl animate-aurora [animation-delay:-5s]" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 -z-10 h-72 w-72 rounded-full bg-safe-200/35 blur-3xl animate-aurora [animation-delay:-9s]" />

      <div className={`grid items-start gap-10 lg:grid-cols-12 ${compact ? "" : "pt-4"}`}>
        {/* ───────── LEFT COLUMN: NAMASTE ILLUSTRATION & MISSION TRUST ───────── */}
        <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-28">
          <div className="w-full rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 via-brand-50/50 to-gold-100/35 p-6 sm:p-8 shadow-lift backdrop-blur-2xl ring-1 ring-brand-900/5">
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
                <div className="font-display text-lg font-extrabold text-gold-600">Instant</div>
                <div className="text-[11px] font-semibold text-ink-faint">Email Receipt</div>
              </div>
            </div>

            {/* Security Guarantee Badge */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 px-4 py-3 text-xs text-ink-soft">
              <ShieldCheck className="h-5 w-5 shrink-0 text-brand" />
              <span>
                <b>Razorpay &amp; Bank-Grade Security:</b> Cryptographic HMAC-SHA256 verification.
                Team RESCUEN never stores your card number or UPI PIN.
              </span>
            </div>
          </div>
        </div>

        {/* ───────── RIGHT COLUMN: ULTRA-LUXURY GLASSY PAYMENT CARD ───────── */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {/* STATE 1: COMPLETED RECEIPT & CELEBRATION GREETING */}
            {receipt ? (
              <motion.div
                key="receipt-view"
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="overflow-hidden rounded-[2.2rem] border border-gold-300/70 bg-white p-6 sm:p-9 shadow-lift ring-1 ring-gold-400/20"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
                    className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-safe-gradient text-white shadow-lg"
                  >
                    <CheckCircle2 className="h-9 w-9" />
                  </motion.div>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-gold-600">
                    🙏 Koti-Koti Dhanyavaad · Official Daan Receipt
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

                {/* Exact Dark-Mode RESCUEN Support Frame Preview (Matches Screenshot!) */}
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
                      Thank you for supporting <b className="text-white">Team RESCUEN</b>. An
                      official copy of this Daan receipt has been sent to{" "}
                      <b className="text-white">{receipt.email}</b>.
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
                          <span className="text-[#8b96a9]">Payment Method:</span>
                          <span className="font-semibold text-[#93c5fd]">{receipt.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#8b96a9]">Reference / Payment ID:</span>
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
                        {receipt.emailDelivered ? "Receipt Emailed" : "Verified & Recorded"}
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
                      setUtrInput("");
                    }}
                    type="button"
                    className="btn-ghost"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Make Another Contribution
                  </button>
                </div>
              </motion.div>
            ) : upiSession ? (
              /* STATE 2: DYNAMIC QR CODE, DIRECT UPI & RAZORPAY.ME FALLBACK SCREEN */
              <motion.div
                key="upi-session-view"
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/95 p-6 sm:p-9 shadow-lift backdrop-blur-2xl ring-1 ring-brand-900/5"
              >
                <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <span className="chip text-brand">
                      <QrCode className="h-3.5 w-3.5" /> Instant QR, UPI &amp; Razorpay.me
                    </span>
                    <h3 className="h-display mt-2 text-2xl text-ink">
                      Complete {formattedAmount} for Team RESCUEN
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUpiSession(null)}
                    className="rounded-xl border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-mist"
                  >
                    ← Back to Form
                  </button>
                </div>

                {/* Big Dynamic Amount-Locked QR Card */}
                <div className="mt-6 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/90 via-white to-gold-100/40 p-6 text-center shadow-soft">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1 text-xs font-extrabold text-white">
                    <QrCode className="h-3.5 w-3.5" /> Dynamic QR Locked for {formattedAmount}
                  </span>
                  <p className="mt-2 text-xs sm:text-sm text-ink-soft">
                    Scan this QR with <b>Google Pay, PhonePe, Paytm, BHIM, or any Bank App</b> — or
                    use our direct <b>Razorpay.me</b> link below!
                  </p>

                  {/* Branded QR Frame */}
                  <div className="mx-auto mt-5 flex max-w-[230px] flex-col items-center rounded-3xl border-2 border-brand/20 bg-white p-4 shadow-card">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-extrabold text-ink">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/rescuen-logo.png" alt="RESCUEN" className="h-4 w-4" />
                      TEAM RESCUEN · {formattedAmount}
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&color=0a2540&bgcolor=ffffff&data=${encodeURIComponent(
                        upiSession.upiUri
                      )}`}
                      alt={`Dynamic UPI QR Code for ${formattedAmount}`}
                      width={190}
                      height={190}
                      className="h-44 w-44 rounded-xl"
                    />
                    <div className="mt-2 text-[11px] font-bold text-safe-600">
                      ✓ Verified NPCI UPI Dynamic QR
                    </div>
                  </div>

                  {/* Direct App Open + Razorpay.me Link Buttons */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                    <a
                      href={upiSession.upiUri}
                      className="btn-primary px-4 py-3 text-xs sm:text-sm shadow-glow"
                    >
                      <Smartphone className="h-4 w-4" />
                      Open UPI App ({formattedAmount})
                    </a>
                    <a
                      href={RAZORPAY_ME_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold px-4 py-3 text-xs sm:text-sm font-extrabold"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Pay via razorpay.me/@bapanghosh8243
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyUpi(upiSession.upiId)}
                      className="btn-ghost px-3.5 py-2.5 text-xs"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-safe-600" /> Copied UPI ID
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy UPI: {upiSession.upiId}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 2: Enter 12-Digit UTR / Reference No for Instant Greeting & Email Receipt */}
                <div className="mt-6 rounded-3xl border border-line bg-paper p-5">
                  <label
                    htmlFor="utr-input"
                    className="block text-xs font-bold uppercase tracking-wider text-ink"
                  >
                    Verify Payment · Enter UPI UTR or Razorpay Payment ID
                  </label>
                  <p className="mt-1 text-xs text-ink-faint">
                    QR ya <b>razorpay.me</b> se payment complete hote hi apna{" "}
                    <b>12-digit UTR / Payment ID</b> yahan daal kar Verify dabayein — turant
                    celebration greeting khulegi aur <b>{email}</b> par official receipt email chali
                    jayegi!
                  </p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      id="utr-input"
                      type="text"
                      value={utrInput}
                      onChange={(e) => setUtrInput(e.target.value)}
                      placeholder="e.g. 431018294812 or pay_Pxyz12345"
                      maxLength={32}
                      className="flex-1 rounded-2xl border border-line bg-white px-4 py-3.5 font-mono text-sm font-bold text-ink placeholder:font-sans placeholder:font-normal placeholder:text-ink-faint focus:border-brand"
                    />
                    <button
                      type="button"
                      disabled={loading || utrInput.trim().length < 8}
                      onClick={() =>
                        verifyDirectUpi({
                          orderToken: upiSession.orderToken,
                          paymentMethod: method,
                          upiTransactionId: utrInput.trim(),
                        })
                      }
                      className="btn-gold whitespace-nowrap px-6 py-3.5 text-sm font-extrabold disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify & Get Greeting 🙏"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-sos-200 bg-sos-50 px-4 py-3 text-xs font-semibold text-sos-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </motion.div>
            ) : (
              /* STATE 3: MAIN 2-3 CLICK LUXURY DONATION FORM */
              <motion.form
                key="donate-form-view"
                onSubmit={initiateContribution}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/90 p-6 sm:p-9 shadow-lift backdrop-blur-2xl ring-1 ring-brand-900/5"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="chip border-gold-300/60 bg-gold-100/70 text-gold-600">
                    <HeartHandshake className="h-4 w-4 text-gold-600" />
                    Team RESCUEN · Support &amp; Daan Portal
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-safe-600">
                    <Lock className="h-3.5 w-3.5" /> Razorpay 256-Bit SSL
                  </span>
                </div>

                <h2 className="h-display mt-4 text-2xl sm:text-3xl text-ink">
                  Support <span className="text-gradient-brand">Team RESCUEN</span> in 2 Clicks
                </h2>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Choose any amount from <b>₹1 to ₹1,00,000</b>. Pay via <b>Dynamic QR</b>,{" "}
                  <b>UPI App</b>, <b>Card</b>, or <b>Wallet</b> with instant greeting &amp; email
                  receipt.
                </p>

                {/* 1. Preset Amount Chips with Glassy Spring Touch */}
                <div className="mt-6">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft">
                    1. Select or Type Contribution Amount (₹1 – ₹1,00,000)
                  </label>
                  <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                    {PRESET_AMOUNTS.map((item) => {
                      const active = amount === item.value;
                      return (
                        <motion.button
                          key={item.value}
                          type="button"
                          whileHover={{ y: -3, scale: 1.03 }}
                          whileTap={{ scale: 0.94 }}
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
                        </motion.button>
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

                {/* 2. Donor Name & Email for Instant Receipt */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="donor-name"
                      className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft"
                    >
                      Your Name *
                    </label>
                    <input
                      id="donor-name"
                      type="text"
                      required
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-faint focus:border-brand focus:bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="donor-email"
                      className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft"
                    >
                      Email Address (For Official Receipt) *
                    </label>
                    <input
                      id="donor-email"
                      type="email"
                      required
                      maxLength={120}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-faint focus:border-brand focus:bg-white"
                    />
                  </div>
                </div>

                {/* Optional Blessing / Message */}
                <div className="mt-4">
                  <label
                    htmlFor="donor-message"
                    className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft"
                  >
                    Blessing or Message for Team RESCUEN (Optional)
                  </label>
                  <input
                    id="donor-message"
                    type="text"
                    maxLength={250}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Proud to support Team RESCUEN's women & citizen safety mission! 🙏"
                    className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:bg-white"
                  />
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

                {/* 3. Payment Method Selection (Includes Dynamic QR Option!) */}
                <div className="mt-6">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft">
                    2. Choose Payment Option (UPI App, Dynamic QR, Card, Wallet)
                  </label>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {PAYMENT_METHODS.map((pm) => {
                      const Icon = pm.icon;
                      const selected = method === pm.id;
                      return (
                        <motion.button
                          key={pm.id}
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
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
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* LIVE DYNAMIC QR CODE PANEL (Appears immediately when user selects "Dynamic QR Code") */}
                <AnimatePresence>
                  {method === "qr" && amount >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-3xl border-2 border-brand/25 bg-gradient-to-br from-brand-50/90 via-white to-gold-100/50 p-5 shadow-soft">
                        <div className="flex flex-col items-center gap-5 sm:flex-row">
                          {/* Live Auto-Generated QR for Typed Amount */}
                          <div className="flex shrink-0 flex-col items-center rounded-2xl border border-line bg-white p-3 shadow-card">
                            <span className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-brand">
                              Live QR · {formattedAmount}
                            </span>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              key={amount}
                              src={liveDynamicQrUrl}
                              alt={`Dynamic QR Code for ${formattedAmount}`}
                              width={150}
                              height={150}
                              className="h-36 w-36 rounded-lg"
                            />
                            <span className="mt-1.5 text-[10px] font-semibold text-safe-600">
                              ✓ Amount Auto-Locked
                            </span>
                          </div>

                          {/* Instructions + Instant UTR Verification or Razorpay 1-Click QR */}
                          <div className="flex-1 text-left">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-0.5 text-[11px] font-extrabold text-gold-600">
                              <QrCode className="h-3.5 w-3.5" /> Instant Scan &amp; Verify
                            </div>
                            <h4 className="mt-2 text-base font-extrabold text-ink">
                              Scan to Pay Exact <span className="text-brand">{formattedAmount}</span>
                            </h4>
                            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                              Yeh QR aapke type kiye hue <b>{formattedAmount}</b> ke liye real-time
                              generate hua hai. Aap neeche button dabakar{" "}
                              <b>Razorpay 1-Click Checkout</b> khol sakte hain, ya seedha is QR ko
                              scan karke 12-digit UTR daal sakte hain:
                            </p>

                            <div className="mt-3">
                              <input
                                type="text"
                                value={utrInput}
                                onChange={(e) => setUtrInput(e.target.value)}
                                placeholder="Optional: Enter 12-digit UTR if scanned directly"
                                maxLength={32}
                                className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 font-mono text-xs font-bold text-ink placeholder:font-sans placeholder:font-normal placeholder:text-ink-faint focus:border-brand"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Alert */}
                {error && (
                  <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-sos-200 bg-sos-50 px-4 py-3 text-xs font-semibold text-sos-700">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* Primary Submit CTA */}
                <motion.button
                  type="submit"
                  disabled={loading || !amount || amount < 1}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary mt-6 w-full py-4 text-base font-extrabold shadow-glow disabled:opacity-50"
                >
                  {loading ? (
                    "Opening Secure Razorpay Checkout..."
                  ) : method === "qr" && utrInput.trim().length >= 8 ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Verify {formattedAmount} QR Payment &amp; Get Greeting 🙏
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="h-5 w-5" />
                      Pay {formattedAmount} to Team RESCUEN (1-Click Checkout) 🙏
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>

                {/* Instant Backup / Direct Razorpay.me Button */}
                <div className="mt-4 rounded-2xl border border-gold-300/60 bg-gold-100/45 p-3.5 text-center">
                  <div className="text-[11px] font-bold text-ink-soft">
                    Agar kisi karan se modal na khule, toh seedha official Razorpay link se Daan
                    karein:
                  </div>
                  <button
                    type="button"
                    onClick={handleRazorpayMeDirectClick}
                    className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-brand shadow-soft ring-1 ring-brand/20 transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white"
                  >
                    <span>⚡ Direct Pay via razorpay.me/@bapanghosh8243</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="mt-3 text-center text-[11px] text-ink-faint">
                  Secured by <b>Razorpay</b>. By contributing, you voluntarily support{" "}
                  <b>{SITE.name}</b>’s mission. An official automated receipt from{" "}
                  <b>RESCUEN Support</b> is emailed immediately upon verification.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
