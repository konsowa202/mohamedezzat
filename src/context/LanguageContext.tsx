"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Language } from "@/i18n/translations";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("preferred-language") as Language | null;
    if (saved === "en" || saved === "ar") {
      setLanguage(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang: Language = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    localStorage.setItem("preferred-language", newLang);
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
