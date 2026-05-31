import React from "react";
import { getImageUrl } from "../utils/getImageUrl";
import { useLanguage } from "../context/LanguageContext";
import StarRating from "./StarRating";

const IconPages = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
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
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
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
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
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
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconBookmark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
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
      <div className="w-full bg-white rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row animate-pulse mt-8 mb-12 overflow-hidden">
        <div className="w-full md:w-2/5 h-64 md:h-auto bg-gray-100 shrink-0"></div>
        <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-24 bg-gray-200 rounded w-full"></div>
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
    // Card Utama
    <div className="w-full max-w-7xl mx-auto bg-white rounded-[32px] md:rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row mt-8 mb-12 overflow-hidden">
      {/* SISI KIRI: Cover Buku */}
      {/* Lebar disesuaikan, bg diubah, dan flex items-center agar gambar selalu di tengah vertikal */}
      <div className="w-full md:w-1/3 lg:w-[35%] bg-booku-cream p-8 lg:p-12 flex items-center justify-center relative overflow-hidden shrink-0">
        {/* Dekorasi Bentuk CSS */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-booku-yellow/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-booku-cyan/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        {/* Ukuran cover diperbesar (max-w ditingkatkan) */}
        <div className="w-full max-w-[240px] lg:max-w-[300px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10 rotate-2 hover:rotate-0 transition-transform duration-500 bg-white">
          <img
            src={getImageUrl(coverUrl)}
            alt={bookTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/300x450?text=Cover+Buku";
            }}
          />
        </div>
      </div>

      {/* SISI KANAN: Informasi Teks */}
      {/* Padding disesuaikan agar lebih padat */}
      <div className="w-full md:w-2/3 lg:w-[65%] p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white z-10">
        <span className="inline-block px-3 py-1 bg-booku-yellow/30 text-yellow-800 font-black text-[10px] md:text-xs rounded-full w-max mb-3 uppercase tracking-widest border border-booku-yellow/50 shadow-sm">
          {t("bib_reading")}
        </span>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-3 leading-tight">
          {bookTitle}
        </h1>

        <div className="mb-5">
          <StarRating bookId={book.id} initialRating={userRating} />
        </div>

        {/* Badges Informasi */}
        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-bold text-gray-700 mb-5 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
            <IconPages />
            <span>
              {totalPages > 0 ? totalPages : "..."} {t("bib_pages")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-booku-cyan/20 text-teal-800 px-3 py-1.5 rounded-full border border-booku-cyan/30">
            <IconCategory />
            <span>{categoryName || t("bib_category")}</span>
          </div>
        </div>

        {/* Statistik View, Fav, Save */}
        <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-gray-500 mb-6">
          <div className="flex items-center gap-2" title="Views">
            <span className="p-2 bg-blue-50 text-blue-500 rounded-full">
              <IconViews />
            </span>
            <span>{book.views_count || 0}</span>
          </div>
          <div className="flex items-center gap-2" title="Favorites">
            <span className="p-2 bg-red-50 text-red-500 rounded-full">
              <IconHeart />
            </span>
            <span>{book.favorites_count || 0}</span>
          </div>
          <div className="flex items-center gap-2" title="Saved">
            <span className="p-2 bg-booku-yellow/30 text-yellow-700 rounded-full">
              <IconBookmark />
            </span>
            <span>{book.saved_count || 0}</span>
          </div>
        </div>

        {/* Sinopsis */}
        <div className="w-full mb-5">
          <h5 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-booku-coral rounded-full"></span>
            {t("bib_synopsis")}
          </h5>
          <div className="bg-booku-cream/30 p-4 md:p-5 rounded-2xl border border-booku-cream">
            <p className="text-gray-700 leading-relaxed text-sm font-medium">
              {bookDesc || t("bib_no_synopsis")}
            </p>
          </div>
        </div>

        {/* --- BLOK ATRIBUSI LEGAL (TUNGGAL) --- */}
        {book.attribution_text && (
          <div className="w-full p-4 bg-booku-cyan/10 border border-booku-cyan/20 rounded-2xl">
            <h6 className="text-[10px] md:text-xs font-black text-teal-700 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <span>📜</span> Attribution
            </h6>
            <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed italic">
              {book.attribution_text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookInfoBanner;
