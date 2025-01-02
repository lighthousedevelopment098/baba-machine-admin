import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useLanguage } from "../../../context/LanguageContext";
import { getAuthData } from "../../../utils/authHelper";

const Header = ({ handleLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    console.log("Before Toggle", isDropdownOpen);
    setIsDropdownOpen(prev => !prev);
    console.log("After Toggle", isDropdownOpen);
  };

  
  
  
  const { language, switchLanguage, translate } = useLanguage();

  const handleLanguageChange = (lang) => {
    if (lang !== language) {
      switchLanguage(lang);
      // toast.info(`${translate("language")} switched to ${lang === "en" ? "English" : "日本語"}`);
    }
  };
  
  

  
  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <>
      <ToastContainer />
      <header className="header flex items-center justify-between py-2 px-6 shadow fixed top-0 left-0 right-0 bg-white z-50">
        <div>
          <img src="/logo.png" alt="Logo" className="md:h-12 h-8" />
        </div>
        <div className="flex items-center space-x-4">
          {/* Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              className="flex items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <span className="ml-2 font-medium uppercase">
                {getAuthData()?.user?.role?.name || "Employee"}
              </span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg z-50">
                <div className="p-4">
                  <h1 className="font-bold">{getAuthData()?.user?.name}</h1>
                  <h2 className="text-sm text-gray-500">
                    {getAuthData()?.user?.email || "example@email.com"}
                  </h2>
                </div>
                <Link to="/profileinformation" className="block px-4 py-2 hover:bg-gray-100">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="en">English</option>
            <option value="jp">日本語</option>
          </select>
        </div>
      </header>
    </>
  );
};

export default Header;
