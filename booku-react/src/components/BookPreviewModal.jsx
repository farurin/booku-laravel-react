import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ActionPopupModal from "./ActionPopupModal";
import { getImageUrl } from "../utils/getImageUrl";
import {
  getBooks,
  getBookPages,
  getBookStatus,
  toggleFavorite,
  toggleSaved,
  incrementBookView,
} from "../services/api";

// Aset Popup diganti menjadi SVG Data URI
const popupFavSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#F48F68"/><path d="M50 75L27 52.8C20 45.8 24 33 35 33C41.6 33 46.8 38 50 42C53.2 38 58.4 33 65 33C76 33 80 45.8 73 52.8L50 75Z" fill="white"/></svg>`,
)}`;
const popupDeleteFavSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#E5E7EB"/><path d="M50 75L27 52.8C20 45.8 24 33 35 33C41.6 33 46.8 38 50 42C53.2 38 58.4 33 65 33C76 33 80 45.8 73 52.8L50 75Z" fill="#9CA3AF"/><path d="M55 30 L45 50 L55 60 L45 80" stroke="#E5E7EB" stroke-width="4" fill="none"/></svg>`,
)}`;
const popupBookmarkSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#FFE394"/><path d="M35 25 h30 v55 l-15-12 l-15 12 z" fill="white"/><path d="M50 40 l3 7 h7 l-5 4 2 7 -7-4 -7 4 2-7 -5-4 h7 z" fill="#F48F68"/></svg>`,
)}`;

// Ikon SVG Antarmuka
const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const IconBookmark = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const IconHeart = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
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
const IconStarSmall = ({ filled = true }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const BookPreviewModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const previewId = searchParams.get("preview");
  const navigate = useNavigate();
  const location = useLocation();
  const { token, isLoggedIn, triggerRefresh } = useAuth();
  const { t, language } = useLanguage();

  const [book, setBook] = useState(null);
  const [firstPageImage, setFirstPageImage] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [popupConfig, setPopupConfig] = useState(null);

  const audioInstanceRef = useRef(null);

  const cleanupAndClose = () => {
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current.currentTime = 0;
      audioInstanceRef.current.src = "";
      audioInstanceRef.current = null;
    }
    setPopupConfig(null);
    setBook(null);
    setFirstPageImage(null);
    searchParams.delete("preview");
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!previewId) {
      cleanupAndClose();
    }
  }, [location.pathname, previewId]);

  useEffect(() => {
    if (!previewId) return;

    const fetchModalData = async () => {
      try {
        const booksData = await getBooks();
        const foundBook = booksData.find((b) => b.id === parseInt(previewId));

        if (foundBook) {
          setBook(foundBook);

          const pagesData = await getBookPages(foundBook.id);
          setTotalPages(pagesData ? pagesData.length : 0);
          setFirstPageImage(
            pagesData && pagesData.length > 0 ? pagesData[0].image : null,
          );

          if (isLoggedIn && token) {
            const statusData = await getBookStatus(foundBook.id, token);
            setIsFavorite(statusData.isFavorite);
            setIsSaved(statusData.isSaved);
          }
        }
      } catch (err) {
        console.error("Gagal memuat data modal:", err);
      }
    };
    fetchModalData();
  }, [previewId, isLoggedIn, token]);

  // PLAY AUDIO JUDUL
  useEffect(() => {
    if (!book || !previewId) return;

    const introAudioUrl =
      language === "en" ? book.title_audio_en_url : book.title_audio_id_url;

    if (!introAudioUrl) return;

    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current.src = "";
    }

    const audio = new Audio(getImageUrl(introAudioUrl));
    audioInstanceRef.current = audio;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log("Intro voiceover blocked/interrupted:", err);
      });
    }

    return () => {
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.src = "";
          })
          .catch(() => {});
      } else {
        audio.pause();
        audio.src = "";
      }
    };
  }, [book, language, previewId]);

  if (!previewId || !book) return null;

  const handleReadClick = () => {
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current.src = "";
    }
    incrementBookView(book.id);
    navigate(`/book/${book.id}`);
  };

  const executeToggleFavAPI = async () => {
    try {
      const data = await toggleFavorite(book.id, token);
      setIsFavorite(data.isFavorite);
      triggerRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const executeToggleSaveAPI = async () => {
    try {
      const data = await toggleSaved(book.id, token);
      setIsSaved(data.isSaved);
      triggerRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      setPopupConfig({
        image: popupFavSvg,
        title: t("bpm_fav_guest_title"),
        description: t("bpm_fav_guest_desc"),
        primaryBtnText: t("bpm_btn_register"),
        primaryBtnColor: "bg-booku-coral hover:bg-orange-500 text-white",
        secondaryBtnText: t("bpm_btn_later"),
        onPrimaryClick: () => {
          if (audioInstanceRef.current) {
            audioInstanceRef.current.pause();
            audioInstanceRef.current.src = "";
          }
          setPopupConfig(null);
          setBook(null);
          navigate("/register", { replace: true });
        },
        onSecondaryClick: () => setPopupConfig(null),
      });
      return;
    }

    if (isFavorite) {
      setPopupConfig({
        image: popupDeleteFavSvg,
        title: t("bpm_rm_fav_title"),
        description: t("bpm_rm_fav_desc"),
        primaryBtnText: t("bpm_btn_remove"),
        primaryBtnColor: "bg-red-500 hover:bg-red-600 text-white",
        secondaryBtnText: t("bpm_btn_cancel"),
        onPrimaryClick: () => {
          executeToggleFavAPI();
          setPopupConfig(null);
        },
        onSecondaryClick: () => setPopupConfig(null),
      });
    } else {
      await executeToggleFavAPI();
      setPopupConfig({
        image: popupFavSvg,
        title: t("bpm_add_fav_title"),
        description: t("bpm_add_fav_desc"),
        primaryBtnText: t("bpm_btn_view"),
        primaryBtnColor: "bg-booku-coral hover:bg-orange-500 text-white",
        secondaryBtnText: t("bpm_btn_close"),
        onPrimaryClick: () => {
          localStorage.setItem("cornerActiveTab", "favorit");
          triggerRefresh();
          if (audioInstanceRef.current) {
            audioInstanceRef.current.pause();
            audioInstanceRef.current.src = "";
          }
          setPopupConfig(null);
          setBook(null);
          navigate("/corner");
        },
        onSecondaryClick: () => setPopupConfig(null),
      });
    }
  };

  const handleToggleSave = async () => {
    if (!isLoggedIn) {
      setPopupConfig({
        image: popupBookmarkSvg,
        title: t("bpm_save_guest_title"),
        description: t("bpm_save_guest_desc"),
        primaryBtnText: t("bpm_btn_register"),
        primaryBtnColor: "bg-booku-coral hover:bg-orange-500 text-white",
        secondaryBtnText: t("bpm_btn_later"),
        onPrimaryClick: () => {
          if (audioInstanceRef.current) {
            audioInstanceRef.current.pause();
            audioInstanceRef.current.src = "";
          }
          setPopupConfig(null);
          setBook(null);
          navigate("/register", { replace: true });
        },
        onSecondaryClick: () => setPopupConfig(null),
      });
      return;
    }

    if (isSaved) {
      await executeToggleSaveAPI();
    } else {
      await executeToggleSaveAPI();
      setPopupConfig({
        image: popupBookmarkSvg,
        title: t("bpm_add_save_title"),
        description: t("bpm_add_save_desc"),
        primaryBtnText: t("bpm_btn_view"),
        primaryBtnColor: "bg-booku-coral hover:bg-orange-500 text-white",
        secondaryBtnText: t("bpm_btn_close"),
        onPrimaryClick: () => {
          localStorage.setItem("cornerActiveTab", "disimpan");
          triggerRefresh();
          if (audioInstanceRef.current) {
            audioInstanceRef.current.pause();
            audioInstanceRef.current.src = "";
          }
          setPopupConfig(null);
          setBook(null);
          navigate("/corner");
        },
        onSecondaryClick: () => setPopupConfig(null),
      });
    }
  };

  const coverUrl =
    language === "en"
      ? book.image_en || book.image_id || book.image
      : book.image_id || book.image_en || book.image;

  const catName =
    language === "en" && book.category_name_en
      ? book.category_name_en
      : book.category_name_id;
  const activeYoutubeUrl =
    language === "en"
      ? book.youtube_url_en || book.youtube_url_id
      : book.youtube_url_id || book.youtube_url_en;
  const bookTitle =
    language === "en" && book.title_en ? book.title_en : book.title_id;
  const bookDesc =
    language === "en" && book.description_en
      ? book.description_en
      : book.description_id;

  const ratingAvg = book.rating_avg || 0;
  const ratingCount = book.rating_count || 0;

  return (
    <>
      {/* Latar Belakang Modal (Terang & Blur) */}
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8 bg-gray-900/40 backdrop-blur-md">
        {/* Kotak Modal Utama - Diubah menjadi max-w-2xl untuk layout Vertikal */}
        <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border-8 border-booku-cream animate-fade-in max-h-[90vh]">
          {/* Tombol Tutup */}
          <button
            onClick={cleanupAndClose}
            className="absolute top-4 right-4 z-50 w-12 h-12 bg-white text-gray-500 rounded-full flex items-center justify-center shadow-md hover:bg-booku-coral hover:text-white transition-colors border border-gray-100 cursor-pointer"
          >
            <IconClose />
          </button>

          {/* BAGIAN ATAS: Header Cyan & Gambar Cover */}
          <div className="w-full h-64 md:h-80 bg-booku-cyan relative flex items-center justify-center shrink-0 overflow-hidden">
            {/* Dekorasi Bentuk CSS */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-booku-yellow/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

            {/* Cover Buku */}
            <div className="w-36 md:w-48 aspect-2/3 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 rotate-3 hover:rotate-0 transition-transform duration-500 bg-white">
              <img
                src={getImageUrl(coverUrl)}
                alt={`Cover ${bookTitle}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x450?text=Cover";
                }}
              />
            </div>
          </div>

          {/* BAGIAN BAWAH: Konten Teks (Bisa di-scroll jika layar kecil) */}
          <div className="flex-1 p-6 md:p-10 bg-white overflow-y-auto">
            <span className="text-booku-coral font-black text-sm tracking-widest uppercase mb-2 block">
              Preview Cerita
            </span>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4 pr-8">
              {bookTitle}
            </h1>

            {/* Badges Informasi */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-gray-700 text-xs md:text-sm font-bold">
              <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                <IconPages /> {totalPages > 0 ? totalPages : "..."}{" "}
                {t("bpm_pages")}
              </span>
              <span className="flex items-center gap-1.5 bg-booku-cyan/20 text-teal-800 px-3 py-1.5 rounded-full border border-booku-cyan/30">
                <IconCategory /> {catName || t("bpm_default_category")}
              </span>
              <span className="flex items-center gap-1 bg-booku-yellow/30 text-yellow-800 px-3 py-1.5 rounded-full border border-booku-yellow/50">
                <IconStarSmall filled={true} />
                {ratingAvg > 0 ? Number(ratingAvg).toFixed(1) : "Baru"}
                {ratingCount > 0 && (
                  <span className="opacity-70 ml-1">({ratingCount})</span>
                )}
              </span>
            </div>

            {/* Statistik View, Fav, Save */}
            <div className="flex items-center gap-5 md:gap-6 text-gray-500 text-xs md:text-sm font-bold mt-5 pb-5 border-b border-gray-100">
              <span className="flex items-center gap-1.5">
                <IconViews /> {book.views_count || 0}
              </span>
              <span className="flex items-center gap-1.5 text-booku-coral">
                <IconHeart filled={isFavorite} /> {book.favorites_count || 0}
              </span>
              <span className="flex items-center gap-1.5 text-booku-yellow">
                <IconBookmark filled={isSaved} /> {book.saved_count || 0}
              </span>
            </div>

            {/* Sinopsis */}
            <div className="mt-5 bg-booku-cream/50 p-5 rounded-2xl border border-booku-yellow/30">
              <h4 className="text-gray-900 font-black mb-2">
                {t("bpm_synopsis")}
              </h4>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {bookDesc || t("bpm_no_synopsis")}
              </p>
            </div>

            {/* --- BLOK ATRIBUSI LEGAL (TUNGGAL) --- */}
            {book.attribution_text && (
              <div className="mt-4 p-4 bg-booku-cyan/10 border border-booku-cyan/20 rounded-2xl">
                <h6 className="text-xs font-black text-teal-700 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <span>📜</span> Attribution
                </h6>
                <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed italic">
                  {book.attribution_text}
                </p>
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 shrink-0">
              <div className="flex-1 flex gap-3 h-12 md:h-14">
                <button
                  onClick={handleReadClick}
                  className="flex-1 bg-booku-coral text-white font-black rounded-xl md:rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all text-base md:text-lg cursor-pointer border-none"
                >
                  {t("bpm_btn_read")}
                </button>
                <button
                  onClick={() => window.open(activeYoutubeUrl, "_blank")}
                  disabled={!activeYoutubeUrl}
                  className={`flex-1 font-black rounded-xl md:rounded-2xl shadow-sm text-base md:text-lg transition-all border-none ${activeYoutubeUrl ? "bg-booku-cyan text-gray-900 hover:-translate-y-1 hover:shadow-md cursor-pointer" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                  {t("bpm_btn_watch")}
                </button>
              </div>

              <div className="flex gap-3 h-12 md:h-14 justify-center">
                <button
                  onClick={handleToggleFavorite}
                  className={`w-12 md:w-14 h-full flex items-center justify-center rounded-xl md:rounded-2xl shadow-sm hover:-translate-y-1 transition-all cursor-pointer border-2 ${isFavorite ? "bg-booku-coral text-white border-booku-coral" : "bg-white text-gray-400 border-gray-200 hover:border-booku-coral hover:text-booku-coral"}`}
                >
                  <IconHeart filled={isFavorite} />
                </button>
                <button
                  onClick={handleToggleSave}
                  className={`w-12 md:w-14 h-full flex items-center justify-center rounded-xl md:rounded-2xl shadow-sm hover:-translate-y-1 transition-all cursor-pointer border-2 ${isSaved ? "bg-booku-yellow text-gray-900 border-booku-yellow" : "bg-white text-gray-400 border-gray-200 hover:border-booku-yellow hover:text-booku-yellow"}`}
                >
                  <IconBookmark filled={isSaved} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ActionPopupModal isOpen={popupConfig !== null} {...popupConfig} />
    </>
  );
};

export default BookPreviewModal;
