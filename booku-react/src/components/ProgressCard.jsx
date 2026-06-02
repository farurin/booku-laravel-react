import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ActionPopupModal from "./ActionPopupModal";
import { toggleFavorite } from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";
import popupDeleteFavImg from "../assets/popups/popup-delete-fav.png";

// Ikon fav
const IconHeartSolid = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#F48F68"
    stroke="#F48F68"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ProgressCard = ({ progress, type }) => {
  const location = useLocation();
  const { token, triggerRefresh } = useAuth();
  const { t, language } = useLanguage();
  const [popupConfig, setPopupConfig] = useState(null);

  const book = progress.book || progress;
  const reading_progress = progress.reading_progress ?? 0;

  if (!book) return null;

  const bookTitle =
    language === "en" && book.title_en ? book.title_en : book.title_id;
  const coverUrl =
    language === "en"
      ? book?.image_en || book?.image_id || book?.image
      : book?.image_id || book?.image_en || book?.image;

  const handleUnfavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPopupConfig({
      image: popupDeleteFavImg,
      title: t("pc_rm_fav_title"),
      description: t("pc_rm_fav_desc"),
      primaryBtnText: t("pc_btn_remove"),
      primaryBtnColor: "bg-red-500 hover:bg-red-600 text-white",
      secondaryBtnText: t("pc_btn_cancel"),
      onPrimaryClick: async () => {
        try {
          await toggleFavorite(book.id, token);
          triggerRefresh();
          setPopupConfig(null);
        } catch (err) {
          console.error(err);
        }
      },
      onSecondaryClick: () => setPopupConfig(null),
    });
  };

  return (
    <>
      <Link
        to={`${location.pathname}?preview=${book.id}`}
        // Gaya Polaroid
        className="block w-full bg-white p-3 md:p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1 border border-gray-100 relative group"
      >
        {type === "favorit" && (
          <button
            onClick={handleUnfavorite}
            className="absolute -top-3 -right-3 z-10 bg-white p-2 rounded-full shadow-lg hover:scale-125 transition cursor-pointer border border-gray-100"
          >
            <IconHeartSolid />
          </button>
        )}

        {/* Gambar Cover */}
        <div className="w-full bg-booku-cream overflow-hidden aspect-2/3 rounded-md relative shadow-inner">
          <img
            src={getImageUrl(coverUrl)}
            alt={bookTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/150x220?text=Cover";
            }}
          />
        </div>

        {/* Info Riwayat di bawah Polaroid */}
        {type === "riwayat" && (
          <div className="pt-4 pb-2 bg-white">
            <h3 className="font-black text-gray-800 text-sm line-clamp-1 mb-3 text-center">
              {bookTitle || "Judul Buku"}
            </h3>

            <div>
              <div className="flex justify-between items-center mb-1.5 px-1">
                <span className="text-[10px] font-bold text-gray-400">
                  PROGRESS
                </span>
                <span className="text-[11px] font-black text-booku-cyan">
                  {reading_progress}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 shadow-inner overflow-hidden">
                <div
                  className="bg-booku-cyan h-full rounded-full transition-all duration-1000"
                  style={{ width: `${reading_progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </Link>
      <ActionPopupModal isOpen={popupConfig !== null} {...popupConfig} />
    </>
  );
};

export default ProgressCard;
