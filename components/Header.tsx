"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  MoreVertical,
  Smartphone,
  ShieldCheck,
  ArrowUpRight,
  LogIn,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { NAV, MENU_LINKS, SITE } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        {/* Brand */}
        <Link href="/#home" className="group flex items-center gap-2.5" aria-label="RESCUEN home">
          <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-line">
            <Image src="/rescuen-logo.png" alt="RESCUEN logo" width={30} height={30} className="object-contain" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            RESCU<span className="text-brand">EN</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3.5 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-mist hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost hidden px-4 py-2.5 text-sm sm:inline-flex">
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
          <a
            href={SITE.appStoreUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary hidden px-5 py-2.5 text-sm md:inline-flex"
          >
            <Smartphone className="h-4 w-4" />
            Get the App
          </a>

          {/* 3-dot menu — the app & more live here */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="More"
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink shadow-soft transition-colors hover:bg-mist"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-lift"
                >
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                    RESCUEN
                  </div>
                  {MENU_LINKS.map((l) => {
                    const external = l.href.startsWith("http");
                    return (
                      <Link
                        key={l.label}
                        href={l.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-mist hover:text-ink"
                      >
                        {l.label}
                        {external ? (
                          <ArrowUpRight className="h-4 w-4 text-ink-faint" />
                        ) : null}
                      </Link>
                    );
                  })}
                  {/* Social icons */}
                  <div className="mt-1 flex items-center gap-2 px-1">
                    <a
                      href={SITE.instagram}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMenuOpen(false)}
                      aria-label="RESCUEN on Instagram"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-white py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-brand/30 hover:text-brand"
                    >
                      <Instagram className="h-4 w-4" /> Instagram
                    </a>
                    <a
                      href={SITE.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMenuOpen(false)}
                      aria-label="RESCUEN WhatsApp channel"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-white py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-safe/40 hover:text-safe-600"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  </div>
                  <div className="mt-2 flex items-center gap-2 rounded-xl bg-mist px-3 py-2 text-xs text-ink-faint">
                    <ShieldCheck className="h-4 w-4 text-brand" />
                    Encrypted &amp; privacy-first
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink shadow-soft lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-semibold text-ink-soft hover:bg-mist"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-ghost flex-1">
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
                <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-primary flex-1">
                  <Smartphone className="h-4 w-4" /> Get the App
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
