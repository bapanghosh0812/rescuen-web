/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium light palette
        canvas: "#ffffff",
        paper: "#fafbfe",
        mist: "#f1f4fa",
        line: "#e5e9f2",
        ink: {
          DEFAULT: "#0a2540", // RESCUEN navy
          soft: "#37415a",
          faint: "#697089",
        },
        // RESCUEN primary — blue (matches the real app + logo)
        brand: {
          50: "#eef4fc",
          100: "#d5e3f7",
          200: "#aac6ef",
          300: "#7aa4e4",
          400: "#3f79d4",
          500: "#1257bd",
          600: "#004aad",
          700: "#003d8f",
          800: "#063372",
          900: "#0a2540",
          DEFAULT: "#004aad",
        },
        // SOS / emergency — red
        sos: {
          50: "#fef2f1",
          100: "#fcdedb",
          200: "#f7bdb6",
          300: "#f0928a",
          400: "#ea6a5f",
          500: "#e74c3c",
          600: "#cf3b2c",
          700: "#ac2f23",
          800: "#8c2a20",
          900: "#74271f",
          DEFAULT: "#e74c3c",
        },
        // Safe / helper — green
        safe: {
          50: "#eafaf1",
          100: "#ccf1dc",
          200: "#9de6bd",
          300: "#5fd699",
          400: "#2ecc71",
          500: "#27ae60",
          600: "#1f8f4f",
          700: "#1b7d46",
          DEFAULT: "#2ecc71",
        },
        // Warm accent for ratings / premium touches
        gold: {
          100: "#fdf1cf",
          200: "#f8dd94",
          300: "#f0c65a",
          400: "#e6b02f",
          500: "#d69a1e",
          600: "#b07c17",
          DEFAULT: "#e6b02f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,37,64,0.04), 0 8px 24px -12px rgba(10,37,64,0.12)",
        card: "0 2px 4px rgba(10,37,64,0.03), 0 18px 40px -20px rgba(10,37,64,0.18)",
        lift: "0 30px 60px -24px rgba(10,37,64,0.30)",
        glow: "0 0 0 1px rgba(0,74,173,0.12), 0 20px 50px -20px rgba(0,74,173,0.40)",
        sos: "0 0 0 1px rgba(231,76,60,0.14), 0 18px 44px -18px rgba(231,76,60,0.5)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.65)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(10,37,64,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,37,64,0.04) 1px, transparent 1px)",
        "brand-gradient": "linear-gradient(135deg, #1257bd 0%, #004aad 52%, #0a2540 100%)",
        "sos-gradient": "linear-gradient(135deg, #ef6a5c 0%, #e74c3c 50%, #c0392b 100%)",
        "safe-gradient": "linear-gradient(135deg, #4bd98a 0%, #2ecc71 55%, #1f8f4f 100%)",
        "gold-gradient": "linear-gradient(135deg, #f0c65a 0%, #e6b02f 55%, #b07c17 100%)",
        sheen: "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "float-slow": {
          "0%,100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-26px) translateX(10px)" },
        },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)", opacity: "0.55" },
          "33%": { transform: "translate(30px,-30px) scale(1.15)", opacity: "0.75" },
          "66%": { transform: "translate(-25px,20px) scale(0.95)", opacity: "0.5" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "pulse-ring": {
          "0%": { transform: "scale(0.7)", opacity: "0.7" },
          "80%,100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sweep: { to: { transform: "rotate(360deg)" } },
        "otp-pop": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%,60%": { transform: "translateX(-7px)" },
          "40%,80%": { transform: "translateX(7px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        aurora: "aurora 16s ease-in-out infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        "spin-slow": "spin-slow 22s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.2,1) infinite",
        "fade-up": "fade-up 0.7s ease forwards",
        sweep: "sweep 4s linear infinite",
        "otp-pop": "otp-pop 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        shake: "shake 0.4s ease",
      },
    },
  },
  plugins: [],
};
