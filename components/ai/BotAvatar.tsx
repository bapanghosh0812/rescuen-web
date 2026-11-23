import { useId } from "react";

// The RESCUEN guardian: a friendly shield with a headset. Pure SVG and CSS, so
// it is sharp at any size and costs almost nothing to load.

export default function BotAvatar({
  size = 40,
  mood = "idle",
  className = "",
}: {
  size?: number;
  mood?: "idle" | "thinking" | "talking";
  className?: string;
}) {
  // Every copy needs its own colour ids: borrowing them from a hidden copy leaves this one blank.
  const id = `ba${useId().replace(/\W/g, "")}`;
  const bg = `${id}b`;
  const gold = `${id}g`;
  const shield = `${id}s`;
  const visor = `${id}v`;
  const url = (ref: string) => `url(#${ref})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      aria-hidden="true"
      className={`bot-avatar bot-${mood} ${className}`}
    >
      <defs>
        <radialGradient id={bg} cx="32%" cy="24%" r="88%">
          <stop offset="0" stopColor="#1f6fe0" />
          <stop offset=".52" stopColor="#004aad" />
          <stop offset="1" stopColor="#061a36" />
        </radialGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fdf1cf" />
          <stop offset=".45" stopColor="#e6b02f" />
          <stop offset="1" stopColor="#b07c17" />
        </linearGradient>
        <linearGradient id={shield} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d5e3f7" />
        </linearGradient>
        <linearGradient id={visor} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12386f" />
          <stop offset="1" stopColor="#061429" />
        </linearGradient>
      </defs>

      <circle cx="48" cy="48" r="46" fill={url(bg)} stroke={url(gold)} strokeWidth="3" />
      <ellipse cx="36" cy="18" rx="22" ry="9" fill="#fff" opacity=".13" />

      <g className="bot-head">
        <path d="M24 46a24 24 0 0 1 48 0" fill="none" stroke={url(gold)} strokeWidth="3.4" strokeLinecap="round" />
        <path
          d="M48 22c8 5 15 6.600 22 7v19c0 15-9.400 24.400-22 30-12.600-5.600-22-15-22-30V29c7-.4 14-2 22-7Z"
          fill={url(shield)}
          stroke={url(gold)}
          strokeWidth="2.2"
        />
        <rect x="31" y="37" width="34" height="21" rx="10.5" fill={url(visor)} />
        <path
          d="M35 41.500c4-2.200 9-3 14-2.700"
          stroke="#fff"
          strokeOpacity=".28"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <g className="bot-eyes" fill="#7fe3ff">
          <rect x="38.2" y="43.2" width="6" height="8.6" rx="3" />
          <rect x="51.8" y="43.2" width="6" height="8.6" rx="3" />
        </g>
        <path
          className="bot-mouth"
          d="M42.500 64.500c3 3.200 8 3.200 11 0"
          fill="none"
          stroke="#004aad"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <rect x="19.5" y="42" width="8" height="15" rx="4" fill={url(gold)} />
        <rect x="68.5" y="42" width="8" height="15" rx="4" fill={url(gold)} />
        <path d="M72.500 57c0 7-5 11-11 12" fill="none" stroke={url(gold)} strokeWidth="2.4" strokeLinecap="round" />
        <circle className="bot-mic" cx="60.5" cy="69.5" r="2.6" fill="#2ecc71" />
      </g>
    </svg>
  );
}
