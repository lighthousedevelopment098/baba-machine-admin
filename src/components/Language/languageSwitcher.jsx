import React from "react";
import { useLanguage } from "../../../../../../contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, switchLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-4">
      <span>Current Language: {language.toUpperCase()}</span>
      <button
        onClick={() => switchLanguage("en")}
        className={`p-2 rounded ${language === "en" ? "bg-green-400" : "bg-gray-200"}`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage("jp")}
        className={`p-2 rounded ${language === "jp" ? "bg-green-400" : "bg-gray-200"}`}
      >
        JP
      </button>
    </div>
  );
};

export default LanguageSwitcher;
