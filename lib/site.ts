// ─────────────────────────────────────────────────────────────
// RESCUEN — central site content. Everything the site shows comes
// from here, and it mirrors the real RESCUEN app. Edit freely.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: "RESCUEN",
  // Not a registered company — built by an independent developer.
  legalName: "Bapan Ghosh (RESCUEN)",
  owner: "Bapan Ghosh",
  ownerTitle: "Freelancer / Student Developer",
  tagline: "The Ultimate Personal Safety Companion",
  description:
    "RESCUEN is a community-driven personal-safety app. One 2-second hold turns your phone into an emergency broadcaster — a live 1 KM rescue radar, silent SMS to family & police, a community 'Hero Mode', and a multilingual AI safety assistant.",
  appStoreUrl:
    process.env.NEXT_PUBLIC_APP_STORE_URL ||
    "https://play.google.com/store/apps/details?id=com.officialrescuen.app",
  packageId: "com.officialrescuen.app",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "rescuensupport@gmail.com",
  // Real RESCUEN channels (from the app)
  instagram: "https://www.instagram.com/hello.officialrescuen",
  whatsapp: "https://whatsapp.com/channel/0029Vb7ZOwYJ93wNB8znbq3M",
  developerUrl: "https://bapanghosh.netlify.app/",
  officialPolicyUrl: "https://sites.google.com/view/rescuen-app-policy/home",
  // Address — independent developer, not a registered company.
  address: "Durgapur, West Bengal – 713212, India",
  foundedYear: 2025,
} as const;

export type NavItem = { label: string; href: string };

export const NAV: NavItem[] = [
  { label: "Home", href: "/#home" },
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how" },
  { label: "Security", href: "/#security" },
  { label: "Contact", href: "/#contact" },
];

// Links inside the “⋮” (3-dot) menu — the app lives here.
export const MENU_LINKS: NavItem[] = [
  { label: "Download the App", href: SITE.appStoreUrl },
  { label: "About RESCUEN", href: "/about" },
  { label: "Trust & Security Centre", href: "/security" },
  { label: "Help & Support", href: "/#contact" },
  { label: "Terms & Conditions", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
];

export type Feature = {
  icon: string; // lucide-react icon name
  title: string;
  desc: string;
  accent: "brand" | "sos" | "safe" | "ink";
};

export const FEATURES: Feature[] = [
  {
    icon: "ShieldAlert",
    title: "Instant SOS",
    desc: "Hold the panic button for 2 seconds — or triple-press the volume key, even from a locked screen — to fire the full alert chain.",
    accent: "sos",
  },
  {
    icon: "Radar",
    title: "1 KM Live Radar",
    desc: "A geohash radar instantly alerts every nearby RESCUEN user within 1 kilometre with a loud, unignorable siren.",
    accent: "brand",
  },
  {
    icon: "Send",
    title: "Silent SMS Broadcast",
    desc: "Sends a silent SMS with your live Google Maps link to up to 5 family contacts and the Police (100/112) — even when the screen is locked.",
    accent: "brand",
  },
  {
    icon: "Users",
    title: "Hero Mode — Community Rescue",
    desc: "Nearby ‘heroes’ see your exact distance and ETA, tap ‘I’m going to help’, and get live blue-line navigation straight to you.",
    accent: "safe",
  },
  {
    icon: "Route",
    title: "Follow-Me (Dead-man’s Switch)",
    desc: "Monitors your journey; if you stop unexpectedly it asks “Are you safe?” and auto-triggers SOS if you don’t respond.",
    accent: "brand",
  },
  {
    icon: "Video",
    title: "Secure Evidence Vault",
    desc: "On SOS it records black-box audio and AI-detected photo frames to write-only storage — court-usable, and never readable from the device.",
    accent: "ink",
  },
  {
    icon: "Bot",
    title: "RESCUEN AI Assistant",
    desc: "A Gemini-powered, multilingual assistant that can trigger SOS, start Follow-Me, and give calm, real-time safety guidance.",
    accent: "brand",
  },
  {
    icon: "Radio",
    title: "Background Safety Shield",
    desc: "Keeps broadcasting your live GPS coordinates even if the app is closed or the screen is off — protection never sleeps.",
    accent: "ink",
  },
  {
    icon: "Fingerprint",
    title: "OTP-Verified Community",
    desc: "Google Sign-In + phone-number OTP, with a 60-day change-lock on emergency numbers to keep the helper network genuine.",
    accent: "brand",
  },
  {
    icon: "PhoneCall",
    title: "One-Tap Helplines",
    desc: "Reach 112 (emergency), 100 (police), 1091 (women) and 108 (ambulance) directly from a single screen.",
    accent: "sos",
  },
  {
    icon: "HeartPulse",
    title: "Wellness & Safety Hub",
    desc: "A curated Health tab — women-safety tips, self-defense, yoga, fitness, healthy living and mental-health guides to stay safe, strong and calm.",
    accent: "safe",
  },
  {
    icon: "BatteryCharging",
    title: "Battery-Smart",
    desc: "Highly optimised to run silently in the background all day without draining your phone.",
    accent: "ink",
  },
  {
    icon: "PhoneOutgoing",
    title: "Fake Call Escape",
    desc: "Trigger a realistic fake incoming call to slip out of an uncomfortable or unsafe moment — gracefully and instantly.",
    accent: "sos",
  },
  {
    icon: "Languages",
    title: "6 Indian Languages",
    desc: "English, हिंदी, বাংলা, मराठी, தமிழ் and తెలుగు — RESCUEN speaks your language, 24×7.",
    accent: "safe",
  },
  {
    icon: "Lock",
    title: "Privacy-First by Design",
    desc: "Your location is never used for ads or marketing, and a 30-day soft-delete gives you full control of your data.",
    accent: "brand",
  },
];

export const STATS = [
  { value: "1 KM", label: "Live rescue radar" },
  { value: "2 sec", label: "To trigger SOS" },
  { value: "6", label: "Indian languages" },
  { value: "24×7", label: "AI + community" },
];

export const HOW_STEPS = [
  {
    step: "01",
    title: "Verify with your phone",
    desc: "Sign in with Google or your phone number + a one-time OTP — no password to remember. Verified securely by Firebase.",
    icon: "Smartphone",
  },
  {
    step: "02",
    title: "Add your trusted circle",
    desc: "Add up to 5 family contacts once. Emergency numbers are change-locked for 60 days to prevent tampering.",
    icon: "Users",
  },
  {
    step: "03",
    title: "Stay protected everywhere",
    desc: "SOS, the 1 KM radar, Follow-Me and the AI companion run quietly in the background — ready the instant you need them.",
    icon: "ShieldCheck",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "The silent SOS reached my brother with my exact location before I could even explain. RESCUEN genuinely feels like a bodyguard in my pocket.",
    name: "Ananya R.",
    role: "Student, West Bengal",
  },
  {
    quote:
      "As a night-shift nurse, Follow-Me and the check-ins give my family real peace of mind. Simple, fast and reassuring.",
    name: "Priya M.",
    role: "Healthcare worker",
  },
  {
    quote:
      "Hero Mode is brilliant — I got an alert for someone 300 m away and could actually help. No other app builds a real community like this.",
    name: "Rohan S.",
    role: "RESCUEN Hero",
  },
];

export const FAQS = [
  {
    q: "Is RESCUEN free to use?",
    a: "Yes — the core safety features (SOS, 1 KM radar, family & police alerts, Hero Mode and the AI assistant) are free. RESCUEN is community-driven; there are no hidden charges.",
  },
  {
    q: "What permissions does the app need, and why?",
    a: "To act as a life-saving tool the app needs Location (all-the-time, so background SOS and the radar work), SMS (to text your family and the police), and Notifications. Your location is never used for ads — it’s shared only with your trusted contacts and nearby rescuers, and only when you trigger SOS.",
  },
  {
    q: "How is my data protected?",
    a: "Data is encrypted in transit (TLS) and at rest. Sign-in uses Google Firebase; sensitive operations run only on secured backend servers with strict security rules, Firebase App Check, server-side proximity filtering and a write-only evidence vault. (We intentionally do not claim end-to-end encryption.)",
  },
  {
    q: "Does SOS work when my screen is locked or the app is closed?",
    a: "Yes. A background safety shield keeps broadcasting your GPS, and critical alerts fall back to silent SMS so your circle is notified even on a weak connection.",
  },
  {
    q: "Which languages does RESCUEN support?",
    a: "Six Indian languages: English, हिंदी (Hindi), বাংলা (Bengali), मराठी (Marathi), தமிழ் (Tamil) and తెలుగు (Telugu).",
  },
  {
    q: "Is this website the app?",
    a: "No — this is RESCUEN’s official website. The full safety app runs on Android. Use the Download button (or the ⋮ menu) to install it from Google Play.",
  },
  {
    q: "How do I delete my account and data?",
    a: "From the app you can request deletion anytime — it uses a 30-day soft-delete grace period, after which your data is permanently removed. You can also contact support.",
  },
];

export const FOOTER_GROUPS: { title: string; links: NavItem[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it Works", href: "/#how" },
      { label: "Download on Android", href: SITE.appStoreUrl },
      { label: "Trust & Security", href: "/security" },
      { label: "AI Assistant", href: "/#ai" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About RESCUEN", href: "/about" },
      { label: "Contact", href: "/#contact" },
      { label: "Developer", href: SITE.developerUrl },
      { label: "Press & Media", href: "/about#press" },
      { label: "Blog", href: "/about#blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Disclaimer", href: "/legal/disclaimer" },
      { label: "Refund Policy", href: "/legal/refund" },
      { label: "Cookie Policy", href: "/legal/cookies" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Centre", href: "/#contact" },
      { label: "Report an Issue", href: "/#contact" },
      { label: "Emergency Numbers", href: "/security#emergency" },
      { label: "WhatsApp Channel", href: SITE.whatsapp },
      { label: "Instagram", href: SITE.instagram },
    ],
  },
];
