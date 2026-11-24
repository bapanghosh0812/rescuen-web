// Rebuilds the link-preview image, icons and app screenshots.
// Usage: node scripts/make-images.mjs <folder with the Sora and Inter .woff files>
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { ImageResponse } = require("next/og");

const root = path.resolve(import.meta.dirname, "..");
const pub = (p) => path.join(root, "public", p);
const appIcon = path.join(root, "scripts/assets/app-icon.png");
const fontDir = process.argv[2];
const find = (name) => {
  const hit = fs.readdirSync(fontDir, { recursive: true }).find((f) => String(f).endsWith(name));
  return fs.readFileSync(path.join(fontDir, String(hit)));
};

const W = 1200;
const H = 630;
const el = (type, style, children) => ({ type, props: { style: { display: "flex", ...style }, children } });

// ── 1. link preview ─────────────────────────────────────────────────────────
const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#03122e"/><stop offset=".55" stop-color="#04204f"/><stop offset="1" stop-color="#020a1d"/>
    </linearGradient>
    <radialGradient id="blue"><stop offset="0" stop-color="#1a6bff" stop-opacity=".55"/><stop offset="1" stop-color="#1a6bff" stop-opacity="0"/></radialGradient>
    <radialGradient id="gold"><stop offset="0" stop-color="#e6b02f" stop-opacity=".26"/><stop offset="1" stop-color="#e6b02f" stop-opacity="0"/></radialGradient>
    <linearGradient id="line" x1="0" x2="1"><stop offset="0" stop-color="#e6b02f"/><stop offset=".5" stop-color="#fdf1cf"/><stop offset="1" stop-color="#b07c17"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#b)"/>
  <ellipse cx="930" cy="300" rx="430" ry="400" fill="url(#blue)"/>
  <ellipse cx="90" cy="640" rx="420" ry="300" fill="url(#gold)"/>
  <rect y="${H - 8}" width="${W}" height="8" fill="url(#line)"/>
</svg>`);

const ph = { w: 400, h: 700 };
const feather = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${ph.w}" height="${ph.h}">
  <defs><filter id="f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="20"/></filter></defs>
  <rect x="32" y="30" width="${ph.w - 64}" height="${ph.h}" rx="60" fill="#fff" filter="url(#f)"/></svg>`);
const wholePhone = await sharp(pub("promo/promo-1.webp"))
  .extract({ left: 165, top: 235, width: 590, height: 1032 })
  .resize(ph.w, ph.h, { fit: "fill" })
  .ensureAlpha()
  .composite([{ input: feather, blend: "dest-in" }])
  .png()
  .toBuffer();
const phone = await sharp(wholePhone).extract({ left: 0, top: 0, width: ph.w, height: 596 }).png().toBuffer();

const tile = await sharp(appIcon).extract({ left: 105, top: 56, width: 280, height: 280 }).resize(176, 176).png().toBuffer();
const chip = (text, dot) =>
  el(
    "div",
    {
      alignItems: "center",
      padding: "12px 22px",
      borderRadius: 999,
      border: "1.5px solid rgba(255,255,255,.22)",
      background: "rgba(255,255,255,.08)",
      color: "#fff",
      fontFamily: "Inter",
      fontSize: 24,
    },
    [el("div", { width: 12, height: 12, borderRadius: 12, background: dot, marginRight: 12 }, []), text]
  );

const overlay = new ImageResponse(
  el("div", { width: W, height: H, flexDirection: "column", justifyContent: "center", padding: "0 0 8px 68px" }, [
    el("div", { alignItems: "center" }, [
      { type: "img", props: { src: `data:image/png;base64,${tile.toString("base64")}`, width: 84, height: 84, style: { borderRadius: 24 } } },
      el("div", { marginLeft: 24, fontFamily: "Sora", fontWeight: 800, fontSize: 50, color: "#fff", letterSpacing: 1 }, [
        "RESCU",
        el("span", { color: "#f0c65a" }, "EN"),
      ]),
    ]),
    el("div", { marginTop: 36, flexDirection: "column", fontFamily: "Sora", fontWeight: 800, fontSize: 68, lineHeight: 1.1, color: "#fff", letterSpacing: -1.5 }, [
      el("div", {}, "Your 24×7 personal"),
      el("div", {}, ["safety ", el("span", { color: "#f0c65a", marginLeft: 18 }, "bodyguard")]),
    ]),
    el("div", { marginTop: 24, fontFamily: "Inter", fontSize: 29, color: "rgba(255,255,255,.8)" }, "Hold for 2 seconds. Alert people within 1 km."),
    el("div", { marginTop: 38, gap: 14 }, [chip("Instant SOS", "#ff5b4d"), chip("Live radar", "#4da3ff"), chip("AI safety", "#2ecc71")]),
  ]),
  {
    width: W,
    height: H,
    fonts: [
      { name: "Sora", data: find("sora-latin-800-normal.woff"), weight: 800 },
      { name: "Inter", data: find("inter-latin-500-normal.woff"), weight: 500 },
    ],
  }
);

fs.mkdirSync(pub("og"), { recursive: true });
fs.mkdirSync(pub("icons"), { recursive: true });
await sharp(background)
  .composite([
    { input: phone, left: 778, top: 26 },
    { input: Buffer.from(await overlay.arrayBuffer()), left: 0, top: 0 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(pub("og/rescuen.jpg"));

// ── 2. icons ────────────────────────────────────────────────────────────────
const mark = () => sharp(appIcon).extract({ left: 105, top: 56, width: 280, height: 280 });
const png = { compressionLevel: 9, palette: true, quality: 90 };
await mark().resize(512, 512, { kernel: "lanczos3" }).png(png).toFile(pub("icons/icon-512.png"));
await mark().resize(192, 192).png(png).toFile(pub("icons/icon-192.png"));
await mark()
  .resize(380, 380)
  .extend({ top: 66, bottom: 66, left: 66, right: 66, background: "#eaf6fd" })
  .png(png)
  .toFile(pub("icons/icon-maskable-512.png"));
await mark().resize(180, 180).png(png).toFile(path.join(root, "app/apple-icon.png"));
await mark().resize(96, 96).png(png).toFile(path.join(root, "app/icon.png"));

const size = (p) => `${p} ${Math.round(fs.statSync(pub(p)).size / 1024)} KB`;
console.log(["og/rescuen.jpg", "icons/icon-512.png", "icons/icon-192.png", "icons/icon-maskable-512.png"].map(size).join("\n"));
