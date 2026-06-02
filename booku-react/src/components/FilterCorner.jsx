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
    strokeWidth="2.5"
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
      color: "bg-booku-cyan text-gray-900",
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
      color: "bg-booku-yellow text-gray-900",
    },
  ];

  return (
    // Layer Luar: Full-Bleed Section
    <section className="w-full my-8">
      {/* Layer Dalam: Constrained Content */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Button Filter */}
        <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100 flex w-full lg:w-auto overflow-x-auto scrollbar-hide">
          {filters.map(({ key, label, icon: IconComponent, color }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => onChangeFilter(key)}
                className={`flex items-center gap-2.5 px-6 py-3 md:py-3.5 rounded-full font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? `${color} shadow-md`
                    : "text-gray-500 hover:bg-booku-cream/50"
                }`}
              >
                <IconComponent className={isActive ? "" : "opacity-60"} />
                <span className="text-sm md:text-base tracking-wide">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-87.5 shrink-0">
          <input
            type="text"
            placeholder={t("fc_search")}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 md:py-4 rounded-full border-2 border-white focus:outline-none focus:border-booku-cyan text-base text-gray-800 font-medium placeholder-gray-400 shadow-sm bg-white transition-colors"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
            <IconSearch />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterCorner;
