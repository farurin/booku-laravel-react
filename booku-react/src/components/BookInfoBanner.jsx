import React from "react";
import { getImageUrl } from "../utils/getImageUrl";
import { useLanguage } from "../context/LanguageContext";
import StarRating from "./StarRating";

const IconPages = () => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const IconCategory = () => (
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
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const IconViews = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconHeart = () => (
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
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconBookmark = () => (
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
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const BookInfoBanner = ({ book, userRating = 0, totalPages = 0 }) => {
  const { t, language } = useLanguage();

  if (!book) {
    return (
      <div className="w-full bg-booku-cream rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 animate-pulse mt-6 mb-12">
        <div className="w-32 md:w-44 h-48 md:h-64 bg-booku-cyan/40 rounded-xl shrink-0 self-center md:self-start"></div>
        <div className="ml-0 md:ml-4 flex-1 py-4 w-full">
          <div className="h-8 bg-booku-cyan/40 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-booku-cyan/40 rounded w-2/3 mb-6"></div>
          <div className="h-4 bg-booku-cyan/40 rounded w-1/2 mb-4"></div>
          <div className="h-24 bg-booku-cyan/40 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const categoryName =
    language === "en" && book.category_name_en
      ? book.category_name_en
      : book.category_name_id;
  const bookTitle =
    language === "en" && book.title_en ? book.title_en : book.title_id;
  const bookDesc =
    language === "en" && book.description_en
      ? book.description_en
      : book.description_id;
  const coverUrl =
    language === "en"
      ? book.image_en || book.image_id || book.image
      : book.image_id || book.image_en || book.image;

  return (
    <div className="w-full bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 items-start mt-6 mb-12 shadow-md border border-booku-cyan/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-booku-yellow/30 rounded-bl-full z-0"></div>

      <div className="w-32 md:w-44 shrink-0 self-center md:self-start relative z-10">
        <div className="w-full aspect-2/3 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-white bg-booku-cream transform -rotate-2 hover:rotate-0 transition-transform duration-300">
          <img
            src={getImageUrl(coverUrl)}
            alt={bookTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://placehold.co/163x232?text=Cover+Buku";
            }}
          />
        </div>
      </div>

      <div className="flex-1 py-2 flex flex-col justify-center relative z-10 w-full">
        <span className="inline-block px-3 py-1 bg-booku-yellow/50 text-gray-800 font-bold text-xs rounded-full w-max mb-3 uppercase tracking-wider border border-booku-yellow://">
          {t("bib_reading")}
        </span>

        <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight mb-2 leading-tight">
          {bookTitle}
        </h1>

        <div className="mb-5">
          <StarRating bookId={book.id} initialRating={userRating} />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-bold text-gray-600 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <IconPages />
            <span>
              {totalPages > 0 ? totalPages : "..."} {t("bib_pages")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-booku-cyan/20 text-teal-800 px-2 py-1 rounded-md font-bold">
            <IconCategory />
            <span>{categoryName || t("bib_category")}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-gray-700 mb-6">
          <div className="flex items-center gap-2" title="Views">
            <span className="p-1.5 bg-blue-50 text-blue-500 rounded-full">
              <IconViews />
            </span>
            <span>{book.views_count || 0}</span>
          </div>
          <div className="flex items-center gap-2" title="Favorites">
            <span className="p-1.5 bg-red-50 text-red-500 rounded-full">
              <IconHeart />
            </span>
            <span>{book.favorites_count || 0}</span>
          </div>
          <div className="flex items-center gap-2" title="Saved">
            <span className="p-1.5 bg-booku-coral/20 text-booku-coral rounded-full">
              <IconBookmark />
            </span>
            <span>{book.saved_count || 0}</span>
          </div>
        </div>

        <div className="w-full">
          <h5 className="font-black text-gray-900 text-base mb-2 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-booku-coral rounded-full"></span>
            {t("bib_synopsis")}
          </h5>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-3xl bg-booku-cream/30 p-4 rounded-xl font-medium">
            {bookDesc || t("bib_no_synopsis")}
          </p>

          {/* --- BLOK ATRIBUSI LEGAL (TUNGGAL) --- */}
          {book.attribution_text && (
            <div className="mt-5 p-4 bg-booku-cyan/10 border border-booku-cyan/20 rounded-2xl max-w-3xl">
              <h6 className="text-xs font-black text-teal-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span>📜</span> Attribution
              </h6>
              <p className="text-sm text-gray-700 font-medium leading-relaxed italic">
                {book.attribution_text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookInfoBanner;
