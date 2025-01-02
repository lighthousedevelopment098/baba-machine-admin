import { useEffect, useState } from "react";

const languageData = {
  en: {
    welcome: "Welcome",
    logout: "Logout",
    setting: "Setting",
    profile: "Profile",
  },
  jp: {
    welcome: "ようこそ",
    logout: "ログアウト",
    setting: "設定",
    profile: "プロフィール",
  },
};

// React-friendly state for language
let listeners = [];
let currentLanguage = "en";

export const setLanguage = (lang) => {
  currentLanguage = lang;
  listeners.forEach((listener) => listener(lang));
};

export const getLanguage = () => currentLanguage;

export const translate = (key) => languageData[currentLanguage][key] || key;

export const useLanguage = () => {
  const [language, setLangState] = useState(currentLanguage);

  const updateLanguage = (lang) => setLangState(lang);

  useEffect(() => {
    listeners.push(updateLanguage);
    return () => {
      listeners = listeners.filter((listener) => listener !== updateLanguage);
    };
  }, []);

  return [language, setLanguage];
};
