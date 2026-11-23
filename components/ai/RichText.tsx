import type { ReactNode } from "react";
import Link from "next/link";

// Renders assistant text as React elements only. No HTML is ever injected, and
// links are limited to this site and a short list of official hosts.

const HOSTS = new Set(["play.google.com", "www.instagram.com", "whatsapp.com", "cybercrime.gov.in", "www.cybercrime.gov.in"]);

export function safeHref(href: string): { href: string; external: boolean } | null {
  if (/^\/(?![/\\])[\w\-/#?=&.]*$/.test(href) || /^#[\w-]+$/.test(href)) return { href, external: false };
  if (/^(tel:\+?\d{3,15}|mailto:[\w.+-]+@[\w.-]+)$/.test(href)) return { href, external: false };
  try {
    const url = new URL(href);
    if (url.protocol === "https:" && HOSTS.has(url.hostname)) return { href: url.toString(), external: true };
  } catch {
    return null;
  }
  return null;
}

const TOKEN = /(\*\*[^*\n]+\*\*|\[[^\]\n]{1,80}\]\([^)\s]{1,300}\))/g;

function inline(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const ok = safeHref(link[2]);
      if (!ok) return link[1];
      const cls = "font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand";
      return ok.external ? (
        <a key={i} href={ok.href} target="_blank" rel="noopener noreferrer nofollow" className={cls}>
          {link[1]}
        </a>
      ) : (
        <Link key={i} href={ok.href} className={cls}>
          {link[1]}
        </Link>
      );
    }
    return part;
  });
}

const UL = /^\s*[-*•]\s+/;
const OL = /^\s*\d{1,2}[.)]\s+/;

export default function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let items: string[] = [];
  let kind: "ul" | "ol" | null = null;

  const flush = () => {
    if (!kind) return;
    const Tag = kind;
    blocks.push(
      <Tag key={blocks.length} className={`${kind === "ul" ? "list-disc" : "list-decimal"} space-y-1 pl-5 marker:text-brand/60`}>
        {items.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </Tag>
    );
    items = [];
    kind = null;
  };

  for (const raw of text.split("\n")) {
    const row = raw.trimEnd();
    const next = UL.test(row) ? "ul" : OL.test(row) ? "ol" : null;
    if (next) {
      if (kind !== next) flush();
      kind = next;
      items.push(row.replace(next === "ul" ? UL : OL, ""));
    } else {
      flush();
      const plain = row.replace(/^#+\s*/, "");
      if (plain.trim()) blocks.push(<p key={blocks.length}>{inline(plain)}</p>);
    }
  }
  flush();
  return <div className="space-y-2">{blocks}</div>;
}
