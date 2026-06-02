import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";
import { useLanguage } from "../context/LanguageContext";

// Ikon bintang solid kecil untuk Card
const IconStarSmall = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const Card = ({ book }) => {
  const location = useLocation();
  const { language } = useLanguage();

  if (!book) return null;

  const coverUrl =
    language === "en"
      ? book.image_en || book.image_id || book.image
      : book.image_id || book.image_en || book.image;
  const bookTitle =
    language === "en"
      ? book.title_en || book.title_id || "Book Cover"
      : book.title_id || book.title_en || "Cover Buku";

  // Tangkap data dari backend
  const ratingAvg = book.rating_avg || 0;

  return (
    <Link
      to={`${location.pathname}?preview=${book.id}`}
      // DIUBAH: Menghapus ring luar dan menggantinya dengan border-4 transparent yang berubah jadi Cyan saat dihover.
      className="block w-full aspect-294/419 rounded-[20px] overflow-hidden shadow-sm hover:shadow-[0_12px_30px_-10px_rgba(20,184,166,0.5)] transition-all duration-300 cursor-pointer bg-gray-100 group relative border-4 border-transparent hover:border-booku-cyan"
    >
      {/* BADGE RATING MELAYANG */}
      {/* Penyesuaian posisi top & right agar tidak tertutup border tebal */}
      <div className="absolute top-2.5 right-2.5 z-20 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-booku-yellow/50">
        <span className="text-booku-yellow">
          <IconStarSmall />
        </span>
        <span className="text-[10px] font-black text-gray-800">
          {ratingAvg > 0 ? Number(ratingAvg).toFixed(1) : "Baru"}
        </span>
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>

      {/* GAMBAR: Akan membesar/zoom in berkat group-hover:scale-110 */}
      <img
        src={getImageUrl(coverUrl)}
        alt={bookTitle}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/150x240?text=Cover+Buku";
        }}
      />
    </Link>
  );
};

export default Card;
