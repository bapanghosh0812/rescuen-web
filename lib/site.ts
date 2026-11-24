// Brand facts and page copy used across the site.

// One place to change when a custom domain is connected.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://rescuen-web.netlify.app").replace(/\/+$/, "");

export const SITE = {
  name: "RESCUEN",
  legalName: "Team RESCUEN",
  owner: "Team RESCUEN",
  url: SITE_URL,
  tagline: "Your 24×7 personal safety companion",
  description:
    "Hold for 2 seconds and RESCUEN alerts people within 1 km and sends your live location to family and police. A free personal safety app made in India.",
  /** The full introduction, in our own words. */
  story:
    "We built RESCUEN, The Ultimate Safety, for the moment you hope never comes. It is a personal safety app, a women’s protection system and an anti-rape emergency alert platform in one, made with care by Team RESCUEN. Hold the button for two seconds and it switches on a 1 KM live community rescue radar, silently sends your location to your family and the police, and guides nearby heroes straight to you. It keeps audio and photo evidence in a vault that can’t be erased from your phone, and helplines like 112, 100 and 1091 stay one tap away. On ordinary days, Follow-Me watches over your journey home, and our multilingual AI safety assistant stays awake with you, 24×7.",
  appStoreUrl:
    process.env.NEXT_PUBLIC_APP_STORE_URL || "https://play.google.com/store/apps/details?id=com.officialrescuen.app",
  packageId: "com.officialrescuen.app",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "rescuensupport@gmail.com",
  instagram: "https://www.instagram.com/hello.officialrescuen",
  whatsapp: "https://whatsapp.com/channel/0029Vb7ZOwYJ93wNB8znbq3M",
  address: "Durgapur, West Bengal – 713212, India",
  foundedYear: 2025,
} as const;

export type NavItem = { label: string; href: string };

export const NAV: NavItem[] = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how" },
  { label: "AI tools", href: "/ai" },
  { label: "Guides", href: "/guides" },
  { label: "Security", href: "/security" },
];

// Links inside the menu in the header.
export const MENU_LINKS: NavItem[] = [
  { label: "Download the App", href: SITE.appStoreUrl },
  { label: "Emergency numbers", href: "/emergency-numbers" },
  { label: "About RESCUEN", href: "/about" },
  { label: "Trust & Security Centre", href: "/security" },
  { label: "Help & Support", href: "/#contact" },
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
    title: "Instant SOS Panic Button",
    desc: "Press and hold for two seconds and the whole emergency chain begins. If your phone is locked or in your pocket, press the volume key three times instead. We kept it this simple because nobody should have to search for a button when they’re scared.",
    accent: "sos",
  },
  {
    icon: "Radar",
    title: "1 KM Live Community Rescue Radar",
    desc: "Help is often closer than we think. The moment you trigger SOS, RESCUEN users within about one kilometre hear a loud siren and see where you are, how far away you are, and how to reach you.",
    accent: "brand",
  },
  {
    icon: "Send",
    title: "Silent SOS & SMS Alerts",
    desc: "While your screen stays quiet, RESCUEN texts your live Google Maps location to up to five people you trust and to the police. It doesn’t need mobile data, so it works where the internet doesn’t, as long as your SIM has signal.",
    accent: "brand",
  },
  {
    icon: "Users",
    title: "Hero Mode: Community Rescue",
    desc: "Good people want to help. They just don’t know where to go. Hero Mode shows them your distance and arrival time, lets them tap “I’m going to help”, and leads them to you with a live route on the map.",
    accent: "safe",
  },
  {
    icon: "Route",
    title: "Follow-Me Safe Journey",
    desc: "Think of it as a friend who stays on the line until you’re home. Start Follow-Me before a cab ride or a late walk. If you stop somewhere unexpected it asks, “Are you safe?”, and if you can’t answer, it triggers SOS for you.",
    accent: "brand",
  },
  {
    icon: "Video",
    title: "Private Evidence Vault",
    desc: "When something goes wrong, proof matters. During an SOS the app records audio and photos and uploads them straight to your private vault, away from your phone. It opens only for you, behind your own PIN, so even if someone takes your phone, what was uploaded is still there to support you with the police or in court.",
    accent: "ink",
  },
  {
    icon: "Bot",
    title: "AI Safety Assistant",
    desc: "Some questions can’t wait until morning. Ask in your own language and our 24×7 assistant answers calmly, whether you need first-aid steps, a way out of a tense moment or a simple explanation of your rights. It can also start SOS or Follow-Me when you ask.",
    accent: "brand",
  },
  {
    icon: "Radio",
    title: "Background Protection",
    desc: "You shouldn’t have to keep an app open to be safe. During an alert RESCUEN keeps sharing your live location even when the screen is off or the app is minimised, so the people coming to help don’t lose you.",
    accent: "ink",
  },
  {
    icon: "Fingerprint",
    title: "Verified & Tamper-Locked",
    desc: "Everyone signs in with Google and a phone OTP, so there’s no password to leak. Your own number can change only once in 60 days, and only after a fresh OTP, which means someone who grabs your phone can’t quietly move your account to a number of theirs.",
    accent: "brand",
  },
  {
    icon: "PhoneCall",
    title: "One-Tap Women & Police Helplines",
    desc: "In a panic, even a three-digit number can slip your mind. So the ones that matter are always one tap away: 112 for any emergency, 100 for the police, 1091 for women, 108 for an ambulance and 1098 for children.",
    accent: "sos",
  },
  {
    icon: "HeartPulse",
    title: "Women Protection & Self-Defence Hub",
    desc: "Confidence is part of safety too. Here you’ll find practical self-defence, your legal rights explained plainly, yoga and fitness, and gentle guidance for healing after something difficult.",
    accent: "safe",
  },
  {
    icon: "BatteryCharging",
    title: "Battery-Smart by Design",
    desc: "A safety app is no use on a dead phone. RESCUEN changes how often it checks your location depending on what you’re doing, so it can stay with you through long days and late commutes.",
    accent: "ink",
  },
  {
    icon: "PhoneOutgoing",
    title: "Fake Call Escape Utility",
    desc: "Sometimes all you need is a polite reason to leave. Tap once and your phone rings with a call that looks and sounds real, so you can step away from a cab, a meeting or a conversation that doesn’t feel right.",
    accent: "sos",
  },
  {
    icon: "Languages",
    title: "6 Native Indian Languages",
    desc: "Help should come in the language you think in. RESCUEN speaks English, हिन्दी, বাংলা, मराठी, தமிழ் and తెలుగు, so your mother can use it as easily as you do.",
    accent: "safe",
  },
  {
    icon: "Lock",
    title: "Privacy-First, Zero Ads",
    desc: "Your location is yours. We encrypt it while it travels and while it’s stored, we never sell it, and we don’t run ads. If you ever decide to leave, your account has a clear 30-day deletion window.",
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
    desc: "Sign in with Google or your phone number and a one-time code. There’s no password to remember, and verifying everyone helps us keep the community genuine.",
    icon: "Smartphone",
  },
  {
    step: "02",
    title: "Add your trusted circle",
    desc: "Choose up to five people who would drop everything for you. Save their numbers once and RESCUEN remembers them, so in a bad moment you never have to search for a contact.",
    icon: "Users",
  },
  {
    step: "03",
    title: "Stay protected everywhere",
    desc: "Now go and live your day. Instant SOS, the 1 KM rescue radar, Follow-Me and the AI companion wait quietly in the background and wake up the second you need them.",
    icon: "ShieldCheck",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "The silent SOS reached my brother with my exact live GPS location before I could even explain. RESCUEN genuinely feels like an armed bodyguard in my pocket.",
    name: "Ananya R.",
    role: "College Student, West Bengal",
  },
  {
    quote:
      "As a night-shift hospital nurse, the Follow-Me safe journey engine and automated check-ins give my parents real peace of mind. Simple, fast, and life-saving.",
    name: "Priya M.",
    role: "Night-Shift Healthcare Worker",
  },
  {
    quote:
      "Hero Mode is revolutionary — I received a 1KM radar alert for a girl stuck in danger 300m away and navigated straight to help her. Every Indian city needs RESCUEN.",
    name: "Rohan S.",
    role: "Verified RESCUEN Hero",
  },
];

export const FAQS = [
  {
    q: "Is RESCUEN completely free?",
    a: "Yes, and we intend to keep it that way. Every life-saving feature, from the 2-second SOS and the 1 KM rescue radar to silent SMS alerts, Hero Mode, Follow-Me, the evidence vault and the AI safety assistant, is 100% free with no hidden charges. The only thing you may ever pay is your mobile operator’s normal SMS charge, depending on your plan.",
  },
  {
    q: "How does RESCUEN help prevent rape, stalking and street attacks?",
    a: "We try to help before, during and after. Before, Follow-Me keeps an eye on your journey and Fake Call gives you a way out of a cab or a conversation that feels wrong. During, a two-second hold or three presses of the volume key silently alerts up to five of your contacts, the police and RESCUEN users within about 1 km. After, the audio and photos already uploaded to the evidence vault stay safe even if your phone is snatched or broken. No app can promise to stop every crime, so please call 112 whenever you can.",
  },
  {
    q: "How do I trigger an SOS?",
    a: "There are three ways, so one of them is always within reach. Hold the SOS button for 2 seconds, press the volume key three times even from a locked screen, or simply ask the AI assistant inside the app.",
  },
  {
    q: "Does the silent SOS work when my phone is locked or the internet is weak?",
    a: "Yes, in most situations. You can trigger it from a locked screen with the volume key, and RESCUEN keeps sharing your location in the background. If mobile data drops, the alert still goes out as a silent SMS with your GPS location, as long as your SIM has signal. If there is no network at all, no app can send a message, so move towards signal, make noise and try 112.",
  },
  {
    q: "What permissions does the app need, and is my location private?",
    a: "RESCUEN asks for location (all the time, so SOS and the radar work in the background), SMS (to alert your family and the police), camera and microphone (only during an active SOS, for evidence) and notifications (to hear alerts near you). Your position stays up to date for the 1 KM radar while the app is protecting you, and the “Hide my location when safe” setting limits that to an active SOS. We never sell it and never use it for advertising.",
  },
  {
    q: "How are my evidence and personal data protected?",
    a: "Everything is encrypted while it travels and where it is stored on Google’s cloud. You sign in without a password, alert distances are worked out on our servers, your own number can change only once in 60 days, and the evidence vault opens only for you, behind your own PIN. We don’t claim end-to-end encryption, because we would rather tell you exactly what we do.",
  },
  {
    q: "Which languages does RESCUEN support?",
    a: "Six, day and night: English, हिन्दी, বাংলা, मराठी, தமிழ் and తెలుగు. Anyone in distress can ask for guidance or trigger SOS in the language that comes to them first.",
  },
  {
    q: "Who made RESCUEN, and where can I download it?",
    a: "RESCUEN, The Ultimate Safety, is designed and built by Team RESCUEN, an independent team from Durgapur, West Bengal. You can download the official Android app (com.officialrescuen.app) from Google Play using the button on this page. Please don’t install it from anywhere else.",
  },
  {
    q: "Does RESCUEN replace the police or 112?",
    a: "No. RESCUEN stands beside official services and never in place of them. If you can make a call, call 112 first and let RESCUEN do the rest.",
  },
  {
    q: "How do I delete my account and data?",
    a: "Your data belongs to you. You can ask for deletion inside the app or by email at any time. Your account first enters a 30-day grace period, which protects you if somebody forces you to delete it, and after that your personal records are removed for good, except where the law requires us to keep something.",
  },
];

export const FOOTER_GROUPS: { title: string; links: NavItem[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how" },
      { label: "Download on Android", href: SITE.appStoreUrl },
      { label: "AI tools", href: "/ai" },
      { label: "Support the mission", href: "/donate" },
    ],
  },
  {
    title: "Stay safe",
    links: [
      { label: "Safety guides", href: "/guides" },
      { label: "Emergency numbers", href: "/emergency-numbers" },
      { label: "Safety Planner", href: "/ai#planner" },
      { label: "Safety Check", href: "/ai#check" },
      { label: "Trust & Security", href: "/security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About RESCUEN", href: "/about" },
      { label: "Press & Media", href: "/about#press" },
      { label: "Contact", href: "/#contact" },
      { label: "WhatsApp Channel", href: SITE.whatsapp },
      { label: "Instagram", href: SITE.instagram },
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
];
