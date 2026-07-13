"use client";

import { useLanguage } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as "en" | "fr")}
      className="h-7 rounded-lg border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      title="Language"
    >
      <option value="en">EN</option>
      <option value="fr">FR</option>
    </select>
  );
}
