// ==========================================
// Language Context - React Integration
// ==========================================
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { LanguageCode, TranslationKeys } from "./types";
import {
  translations,
  getSavedLanguage,
  saveLanguage,
  DEFAULT_LANGUAGE,
} from "./index";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] =
    useState<LanguageCode>(getSavedLanguage());

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    saveLanguage(lang);
  }, []);

  const t = useCallback(
    (key: keyof TranslationKeys): string => {
      return (
        translations[language]?.[key] ||
        translations[DEFAULT_LANGUAGE][key] ||
        key
      );
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
