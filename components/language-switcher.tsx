"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setLocale(locale === "en" ? "fr" : "en")}
      aria-label={
        locale === "en" ? "Switch language to French" : "Passer en anglais"
      }
      className="gap-2 font-semibold tracking-wide"
    >
      <Languages aria-hidden="true" />
      <span>{locale.toUpperCase()}</span>
    </Button>
  );
}
