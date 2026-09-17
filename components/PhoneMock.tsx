import Image from "next/image";
import {
  Home,
  Bot,
  User,
  MapPin,
  Radar,
  CheckCircle2,
  Send,
  ShieldCheck,
} from "lucide-react";

/**
 * Premium placeholder app screens (on-brand recreations).
 * ── To use a REAL screenshot instead: drop an image in /public (e.g.
 *    /screens/home.jpg) and pass `src="/screens/home.jpg"` to <PhoneMock>.
 */
export type ScreenKind = "home" | "sos" | "radar" | "ai" | "profile";

function TopBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 ${dark ? "bg-transparent" : "bg-white"}`}>
      <div className="flex items-center gap-1.5">
        <span className="grid h-5 w-5 place-items-center rounded-md bg-white ring-1 ring-black/5">
          <Image src="/rescuen-logo.png" alt="" width={14} height={14} className="object-contain" />
        </span>
        <span className={`text-[10px] font-extrabold tracking-tight ${dark ? "text-white/90" : "text-brand-700"}`}>
          RESCUEN
        </span>
      </div>
      <div className="flex gap-1">
        <span className="h-3.5 w-3.5 rounded-[5px] bg-gradient-to-br from-pink-500 to-amber-400" />
        <span className="h-3.5 w-3.5 rounded-full bg-safe-500" />
      </div>
    </div>
  );
}

function BottomNav({ active }: { active: "home" | "ai" | "profile" }) {
  const item = (Icon: React.ElementType, key: string, label: string) => (
    <div className={`flex flex-1 flex-col items-center gap-0.5 ${active === key ? "text-brand-600" : "text-ink-faint"}`}>
      <Icon className="h-4 w-4" />
      <span className="text-[7px] font-bold uppercase tracking-wide">{label}</span>
    </div>
  );
  return (
    <div className="flex items-center border-t border-line bg-white px-2 py-2">
      {item(Home, "home", "Home")}
      {item(Bot, "ai", "AI Help")}
      {item(User, "profile", "Profile")}
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="flex h-full flex-col bg-mist">
      <TopBar />
      <div className="flex flex-1 flex-col items-center gap-3 px-3 pt-3">
        <div className="relative w-full overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-soft">
          <p className="px-1 pb-1 text-center text-[8px] font-bold text-safe-600">🟡 Refining accuracy…</p>
          <div className="relative h-24 overflow-hidden rounded-lg bg-[#0f2036]">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(#3a557a 1px,transparent 1px),linear-gradient(90deg,#3a557a 1px,transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <MapPin className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 fill-brand-500 text-white" />
          </div>
        </div>
        <div className="relative mt-2 grid h-28 w-28 place-items-center rounded-full bg-sos-gradient text-white shadow-sos">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-sos-400/40" />
          <span className="font-display text-2xl font-extrabold tracking-wide">SOS</span>
        </div>
        <p className="text-[8px] font-bold uppercase tracking-widest text-ink-faint">Hold 2s in danger</p>
      </div>
      <BottomNav active="home" />
    </div>
  );
}

function SosScreen() {
  return (
    <div className="flex h-full flex-col bg-sos-gradient px-3 py-4 text-white">
      <p className="mt-6 text-center font-display text-xl font-extrabold tracking-wide">🚨 SOS ACTIVE</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { k: "People notified", v: "1", c: "text-sos-600" },
          { k: "Helpers coming", v: "0", c: "text-safe-600" },
        ].map((s) => (
          <div key={s.k} className="rounded-xl bg-white px-2 py-3 text-center shadow-soft">
            <p className="text-[7px] font-bold uppercase tracking-wide text-ink-faint">{s.k}</p>
            <p className={`font-display text-2xl font-extrabold ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-white p-3 shadow-soft">
        <p className="text-[9px] font-extrabold text-sos-600">📡 BROADCAST STATUS</p>
        <ul className="mt-1.5 space-y-1">
          {["1 KM radar scanning live", "Family SMS sent silently", "Police (100) alerted"].map((t) => (
            <li key={t} className="flex items-center gap-1.5 text-[8.5px] font-semibold text-ink">
              <CheckCircle2 className="h-3 w-3 text-safe-500" /> {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto rounded-xl bg-ink py-2.5 text-center text-[10px] font-extrabold tracking-wide">
        ⏹ DEACTIVATE ALARM
      </div>
    </div>
  );
}

function RadarScreen() {
  return (
    <div className="flex h-full flex-col bg-[#0a1626] px-3 py-3">
      <div className="rounded-xl bg-white px-3 py-2 shadow-soft">
        <p className="text-center text-[9px] font-extrabold text-sos-600">🚨 EMERGENCY NEARBY</p>
        <div className="mt-1.5 flex justify-between border-t border-line pt-1.5 text-center">
          {[
            { k: "Distance", v: "0.32 km", c: "text-ink" },
            { k: "ETA", v: "1 min", c: "text-safe-600" },
            { k: "Speed", v: "0 km/h", c: "text-brand-600" },
          ].map((s) => (
            <div key={s.k}>
              <p className="text-[6.5px] uppercase text-ink-faint">{s.k}</p>
              <p className={`text-[9px] font-extrabold ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative mt-3 flex-1 overflow-hidden rounded-xl border border-white/10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#24405f 1px,transparent 1px),linear-gradient(90deg,#24405f 1px,transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="26" y1="40" x2="70" y2="66" stroke="#3f79d4" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
        <MapPin className="absolute left-[24%] top-[36%] h-4 w-4 fill-brand-500 text-white" />
        <MapPin className="absolute left-[66%] top-[62%] h-4 w-4 fill-sos-500 text-white" />
        <Radar className="absolute right-2 top-2 h-4 w-4 text-white/40" />
      </div>
      <div className="mt-3 rounded-xl bg-brand-gradient py-2.5 text-center text-[9px] font-extrabold text-white shadow-glow">
        🦸 I AM GOING TO HELP
      </div>
    </div>
  );
}

function AiScreen() {
  return (
    <div className="flex h-full flex-col bg-mist">
      <TopBar />
      <div className="flex-1 space-y-2 px-3 py-2">
        <p className="text-center text-[10px] font-extrabold text-brand-700">🤖 RESCUEN AI Assistant</p>
        <div className="grid grid-cols-2 gap-1.5">
          {["SOS History", "How it works?", "App Security", "Custom Chat"].map((c) => (
            <div key={c} className="rounded-lg border border-brand-200 bg-white px-1.5 py-1.5 text-center text-[7.5px] font-bold text-brand-700">
              {c}
            </div>
          ))}
        </div>
        <div className="max-w-[80%] rounded-xl rounded-bl-sm border border-line bg-white px-2 py-1.5 text-[8px] text-ink-soft shadow-soft">
          Hello! I’m the RESCUEN AI Security Manager. How can I help?
        </div>
        <div className="ml-auto max-w-[70%] rounded-xl rounded-br-sm bg-brand-600 px-2 py-1.5 text-[8px] font-semibold text-white">
          App Security
        </div>
        <div className="max-w-[85%] rounded-xl rounded-bl-sm border border-line bg-white px-2 py-1.5 text-[8px] text-ink-soft shadow-soft">
          RESCUEN uses Firebase App Check &amp; strict security rules to keep your data safe…
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t border-line bg-white px-2 py-2">
        <div className="h-6 flex-1 rounded-lg bg-mist" />
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand-gradient text-white">
          <Send className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="flex h-full flex-col bg-mist">
      <TopBar />
      <div className="flex-1 px-3 py-3">
        <div className="rounded-xl bg-white p-3 shadow-soft">
          <p className="font-display text-sm font-extrabold text-ink">User Dashboard</p>
          <div className="mt-2 space-y-2">
            {["Name", "Email", "My phone", "Family"].map((l) => (
              <div key={l} className="flex items-center justify-between border-b border-line pb-1.5">
                <span className="text-[8px] font-bold uppercase text-ink-faint">{l}</span>
                <span className="h-2 w-16 rounded bg-mist" />
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="rounded-lg bg-safe-500 py-1.5 text-center text-[8px] font-extrabold text-white">EDIT NUMBERS</div>
            <div className="rounded-lg bg-ink py-1.5 text-center text-[8px] font-extrabold text-white">LOGOUT</div>
            <div className="rounded-lg bg-sos-500 py-1.5 text-center text-[8px] font-extrabold text-white">DELETE ACCOUNT</div>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1 text-[7px] font-semibold text-brand-600">
            <ShieldCheck className="h-2.5 w-2.5" /> Read Terms &amp; Privacy Policy
          </p>
        </div>
      </div>
      <BottomNav active="profile" />
    </div>
  );
}

const SCREENS: Record<ScreenKind, React.FC> = {
  home: HomeScreen,
  sos: SosScreen,
  radar: RadarScreen,
  ai: AiScreen,
  profile: ProfileScreen,
};

export default function PhoneMock({
  screen,
  src,
  alt,
  className = "h-[560px] w-[272px]",
  priority = false,
}: {
  screen: ScreenKind;
  src?: string; // optional real screenshot to override the mock
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  const Screen = SCREENS[screen];
  return (
    <div className={`relative rounded-[2.4rem] border border-ink/10 bg-ink p-2 shadow-lift ${className}`}>
      <div className="absolute left-1/2 top-2 z-20 h-4 w-16 -translate-x-1/2 rounded-b-xl bg-ink" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-white">
        {src ? (
          <Image src={src} alt={alt || "RESCUEN app screen"} fill sizes="272px" className="object-cover" priority={priority} />
        ) : (
          <Screen />
        )}
      </div>
    </div>
  );
}
