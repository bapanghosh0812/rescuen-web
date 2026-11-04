"use client";

import { motion } from "framer-motion";

type Props = {
  celebrating?: boolean;
  amount?: number;
};

/**
 * Ultra-fast, zero-lag animated vector cartoon of an Indian Boy & Girl
 * greeting the supporter with a warm "Namaste" (Anjali Mudra) on behalf of Team RESCUEN.
 */
export default function NamasteIllustration({ celebrating = false, amount }: Props) {
  const formattedAmt =
    amount && amount >= 1
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(amount)
      : null;

  return (
    <div className="relative mx-auto flex w-full max-w-[420px] flex-col items-center select-none">
      {/* Floating Luxury Glass Greeting Bubble */}
      <motion.div
        key={celebrating ? "celebrate" : formattedAmt || "default"}
        initial={{ opacity: 0, y: 10, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="relative z-20 mb-3 inline-flex items-center gap-2 rounded-full border border-gold-300/60 bg-white/85 px-4 py-2 text-xs sm:text-sm font-bold text-ink shadow-gold backdrop-blur-xl"
      >
        <span className="text-base">{celebrating ? "🎉" : "🙏"}</span>
        <span>
          {celebrating
            ? "Koti-Koti Dhanyavaad from Team RESCUEN!"
            : formattedAmt
            ? `Namaste! Supporting Team RESCUEN with ${formattedAmt}`
            : "Namaste! Stand with Team RESCUEN’s Mission"}
        </span>
        <span className="h-2 w-2 rounded-full bg-safe animate-ping" />
      </motion.div>

      {/* Main Animated SVG Canvas */}
      <div className="relative w-full aspect-[4/3] max-h-[300px] flex items-center justify-center">
        {/* Ambient Golden & Royal Blue Halo */}
        <div className="pointer-events-none absolute inset-4 rounded-full bg-gradient-to-tr from-brand-200/50 via-gold-200/50 to-safe-200/40 blur-2xl animate-pulse" />

        <svg
          viewBox="0 0 440 330"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 h-full w-full drop-shadow-[0_18px_28px_rgba(10,37,64,0.14)]"
          role="img"
          aria-label="Animated Indian girl and boy doing Namaste from Team RESCUEN"
        >
          <defs>
            <linearGradient id="haloGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fdf1cf" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#eef4fc" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#fde68a" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="girlDress" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1257bd" />
              <stop offset="60%" stopColor="#004aad" />
              <stop offset="100%" stopColor="#0a2540" />
            </linearGradient>
            <linearGradient id="girlDupatta" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="boyKurta" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#e6b02f" />
              <stop offset="100%" stopColor="#b07c17" />
            </linearGradient>
            <linearGradient id="boyJacket" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a2540" />
              <stop offset="100%" stopColor="#003d8f" />
            </linearGradient>
            <linearGradient id="skinTone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7c59f" />
              <stop offset="100%" stopColor="#eba87b" />
            </linearGradient>
          </defs>

          {/* Decorative Mandala / Sunburst Arch Background */}
          <circle cx="220" cy="175" r="132" fill="url(#haloGrad)" stroke="#f0c65a" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="220" cy="175" r="114" stroke="#3f79d4" strokeOpacity="0.22" strokeWidth="1.5" />

          {/* Floating Marigold / Lotus Sparkles */}
          <motion.g
            animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="72" cy="88" r="5" fill="#f59e0b" />
            <circle cx="368" cy="84" r="6" fill="#3f79d4" />
            <circle cx="220" cy="42" r="5" fill="#10b981" />
            <path d="M220 22 L223 30 L231 33 L223 36 L220 44 L217 36 L209 33 L217 30 Z" fill="#f59e0b" />
            <path d="M62 150 L64 155 L69 157 L64 159 L62 164 L60 159 L55 157 L60 155 Z" fill="#1257bd" />
            <path d="M380 148 L382 153 L387 155 L382 157 L380 162 L378 157 L373 155 L378 153 Z" fill="#f59e0b" />
          </motion.g>

          {/* ─────────────────── CUTE INDIAN GIRL (LEFT) ─────────────────── */}
          <motion.g
            animate={
              celebrating
                ? { y: [0, -6, 0], rotate: [0, 3, 0] }
                : { y: [0, -4, 0], rotate: [0, 1.5, 0] }
            }
            transition={{ duration: celebrating ? 1.4 : 3.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "150px 260px" }}
          >
            {/* Long Braided Hair with Gajra Flowers */}
            <ellipse cx="148" cy="132" rx="44" ry="46" fill="#1e1b2e" />
            <path d="M108 145 C102 180, 108 215, 118 232 C126 220, 125 180, 120 150 Z" fill="#1e1b2e" />
            {/* Jasmine Gajra on Hair */}
            <circle cx="110" cy="148" r="5" fill="#ffffff" stroke="#fde68a" strokeWidth="1.5" />
            <circle cx="108" cy="158" r="4.5" fill="#ffffff" stroke="#fde68a" strokeWidth="1.5" />
            <circle cx="111" cy="167" r="4.5" fill="#ffffff" stroke="#fde68a" strokeWidth="1.5" />

            {/* Neck */}
            <rect x="139" y="168" width="18" height="22" rx="8" fill="url(#skinTone)" />

            {/* Royal Blue Anarkali / Saree Torso */}
            <path
              d="M98 290 C100 222, 120 186, 148 186 C176 186, 196 222, 198 290 Z"
              fill="url(#girlDress)"
            />
            {/* Golden Zari Dupatta Drape */}
            <path
              d="M112 195 C132 215, 165 235, 194 275 L198 290 L165 290 C145 255, 122 230, 105 212 Z"
              fill="url(#girlDupatta)"
              opacity="0.95"
            />
            {/* Golden Necklace */}
            <path
              d="M134 185 Q148 199 162 185"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="148" cy="193" r="3.5" fill="#fef08a" />

            {/* Golden Jhumka Earrings */}
            <circle cx="107" cy="144" r="4" fill="#fbbf24" />
            <path d="M102 149 C102 144, 112 144, 112 149 L114 155 L100 155 Z" fill="#f59e0b" />
            <circle cx="189" cy="144" r="4" fill="#fbbf24" />
            <path d="M184 149 C184 144, 194 144, 194 149 L196 155 L182 155 Z" fill="#f59e0b" />

            {/* Face */}
            <ellipse cx="148" cy="134" rx="35" ry="37" fill="url(#skinTone)" />

            {/* Center-Parted Hair Front */}
            <path
              d="M113 130 C115 98, 148 92, 148 106 C148 92, 181 98, 183 130 C172 114, 158 109, 148 112 C138 109, 124 114, 113 130 Z"
              fill="#1e1b2e"
            />
            {/* Maang Tikka & Red Bindi */}
            <line x1="148" y1="96" x2="148" y2="115" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="148" cy="117" r="4" fill="#fbbf24" />
            <circle cx="148" cy="125" r="3" fill="#e11d48" />

            {/* Eyebrows */}
            <path d="M126 125 Q134 120 141 124" stroke="#2d232e" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M155 124 Q162 120 170 125" stroke="#2d232e" strokeWidth="2.4" strokeLinecap="round" />

            {/* Sparkling Eyes */}
            <ellipse cx="134" cy="135" rx="5.5" ry="6" fill="#1e1b2e" />
            <circle cx="132.5" cy="133" r="2" fill="#ffffff" />
            <ellipse cx="162" cy="135" rx="5.5" ry="6" fill="#1e1b2e" />
            <circle cx="160.5" cy="133" r="2" fill="#ffffff" />

            {/* Rosy Cheeks */}
            <ellipse cx="123" cy="145" rx="6" ry="3.5" fill="#fb7185" opacity="0.45" />
            <ellipse cx="173" cy="145" rx="6" ry="3.5" fill="#fb7185" opacity="0.45" />

            {/* Cute Nose &Nose-pin */}
            <path d="M148 136 Q145 143 149 145" stroke="#c9825b" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="145" cy="143" r="1.6" fill="#fef08a" />

            {/* Warm Smile */}
            <path
              d="M138 152 Q148 161 158 152"
              stroke="#be123c"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            {/* Joined Namaste Hands (Anjali Mudra) */}
            <motion.g
              animate={{ scale: [1, 1.05, 1], y: [0, -2, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "148px 232px" }}
            >
              {/* Arms coming to center */}
              <path
                d="M106 250 Q125 262 142 238"
                stroke="#1257bd"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M190 250 Q171 262 154 238"
                stroke="#1257bd"
                strokeWidth="18"
                strokeLinecap="round"
              />
              {/* Golden Bangles */}
              <line x1="133" y1="242" x2="141" y2="250" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="163" y1="242" x2="155" y2="250" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
              {/* Namaste Palms */}
              <path
                d="M148 206 C142 214, 139 229, 142 242 L148 244 L154 242 C157 229, 154 214, 148 206 Z"
                fill="url(#skinTone)"
                stroke="#d98a5f"
                strokeWidth="1.5"
              />
              <line x1="148" y1="208" x2="148" y2="242" stroke="#c9825b" strokeWidth="1.5" />
            </motion.g>
          </motion.g>

          {/* ─────────────────── CUTE INDIAN BOY (RIGHT) ─────────────────── */}
          <motion.g
            animate={
              celebrating
                ? { y: [0, -6, 0], rotate: [0, -3, 0] }
                : { y: [0, -4, 0], rotate: [0, -1.5, 0] }
            }
            transition={{
              duration: celebrating ? 1.4 : 3.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
            style={{ transformOrigin: "292px 260px" }}
          >
            {/* Neck */}
            <rect x="283" y="166" width="18" height="24" rx="8" fill="url(#skinTone)" />

            {/* Saffron/Gold Kurta + Royal Navy Nehru Jacket */}
            <path
              d="M240 290 C242 220, 262 184, 292 184 C322 184, 342 220, 344 290 Z"
              fill="url(#boyKurta)"
            />
            <path
              d="M252 188 C266 184, 278 184, 282 188 L284 290 L246 290 C248 240, 250 205, 252 188 Z"
              fill="url(#boyJacket)"
            />
            <path
              d="M332 188 C318 184, 306 184, 302 188 L300 290 L338 290 C336 240, 334 205, 332 188 Z"
              fill="url(#boyJacket)"
            />
            {/* Mandarin Collar & Pocket Square Badge */}
            <path d="M278 184 Q292 196 306 184" stroke="#fbbf24" strokeWidth="3" fill="none" />
            <circle cx="315" cy="215" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />

            {/* Ears */}
            <circle cx="254" cy="136" r="6" fill="url(#skinTone)" />
            <circle cx="330" cy="136" r="6" fill="url(#skinTone)" />

            {/* Face */}
            <ellipse cx="292" cy="132" rx="35" ry="37" fill="url(#skinTone)" />

            {/* Stylish Indian Hair */}
            <path
              d="M255 128 C253 95, 275 84, 296 86 C318 88, 332 100, 329 128 C320 110, 305 104, 286 106 C272 108, 262 115, 255 128 Z"
              fill="#1e1b2e"
            />
            <path d="M275 90 Q295 78 314 92" stroke="#312e43" strokeWidth="4" strokeLinecap="round" />

            {/* Tilak on Forehead */}
            <path d="M292 115 L292 123" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />

            {/* Eyebrows */}
            <path d="M269 122 Q277 117 285 121" stroke="#1e1b2e" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M299 121 Q307 117 315 122" stroke="#1e1b2e" strokeWidth="2.6" strokeLinecap="round" />

            {/* Friendly Sparkling Eyes */}
            <ellipse cx="277" cy="133" rx="5.5" ry="6" fill="#1e1b2e" />
            <circle cx="275.5" cy="131" r="2" fill="#ffffff" />
            <ellipse cx="307" cy="133" rx="5.5" ry="6" fill="#1e1b2e" />
            <circle cx="305.5" cy="131" r="2" fill="#ffffff" />

            {/* Warm Cheeks */}
            <ellipse cx="266" cy="143" rx="5.5" ry="3.2" fill="#fb7185" opacity="0.38" />
            <ellipse cx="318" cy="143" rx="5.5" ry="3.2" fill="#fb7185" opacity="0.38" />

            {/* Nose */}
            <path d="M292 134 Q289 141 293 143" stroke="#c9825b" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Joyful Smile */}
            <path
              d="M281 150 Q292 160 303 150"
              stroke="#9a3412"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            {/* Joined Namaste Hands (Anjali Mudra) */}
            <motion.g
              animate={{ scale: [1, 1.05, 1], y: [0, -2, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
              style={{ transformOrigin: "292px 232px" }}
            >
              {/* Kurta Sleeves */}
              <path
                d="M248 248 Q268 262 286 238"
                stroke="#f59e0b"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M336 248 Q316 262 298 238"
                stroke="#f59e0b"
                strokeWidth="18"
                strokeLinecap="round"
              />
              {/* Namaste Palms */}
              <path
                d="M292 204 C286 212, 283 228, 286 242 L292 244 L298 242 C301 228, 298 212, 292 204 Z"
                fill="url(#skinTone)"
                stroke="#d98a5f"
                strokeWidth="1.5"
              />
              <line x1="292" y1="206" x2="292" y2="242" stroke="#c9825b" strokeWidth="1.5" />
            </motion.g>
          </motion.g>

          {/* Center Glowing Heart / Shield Emblem Between Them */}
          <motion.g
            animate={{ scale: [1, 1.14, 1], y: [0, -5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "220px 175px" }}
          >
            <circle cx="220" cy="175" r="20" fill="#ffffff" stroke="#e6b02f" strokeWidth="2.5" />
            <path
              d="M220 185 C220 185, 208 177, 208 169 C208 165, 211.5 162, 215.5 162 C218 162, 220 164, 220 164 C220 164, 222 162, 224.5 162 C228.5 162, 232 165, 232 169 C232 177, 220 185, 220 185 Z"
              fill="#e74c3c"
            />
          </motion.g>

          {/* Bottom Stage Ribbon */}
          <rect x="65" y="284" width="310" height="28" rx="14" fill="#0a2540" />
          <text
            x="220"
            y="302"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="11.5"
            fontWeight="700"
            fontFamily="Inter, system-ui, sans-serif"
            letterSpacing="0.8"
          >
            🙏 TEAM RESCUEN · SURAKSHIT BHARAT ABHIYAN 🙏
          </text>
        </svg>
      </div>
    </div>
  );
}

