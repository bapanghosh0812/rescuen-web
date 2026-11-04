/** @type {import('next').NextConfig} */

// Security headers applied to every route. A pragmatic CSP that still allows
// Firebase Auth, invisible reCAPTCHA, Google Fonts, Gemini API, and Razorpay Checkout to work.
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://apis.google.com https://*.googleapis.com https://*.firebaseio.com https://checkout.razorpay.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "frame-src 'self' https://www.google.com https://www.recaptcha.net https://*.firebaseapp.com https://*.web.app https://api.razorpay.com https://checkout.razorpay.com https://pages.razorpay.com",
  "connect-src 'self' https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com wss://*.firebaseio.com https://generativelanguage.googleapis.com https://api.razorpay.com https://lumberjack.razorpay.com https://pages.razorpay.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Type errors still fail the build; we skip only the interactive ESLint gate.
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/terms", destination: "/legal/terms" },
      { source: "/privacy", destination: "/legal/privacy" },
      { source: "/disclaimer", destination: "/legal/disclaimer" },
      { source: "/refund", destination: "/legal/refund" },
      { source: "/cookies", destination: "/legal/cookies" },
    ];
  },
};

export default nextConfig;
