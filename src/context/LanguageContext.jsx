import { createContext, useContext, useState, useCallback } from "react";
import { translations } from "../config/translations.js";

const LanguageContext = createContext(null);

// Provides the current language and a t() translation function to the app.
// Default language is Telugu ("te").
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("te");

  const t = useCallback(
    (key) => {
      return translations[lang]?.[key] ?? translations.en[key] ?? key;
    },
    [lang]
  );

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "te" ? "en" : "te"));
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
