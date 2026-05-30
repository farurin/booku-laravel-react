import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitRating } from "../services/api";

// SVG Bintang Kosong (Outline)
const IconStarOutline = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// SVG Bintang Penuh (Solid)
const IconStarSolid = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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

const StarRating = ({ bookId, initialRating = 0 }) => {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // KUNCI PERBAIKAN 1: Sinkronisasi data dari Backend
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleRate = async (rateValue) => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk memberikan rating.");
      return;
    }

    setIsSubmitting(true);
    const previousRating = rating;
    setRating(rateValue); // Optimistic UI update

    try {
      await submitRating(bookId, rateValue, token);
      console.log(`Berhasil submit rating ${rateValue} untuk buku ${bookId}`);
    } catch (error) {
      console.error("Gagal submit rating:", error);
      setRating(previousRating); // Kembalikan ke rating awal jika gagal
      alert("Gagal mengirim rating. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        return (
          <button
            key={star}
            type="button"
            disabled={isSubmitting}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(rating)}
            className={`transition-all duration-200 cursor-pointer hover:scale-110 focus:outline-none ${
              star <= (hover || rating) ? "text-booku-yellow" : "text-gray-300"
            }`}
          >
            {star <= (hover || rating) ? (
              <IconStarSolid />
            ) : (
              <IconStarOutline />
            )}
          </button>
        );
      })}

      <span className="ml-2 text-sm font-bold text-gray-500">
        {rating > 0 ? `${rating}/5` : "Beri nilai"}
      </span>
    </div>
  );
};

export default StarRating;
