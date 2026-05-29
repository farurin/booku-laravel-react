import React, { createContext, useState, useContext, useEffect } from "react";
import { translations } from "../utils/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("storyland_lang") || "id";
  });

  useEffect(() => {
    localStorage.setItem("storyland_lang", language);
  }, [language]);

  // Fungsi spesifik untuk Dropdown
  const changeLanguage = (langCode) => {
    setLanguage(langCode);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
