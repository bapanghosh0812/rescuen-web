"use client";

import { useEffect } from "react";
import { setLang } from "@/components/i18n/store";
import type { LangId } from "@/lib/i18n/languages";

/** Opening a page written in one language sets the rest of the site to it. */
export default function SetLang({ id }: { id: LangId }) {
  useEffect(() => setLang(id), [id]);
  return null;
}
