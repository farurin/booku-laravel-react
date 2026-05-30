import React, { useState, useRef, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
// Ganti nama import dan file aset logo kamu
import LogoBookU from "../assets/logo-booku.png";

const IconProfile = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 14 14"
  >
    <g fill="none" fillRule="evenodd" clipRule="evenodd">
      <path
        fill="#fff"
        d="M1.573 1.573A.25.25 0 0 1 1.75 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5A1.75 1.75 0 0 0 0 1.75v1.5a.75.75 0 0 0 1.5 0v-1.5a.25.25 0 0 1 .073-.177M14 10.75a.75.75 0 0 0-1.5 0v1.5a.25.25 0 0 1-.25.25h-1.5a.75.75 0 0 0 0 1.5h1.5A1.75 1.75 0 0 0 14 12.25zM.75 10a.75.75 0 0 1 .75.75v1.5a.25.25 0 0 0 .25.25h1.5a.75.75 0 0 1 0 1.5h-1.5A1.75 1.75 0 0 1 0 12.25v-1.5A.75.75 0 0 1 .75 10m10-10a.75.75 0 0 0 0 1.5h1.5a.25.25 0 0 1 .25.25v1.5a.75.75 0 0 0 1.5 0v-1.5A1.75 1.75 0 0 0 12.25 0z"
      />
      <path
        fill="#fff7f7"
        d="M9.208 4.46a2.21 2.21 0 1 1-4.421 0a2.21 2.21 0 0 1 4.421 0m-6.353 6.195a4.423 4.423 0 0 1 8.288 0c.112.299-.126.595-.446.595H3.301c-.32 0-.558-.296-.446-.595"
      />
    </g>
  </svg>
);
const IconLanguage = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M8.125 21.213q-1.825-.788-3.187-2.15t-2.15-3.188T2 11.988t.788-3.875t2.15-3.175t3.187-2.15T12.013 2t3.875.788t3.175 2.15t2.15 3.175t.787 3.875t-.787 3.887t-2.15 3.188t-3.175 2.15t-3.875.787t-3.888-.787M12 19.95q.65-.9 1.125-1.875T13.9 16h-3.8q.3 1.1.775 2.075T12 19.95m-2.6-.4q-.45-.825-.787-1.713T8.05 16H5.1q.725 1.25 1.813 2.175T9.4 19.55m5.2 0q1.4-.45 2.488-1.375T18.9 16h-2.95q-.225.95-.562 1.838T14.6 19.55M4.25 14h3.4q-.075-.5-.112-.987T7.5 12t.038-1.012T7.65 10h-3.4q-.125.5-.187.988T4 12t.063 1.013t.187.987m5.4 0h4.7q.075-.5.113-.987T14.5 12t-.038-1.012T14.35 10h-4.7q-.075.5-.112.988T9.5 12t.038 1.013t.112.987m6.7 0h3.4q.125-.5.188-.987T20 12t-.062-1.012T19.75 10h-3.4q.075.5.113.988T16.5 12t-.038 1.013t-.112.987m-.4-6h2.95q-.725-1.25-1.812-2.175T14.6 4.45q.45.825.788 1.713T15.95 8M10.1 8h3.8q-.3-1.1-.775-2.075T12 4.05q-.65.9-1.125 1.875T10.1 8m-5 0h2.95q.225-.95.563-1.838T9.4 4.45Q8 4.9 6.912 5.825T5.1 8"
    />
  </svg>
);
const IconSignUp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);
const IconFlagID = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
    <path d="M512 256A256 256 0 0 0 0 256h512z" fill="#d80027" />
  </svg>
);
const IconFlagEN = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath id="uk-clip">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
    </defs>
    <g clipPath="url(#uk-clip)">
      <rect width="512" height="512" fill="#012169" />
      <path d="M0 0l512 512m0-512L0 512" stroke="#fff" strokeWidth="120" />
      <path d="M0 0l512 512m0-512L0 512" stroke="#c8102e" strokeWidth="80" />
      <path d="M256 0v512m-256-256h512" stroke="#fff" strokeWidth="160" />
      <path d="M256 0v512m-256-256h512" stroke="#c8102e" strokeWidth="100" />
    </g>
  </svg>
);

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    end={to === "/"}
    className={({ isActive }) =>
      `block xl:text-[18px] lg:text-[16px] md:text-[14px] text-base px-5 py-2.5 rounded-full transition-all whitespace-nowrap font-bold ${
        isActive
          ? "bg-booku-cyan text-gray-800 shadow-sm"
          : "text-gray-600 hover:text-gray-900 hover:bg-booku-cream/50"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Navigation() {
  const { isLoggedIn } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mengubah daftar navigasi: Hapus Categories, Tambah About Us
  const navLinks = [
    { to: "/", label: t("nav_home") },
    { to: "/corner", label: t("nav_corner") },
    { to: "/about", label: t("nav_about") },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full shadow-sm sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-booku-cream">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <Navbar fluid className="bg-transparent! p-0!">
          <NavbarBrand as="div" className="cursor-default py-4">
            <img src={LogoBookU} alt="Logo BookU" className="h-8 md:h-10" />
          </NavbarBrand>

          <div className="flex items-center gap-2 md:gap-3 md:order-2 py-3">
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center bg-booku-coral hover:bg-orange-500 text-white font-bold rounded-full px-4 py-2 md:px-5 md:py-2.5 gap-2 transition shadow-sm whitespace-nowrap"
              >
                <IconProfile />
                <span className="hidden md:inline text-sm lg:text-base">
                  {t("nav_profile")}
                </span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="flex items-center bg-booku-coral hover:bg-orange-500 text-white font-bold rounded-full px-4 py-2 md:px-5 md:py-2.5 gap-2 transition shadow-sm whitespace-nowrap"
              >
                <IconSignUp />
                <span className="hidden md:inline text-sm lg:text-base">
                  {t("nav_signup")}
                </span>
              </Link>
            )}

            <div className="flex relative z-50" ref={dropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center bg-booku-yellow hover:brightness-95 text-gray-800 font-bold rounded-full px-3 md:px-4 py-2 md:py-2.5 gap-1 transition shadow-sm cursor-pointer shrink-0"
              >
                <IconLanguage />
                <span className="tracking-wide hidden xl:inline text-base">
                  {language === "id" ? "Indonesia" : "English"}
                </span>
                <span className="tracking-wide xl:hidden text-sm">
                  {language === "id" ? "ID" : "EN"}
                </span>
                <svg
                  className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {isLangOpen && (
                <div className="absolute top-[120%] right-0 min-w-36 md:min-w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col animate-fade-in">
                  <button
                    onClick={() => {
                      changeLanguage("id");
                      setIsLangOpen(false);
                    }}
                    className="flex items-center gap-3 hover:bg-booku-cream px-4 py-3 text-gray-800 font-bold text-sm transition-colors text-left"
                  >
                    <IconFlagID /> Indonesia
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage("en");
                      setIsLangOpen(false);
                    }}
                    className="flex items-center gap-3 hover:bg-booku-cream px-4 py-3 text-gray-800 font-bold text-sm transition-colors text-left"
                  >
                    <IconFlagEN /> English
                  </button>
                </div>
              )}
            </div>
            <NavbarToggle />
          </div>

          <NavbarCollapse className="md:flex md:items-center bg-white/95 backdrop-blur-md md:bg-transparent px-2 md:p-0 rounded-xl shadow-sm md:shadow-none border md:border-none border-gray-100 pb-4 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center md:h-full gap-2 md:gap-4 lg:gap-6 pt-2 md:pt-0">
              {navLinks.map(({ to, label }) => (
                <NavItem key={to} to={to}>
                  {label}
                </NavItem>
              ))}
            </div>
          </NavbarCollapse>
        </Navbar>
      </div>
    </header>
  );
}
