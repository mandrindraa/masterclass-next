"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Locale = "en" | "fr";

const translations = {
  en: {
    signOut: "Sign out",
    profile: "Profile",
    navigation: "Navigation",
  },
  fr: {
    signOut: "Déconnexion",
    profile: "Profil",
    navigation: "Navigation",
  },
} as const;

type TranslationKey = keyof (typeof translations)["en"];

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}>({
  locale: "en",
  setLocale: () => {},
  t: (key) => translations.en[key],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored === "en" || stored === "fr") setLocaleState(stored);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }

  function t(key: TranslationKey) {
    return translations[locale][key];
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
