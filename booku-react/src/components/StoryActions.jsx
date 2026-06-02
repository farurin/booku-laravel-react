import React from "react";
import { useLanguage } from "../context/LanguageContext";

const IconHeartOutline = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconHeartSolid = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
const IconFullscreen = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);
const IconBookmarkOutline = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const IconBookmarkSolid = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
  </svg>
);

const StoryActions = ({
  isFavorite = false,
  isSaved = false,
  onToggleFavorite,
  onToggleFullscreen,
  onToggleSave,
  isActionLoading = false, // STATE BARU
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 my-10">
      <button
        onClick={onToggleFavorite}
        disabled={isActionLoading}
        className={`flex items-center gap-2 px-6 md:px-8 py-3.5 rounded-2xl font-black transition-all duration-300 shadow-sm hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed ${
          isFavorite
            ? "bg-pink-100 text-pink-600 border-2 border-pink-300"
            : "bg-white text-gray-600 border-2 border-gray-100 hover:border-booku-coral hover:text-booku-coral"
        }`}
      >
        {isFavorite ? <IconHeartSolid /> : <IconHeartOutline />}
        <span className="text-sm md:text-base tracking-wide">
          {t("sa_favorite")}
        </span>
      </button>

      <button
        onClick={onToggleFullscreen}
        disabled={isActionLoading}
        className="flex items-center gap-2 px-6 md:px-8 py-3.5 bg-booku-cyan text-gray-900 border-2 border-booku-cyan rounded-2xl font-black hover:bg-white hover:text-booku-cyan hover:-translate-y-1 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IconFullscreen />
        <span className="text-sm md:text-base tracking-wide">
          {t("sa_fullscreen")}
        </span>
      </button>

      <button
        onClick={onToggleSave}
        disabled={isActionLoading}
        className={`flex items-center gap-2 px-6 md:px-8 py-3.5 rounded-2xl font-black transition-all duration-300 shadow-sm hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed ${
          isSaved
            ? "bg-booku-yellow text-gray-900 border-2 border-booku-yellow"
            : "bg-white text-gray-600 border-2 border-gray-100 hover:border-booku-yellow hover:text-gray-800"
        }`}
      >
        {isSaved ? <IconBookmarkSolid /> : <IconBookmarkOutline />}
        <span className="text-sm md:text-base tracking-wide">
          {t("sa_save")}
        </span>
      </button>
    </div>
  );
};

export default StoryActions;
