"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, HeartHandshake, Instagram, LogIn, Menu, MessageCircle, MoreVertical, Search, Smartphone, X } from "lucide-react";
import LanguageMenu from "@/components/i18n/LanguageMenu";
import { useProfile } from "@/lib/profile";
import { MENU_LINKS, NAV, SITE } from "@/lib/site";

const openSearch = () => window.dispatchEvent(new Event("rescuen:search"));

export default function Header() {
  const path = usePathname();
  const profile = useProfile();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobile(false);
    setMenu(false);
  }, [path]);

  useEffect(() => {
    if (!menu && !mobile) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(false);
      setMobile(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu, mobile]);

  // Pages with a dark top need light text until the bar turns to glass.
  const onDark = path === "/ai" && !scrolled && !mobile;
  const square = `grid h-10 w-10 place-items-center rounded-xl border transition-colors ${
    onDark ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "border-line bg-white text-ink shadow-soft hover:bg-mist"
  }`;

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobile ? "glass shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-2 sm:gap-3">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5" aria-label="RESCUEN home">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-line max-[359px]:h-9 max-[359px]:w-9">
            <Image src="/rescuen-logo.png" alt="" width={30} height={30} className="object-contain" priority />
          </span>
          <span data-no-translate className={`font-display text-xl font-extrabold tracking-tight max-[359px]:text-lg ${onDark ? "text-white" : "text-ink"}`}>
            RESCU<span className={onDark ? "text-gold-400" : "text-brand"}>EN</span>
          </span>
        </Link>

        <nav aria-label="Main" className="site-nav hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={path === item.href ? "page" : undefined}
              className={`whitespace-nowrap rounded-xl px-2 py-2 text-sm font-semibold transition-colors xl:px-3.5 ${
                onDark
                  ? "text-white/75 hover:bg-white/10 hover:text-white"
                  : "text-ink-soft hover:bg-mist hover:text-ink aria-[current=page]:text-brand"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            className={`site-search hidden h-10 items-center gap-2 rounded-xl border px-3 text-sm transition-colors xl:flex ${
              onDark ? "border-white/20 bg-white/10 text-white/70 hover:bg-white/20" : "border-line bg-white text-ink-faint shadow-soft hover:bg-mist"
            }`}
          >
            <Search className="h-4 w-4" aria-hidden="true" /> Search
            <kbd aria-hidden="true" className={`rounded-md border px-1.5 text-[10px] font-semibold ${onDark ? "border-white/25 text-white/80" : "border-line text-ink-soft"}`}>Ctrl K</kbd>
          </button>
          <button type="button" onClick={openSearch} aria-label="Search or ask" className={`${square} site-search-icon xl:hidden`}>
            <Search className="h-[18px] w-[18px]" />
          </button>
          <LanguageMenu className={square} />
          {profile && (
            <Link
              href="/login"
              aria-label="Your profile"
              data-no-translate
              className="hidden h-10 w-10 place-items-center rounded-xl bg-brand-gradient font-display text-sm font-extrabold text-white shadow-soft sm:grid"
            >
              {[...profile.name][0]?.toUpperCase()}
            </Link>
          )}
          <Link href="/donate" className="btn-gold hidden whitespace-nowrap px-4 py-2.5 text-xs font-extrabold md:inline-flex">
            <HeartHandshake className="h-4 w-4 lg:hidden xl:block" aria-hidden="true" /> Support
          </Link>
          <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-primary hidden whitespace-nowrap px-4 py-2.5 text-sm sm:inline-flex xl:px-5">
            <Smartphone className="h-4 w-4 lg:hidden xl:block" aria-hidden="true" /> Get the app
          </a>

          <div className="site-more relative hidden lg:block" ref={menuRef}>
            <button type="button" onClick={() => setMenu((v) => !v)} aria-label="More" aria-expanded={menu} className={square}>
              <MoreVertical className="h-5 w-5" />
            </button>
            {menu && (
              <div className="menu-pop absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-lift">
                <Link href="/login" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-mist hover:text-ink">
                  <LogIn className="h-4 w-4" aria-hidden="true" /> {profile ? "Your profile" : "Sign in"}
                </Link>
                {MENU_LINKS.map((l) => {
                  const external = l.href.startsWith("http");
                  return (
                    <Link
                      key={l.label}
                      href={l.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      onClick={() => setMenu(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-mist hover:text-ink"
                    >
                      {l.label}
                      {external && <ArrowUpRight className="h-4 w-4 text-ink-faint" aria-hidden="true" />}
                    </Link>
                  );
                })}
                <div className="mt-1 flex items-center gap-2 border-t border-line px-1 pt-2">
                  <a href={SITE.instagram} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line py-2 text-xs font-semibold text-ink-soft hover:border-brand/30 hover:text-brand">
                    <Instagram className="h-4 w-4" aria-hidden="true" /> Instagram
                  </a>
                  <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line py-2 text-xs font-semibold text-ink-soft hover:border-safe/40 hover:text-safe-600">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          <button type="button" onClick={() => setMobile((v) => !v)} aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile} className={`${square} site-burger lg:hidden`}>
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobile && (
        <div className="site-panel menu-pop max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-white lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {[...NAV, ...MENU_LINKS.slice(1)].map((item, i) => (
              <Link
                key={`${item.href}${i}`}
                href={item.href}
                onClick={() => setMobile(false)}
                className="rounded-xl px-3 py-3 text-base font-semibold text-ink-soft hover:bg-mist"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/donate" onClick={() => setMobile(false)} className="rounded-xl bg-gold-100/80 px-3 py-3 text-base font-extrabold text-gold-600">
              Support the mission
            </Link>
            <p className="px-3 pb-1 pt-4 text-xs font-bold text-ink-faint">Language</p>
            <LanguageMenu inline />
            <div className="mt-4 flex gap-2">
              <Link href="/login" className="btn-ghost flex-1">
                <LogIn className="h-4 w-4" aria-hidden="true" /> {profile ? "Your profile" : "Sign in"}
              </Link>
              <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-primary flex-1">
                <Smartphone className="h-4 w-4" aria-hidden="true" /> Get the app
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
