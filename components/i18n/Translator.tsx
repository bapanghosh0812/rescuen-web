"use client";

import { useEffect } from "react";
import { getLang, onLang } from "@/components/i18n/store";
import { localeOf, type LangId } from "@/lib/i18n/languages";

// Swaps the words on the page for the chosen language. Only the text inside
// existing nodes changes, never the structure, so the page keeps working
// exactly as built. Anything without a translation simply stays in English.

type Dict = Record<string, string>;

const LOAD: Record<Exclude<LangId, "en">, () => Promise<{ default: Dict }>> = {
  hi: () => import("@/lib/i18n/hi.json"),
  bn: () => import("@/lib/i18n/bn.json"),
  mr: () => import("@/lib/i18n/mr.json"),
  ta: () => import("@/lib/i18n/ta.json"),
  te: () => import("@/lib/i18n/te.json"),
};

const SKIP = "script,style,noscript,textarea,code,kbd,[data-no-translate]";
const UNIT = "p,h1,h2,h3,h4,h5,h6,li,button,a,summary,label,blockquote,figcaption,dt,dd,td,th,option";
const ATTRS = ["placeholder", "aria-label", "title", "alt"] as const;
const LETTER = /\p{L}/u;

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

type Memory = { src: string; out: string };
const texts = new WeakMap<Text, Memory>();
const attrs = new WeakMap<Element, Partial<Record<(typeof ATTRS)[number], Memory>>>();

/** The English words of a node, even after it has been translated. */
function sourceOf(node: Text) {
  const m = texts.get(node);
  return m && node.data === m.out ? m.src : node.data;
}

function write(node: Text, src: string, value: string) {
  const lead = src.match(/^\s*/)![0];
  const tail = src.match(/\s*$/)![0];
  const out = value === src ? src : lead + value + tail;
  texts.set(node, { src, out });
  if (node.data !== out) node.data = out;
}

function translateTree(root: Node, dict: Dict | null) {
  const start = root instanceof Element ? root : root.parentElement;
  if (!start || start.closest(SKIP)) return;

  const groups = new Map<Element, Text[]>();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(n) {
      if (n instanceof Element) return n.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
      return LETTER.test((n as Text).data) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  const add = (t: Text) => {
    const unit = t.parentElement?.closest(UNIT) || t.parentElement;
    if (!unit) return;
    const list = groups.get(unit);
    if (list) list.push(t);
    else groups.set(unit, [t]);
  };
  if (root instanceof Text && LETTER.test(root.data)) add(root);
  else for (let n = walker.nextNode(); n; n = walker.nextNode()) add(n as Text);

  for (const nodes of groups.values()) {
    const sources = nodes.map(sourceOf);
    // A sentence broken up by a highlight is translated as one, part by part.
    const whole = nodes.length > 1 && dict ? dict[norm(sources.join(" "))] : undefined;
    const parts = whole?.split("|");
    nodes.forEach((node, i) => {
      const src = sources[i];
      const value = dict ? (parts?.length === nodes.length ? parts[i] : dict[norm(src)]) : undefined;
      write(node, src, value ?? src);
    });
  }

  const scope = root instanceof Element ? root : null;
  if (!scope) return;
  const selector = ATTRS.map((a) => `[${a}]`).join(",");
  for (const el of [...(scope.matches(selector) ? [scope] : []), ...scope.querySelectorAll(selector)]) {
    if (el.closest("[data-no-translate]")) continue;
    const memory = attrs.get(el) || {};
    for (const a of ATTRS) {
      const now = el.getAttribute(a);
      if (!now) continue;
      const m = memory[a];
      const src = m && now === m.out ? m.src : now;
      const out = dict?.[norm(src)] ?? src;
      memory[a] = { src, out };
      if (now !== out) el.setAttribute(a, out);
    }
    attrs.set(el, memory);
  }
}

/** Lets a browser's own page translation move nodes without breaking the page. */
function tolerateOtherTranslators() {
  const w = window as unknown as { __rescuenSafeDom?: boolean };
  if (w.__rescuenSafeDom) return;
  w.__rescuenSafeDom = true;
  const remove = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    return child.parentNode === this ? (remove.call(this, child) as T) : child;
  };
  const insert = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    return (ref && ref.parentNode !== this ? insert.call(this, node, null) : insert.call(this, node, ref)) as T;
  };
}

export default function Translator() {
  useEffect(() => {
    tolerateOtherTranslators();
    let dict: Dict | null = null;
    let wanted: LangId = "en";
    let frame = 0;
    let observer: MutationObserver | null = null;
    const pending = new Set<Node>();
    const titles: Memory = { src: "", out: "" };

    const setTitle = () => {
      const src = document.title === titles.out ? titles.src : document.title;
      const out = dict?.[norm(src)] ?? src;
      titles.src = src;
      titles.out = out;
      if (document.title !== out) document.title = out;
    };

    const flush = () => {
      frame = 0;
      const roots = [...pending];
      pending.clear();
      for (const r of roots) if (r.isConnected) translateTree(r, dict);
      setTitle();
    };
    const queue = (n: Node) => {
      pending.add(n);
      frame ||= requestAnimationFrame(flush);
    };

    const watch = () => {
      observer ??= new MutationObserver((records) => {
        for (const r of records) {
          if (r.type === "characterData") {
            const t = r.target as Text;
            if (texts.get(t)?.out !== t.data) queue(t.parentElement?.closest(UNIT) || t);
          } else if (r.type === "attributes") {
            const el = r.target as Element;
            const a = r.attributeName as (typeof ATTRS)[number];
            if (attrs.get(el)?.[a]?.out !== el.getAttribute(a)) queue(el);
          } else {
            r.addedNodes.forEach((n) => queue(n instanceof Element ? n : n.parentElement?.closest(UNIT) || n));
          }
        }
      });
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: [...ATTRS],
      });
    };

    const apply = async (id: LangId) => {
      wanted = id;
      if (id === "en") {
        if (dict) {
          dict = null;
          translateTree(document.body, null);
          setTitle();
        }
        observer?.disconnect();
      } else {
        try {
          const loaded = (await LOAD[id]()).default;
          if (wanted !== id) return;
          dict = loaded;
        } catch {
          return; // offline: stay in the current language
        }
        translateTree(document.body, dict);
        setTitle();
        watch();
      }
      document.documentElement.lang = localeOf(id);
    };

    void apply(getLang());
    const off = onLang((id) => void apply(id));
    return () => {
      off();
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
