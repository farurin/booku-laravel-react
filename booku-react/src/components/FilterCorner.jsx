import React from "react";
import { useLanguage } from "../context/LanguageContext";

// Icon SVG
const IconHistory = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);
const IconLove = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconSave = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9ca3af"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const FilterCorner = ({ activeFilter, onChangeFilter, onSearch }) => {
  const { t } = useLanguage();

  const filters = [
    {
      key: "riwayat",
      label: t("fc_history"),
      icon: IconHistory,
      color: "bg-booku-cyan text-gray-800",
    },
    {
      key: "favorit",
      label: t("fc_favorite"),
      icon: IconLove,
      color: "bg-booku-coral text-white",
    },
    {
      key: "disimpan",
      label: t("fc_saved"),
      icon: IconSave,
      color: "bg-booku-yellow text-gray-800",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-12 mb-8 flex flex-col lg:flex-row items-center justify-between gap-8">
      {/* Button Filter - Berubah jadi Kotak Besar (Tiles) */}
      <div className="flex gap-3 md:gap-5 w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x">
        {filters.map(({ key, label, icon: IconComponent, color }) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => onChangeFilter(key)}
              className={`snap-center shrink-0 flex flex-col items-center justify-center gap-3 w-28 h-28 md:w-32 md:h-32 rounded-3xl font-black transition-all duration-300 focus:outline-none border-4 
                ${isActive ? `${color} border-white shadow-xl scale-105 -translate-y-2` : "bg-white text-gray-400 border-transparent shadow-sm hover:bg-booku-cream/50"}
              `}
            >
              <div className="scale-125 md:scale-150 mb-1">
                <IconComponent className={isActive ? "" : "text-gray-300"} />
              </div>
              <span className="text-sm tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar - Dibuat melayang */}
      <div className="relative w-full lg:w-[400px] shrink-0">
        <div className="absolute -inset-1 bg-gradient-to-r from-booku-cyan to-booku-coral rounded-full blur opacity-20"></div>
        <input
          type="text"
          placeholder={t("fc_search")}
          onChange={(e) => onSearch(e.target.value)}
          className="relative w-full pl-14 pr-6 py-4 rounded-full border-none focus:outline-none focus:ring-4 focus:ring-booku-yellow text-base text-gray-800 font-medium placeholder-gray-400 shadow-lg bg-white"
        />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 scale-125">
          <IconSearch />
        </div>
      </div>
    </div>
  );
};

export default FilterCorner;
