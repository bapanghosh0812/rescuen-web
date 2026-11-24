import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** Only what the site needs: phone verification and the payment window. */
function securityHeaders(dev) {
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.recaptcha.net/recaptcha/ https://apis.google.com https://*.razorpay.com`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob: https://*.razorpay.com https://www.gstatic.com",
    "frame-src https://www.google.com https://www.recaptcha.net https://*.firebaseapp.com https://*.razorpay.com",
    `connect-src 'self'${dev ? " ws:" : ""} https://www.google.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://*.razorpay.com`,
    "media-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self' https://api.razorpay.com",
    "frame-ancestors 'none'",
    ...(dev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(self), geolocation=(self), payment=(self \"https://api.razorpay.com\" \"https://checkout.razorpay.com\"), usb=(), bluetooth=(), serial=(), browsing-topics=()",
    },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
    { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  ];
}

const legal = ["terms", "privacy", "disclaimer", "refund", "cookies"];

export default function config(phase) {
  const dev = phase === PHASE_DEVELOPMENT_SERVER;
  /** @type {import('next').NextConfig} */
  return {
    reactStrictMode: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    images: {
      formats: ["image/avif", "image/webp"],
      minimumCacheTTL: 31536000,
      deviceSizes: [640, 828, 1080, 1200, 1920],
      imageSizes: [32, 48, 64, 96, 256, 384],
      qualities: [70, 75],
    },
    eslint: { ignoreDuringBuilds: true },
    experimental: { optimizePackageImports: ["lucide-react"] },
    outputFileTracingIncludes: { "/api/contact": ["./public/rescuen-logo.png"] },
    async headers() {
      const month = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }];
      return [
        { source: "/:path*", headers: securityHeaders(dev) },
        { source: "/promo/:file*", headers: month },
        { source: "/icons/:file*", headers: month },
        // Images used in emails and link previews are fetched by other sites.
        ...["/og/:file*", "/daan/:file*", "/rescuen-logo.png"].map((source) => ({
          source,
          headers: [{ key: "Cross-Origin-Resource-Policy", value: "cross-origin" }],
        })),
      ];
    },
    async redirects() {
      const home = (process.env.NEXT_PUBLIC_SITE_URL || "https://rescuen-web.netlify.app").replace(/\/+$/, "");
      return [
        // One address for search engines: every other copy points here.
        ...["rescuen-web.vercel.app", "rescuen-web-2.netlify.app", "rescuen-web.netlify.app"]
          .filter((host) => host !== new URL(home).host)
          .map((host) => ({
            source: "/:path*",
            has: [{ type: "host", value: host }],
            destination: `${home}/:path*`,
            permanent: true,
          })),
        ...legal.map((d) => ({ source: `/${d}`, destination: `/legal/${d}`, permanent: true })),
        { source: "/promo/:name(promo-[1-6]).png", destination: "/promo/:name.webp", permanent: true },
        { source: "/namaste-illustration.svg", destination: "/daan/namaste-mail.jpg", permanent: true },
        { source: "/logo.png", destination: "/icons/icon-512.png", permanent: true },
        { source: "/blog", destination: "/guides", permanent: false },
        { source: "/helpline", destination: "/emergency-numbers", permanent: true },
      ];
    },
  };
}
