import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";
import { useLanguage } from "../context/LanguageContext";

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

  return (
    <Link
      to={`${location.pathname}?preview=${book.id}`}
      className="block w-full aspect-[294/419] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-booku-cyan/30 transition-all duration-300 cursor-pointer bg-white group border-2 border-transparent hover:border-booku-cyan relative"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
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
