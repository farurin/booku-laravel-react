import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { getImageUrl } from "../utils/getImageUrl";

const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconBookmark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
  </svg>
);

const timeAgo = (dateString, t) => {
  if (!dateString) return t("sc_just_now");
  const date = new Date(dateString);
  const now = new Date();
  const timeDifference = now.getTime() - date.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) return t("sc_just_now");
  if (minutes < 60) return `${minutes} ${t("sc_mins_ago")}`;
  if (hours < 24) return `${hours} ${t("sc_hours_ago")}`;
  if (days === 1) return t("sc_yesterday");
  if (days < 30) return `${days} ${t("sc_days_ago")}`;
  if (months < 12) return `${months} ${t("sc_months_ago")}`;
  return `${years} ${t("sc_years_ago")}`;
};

const SavedCard = ({ book }) => {
  const location = useLocation();
  const { t, language } = useLanguage();
  if (!book) return null;

  const timeSavedText = timeAgo(book.saved_at, t);
  const categoryName =
    language === "en" && book.category_name_en
      ? book.category_name_en
      : book.category_name_id;
  const bookTitle =
    language === "en" && book.title_en ? book.title_en : book.title_id;
  const coverUrl =
    language === "en"
      ? book?.image_en || book?.image_id || book?.image
      : book?.image_id || book?.image_en || book?.image;

  return (
    <div className="w-full bg-white rounded-2xl p-4 flex gap-5 transition-transform hover:-translate-y-1 shadow-sm hover:shadow-lg border-l-8 border-l-booku-yellow border-y border-r border-gray-100 group relative">
      <div className="w-24 md:w-32 shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-inner bg-booku-cream">
        <img
          src={getImageUrl(coverUrl)}
          alt={bookTitle || "Cover"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/150x220?text=Cover";
          }}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 py-2">
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-2 truncate">
            {bookTitle}
          </h3>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm font-bold mb-3">
            <span className="bg-booku-cream px-3 py-1 rounded-full text-gray-700">
              {categoryName || t("sc_category")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 font-medium">
              {book.views_count || 0} {t("sc_times")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <IconClock /> 5min
            </span>
            <span className="text-gray-200">•</span>
            <span className="flex items-center gap-1.5 text-booku-coral">
              <IconBookmark /> {timeSavedText}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-auto pt-4">
          <Link
            to={`${location.pathname}?preview=${book.id}`}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-booku-coral hover:shadow-lg transition-all shadow-md whitespace-nowrap"
          >
            {t("sc_btn_read")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SavedCard;
