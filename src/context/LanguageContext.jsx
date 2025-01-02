import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
    en: {
      welcome: "Welcome",
      language: "Language",
    },
    jp: {
      welcome: "ようこそ",
      language: "言語",
    },
  };
  
  export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");
  
    const switchLanguage = (newLanguage) => setLanguage(newLanguage);
  
    const translate = (key) => translations[language][key] || key;
  
    return (
      <LanguageContext.Provider value={{ language, switchLanguage, translate }}>
        {children}
      </LanguageContext.Provider>
    );
  };
  
export const useLanguage = () => useContext(LanguageContext);
