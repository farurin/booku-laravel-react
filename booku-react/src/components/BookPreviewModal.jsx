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

import popupFavImg from "../assets/popups/popup-fav.png";
import popupDeleteFavImg from "../assets/popups/popup-delete-fav.png";
import popupBookmarkImg from "../assets/popups/popup-bookmark.png";

// Ikon SVG
const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="17" y1="7" x2="7" y2="17"></line>
    <line x1="7" y1="7" x2="17" y2="17"></line>
  </svg>
);

const IconBookmark = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const IconHeart = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
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

const BookPreviewModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const previewId = searchParams.get("preview");
  const navigate = useNavigate();
  const location = useLocation(); // PERBAIKAN: Gunakan useLocation untuk mendeteksi perubahan halaman
  const { token, isLoggedIn, triggerRefresh } = useAuth();
  const { t, language } = useLanguage();

  const [book, setBook] = useState(null);
  const [firstPageImage, setFirstPageImage] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [popupConfig, setPopupConfig] = useState(null);

  const audioInstanceRef = useRef(null);

  // PERBAIKAN: Fungsi Cleanup Global
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

  // PERBAIKAN: Matikan audio jika rute/halaman berubah (Misal navigasi Back)
  useEffect(() => {
    if (!previewId) {
      cleanupAndClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Bersihkan audio sebelumnya jika masih nyangkut
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
        image: popupFavImg,
        title: t("bpm_fav_guest_title"),
        description: t("bpm_fav_guest_desc"),
        primaryBtnText: t("bpm_btn_register"),
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
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
        image: popupDeleteFavImg,
        title: t("bpm_rm_fav_title"),
        description: t("bpm_rm_fav_desc"),
        primaryBtnText: t("bpm_btn_remove"),
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
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
        image: popupFavImg,
        title: t("bpm_add_fav_title"),
        description: t("bpm_add_fav_desc"),
        primaryBtnText: t("bpm_btn_view"),
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: t("bpm_btn_close"),
        onPrimaryClick: () => {
          localStorage.setItem("cornerActiveTab", "favorit");
          triggerRefresh();

          // Matikan audio manual & tutup popup, jangan panggil setSearchParams
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
        image: popupBookmarkImg,
        title: t("bpm_save_guest_title"),
        description: t("bpm_save_guest_desc"),
        primaryBtnText: t("bpm_btn_register"),
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
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
        image: popupBookmarkImg,
        title: t("bpm_add_save_title"),
        description: t("bpm_add_save_desc"),
        primaryBtnText: t("bpm_btn_view"),
        primaryBtnColor: "bg-[#8B5CF6] hover:bg-purple-700",
        secondaryBtnText: t("bpm_btn_close"),
        onPrimaryClick: () => {
          localStorage.setItem("cornerActiveTab", "disimpan");
          triggerRefresh();

          // Matikan audio manual & tutup popup, jangan panggil setSearchParams
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

  const bgImageToUse = firstPageImage ? firstPageImage : coverUrl;

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

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-900/80 backdrop-blur-sm">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex overflow-visible border border-slate-200">
          {/* TOMBOL CLOSE */}
          <button
            onClick={cleanupAndClose}
            className="absolute -top-4 -right-4 md:-top-5 md:-right-5 z-50 w-11 h-11 md:w-14 md:h-14 bg-booku-yellow text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-booku-coral hover:text-white hover:rotate-90 hover:scale-110 transition-all duration-300 border-4 border-white cursor-pointer"
          >
            <IconClose />
          </button>

          <div className="w-full min-h-[28rem] md:min-h-[32rem] relative rounded-3xl overflow-hidden flex bg-slate-900">
            <img
              src={getImageUrl(bgImageToUse)}
              alt={bookTitle}
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/800x480?text=Preview+Cerita";
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent overflow-y-auto">
              <div className="flex flex-col lg:flex-row items-center w-full min-h-full">
                {/* KOLOM KIRI */}
                <div className="flex flex-col justify-center px-6 md:px-12 w-full lg:w-2/3 py-10 z-10">
                  <span className="text-booku-cyan font-bold text-xs tracking-wider uppercase mb-2">
                    Preview Cerita
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight pr-4">
                    {bookTitle}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-slate-300 text-xs md:text-sm mt-4 font-medium border-b border-slate-700 pb-4">
                    <span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-md">
                      <IconPages /> 11 {t("bpm_pages")}
                    </span>
                    <span className="flex items-center gap-1.5 bg-booku-cyan/20 text-booku-cyan px-2 py-1 rounded-md">
                      <IconCategory /> {catName || t("bpm_default_category")}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-slate-400 text-xs md:text-sm mt-4">
                    <span className="flex items-center gap-1.5" title="Dilihat">
                      <IconViews /> {book.views_count || 0}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-booku-coral"
                      title="Difavoritkan"
                    >
                      <IconHeart filled={isFavorite} />{" "}
                      {book.favorites_count || 0}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-booku-yellow"
                      title="Disimpan"
                    >
                      <IconBookmark filled={isSaved} /> {book.saved_count || 0}
                    </span>
                  </div>

                  <div className="mt-6 md:mt-6">
                    <p className="text-slate-300 mt-1 md:mt-2 text-sm max-w-xl leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      {bookDesc || t("bpm_no_synopsis")}
                    </p>
                  </div>

                  {/* Tombol bersusun */}
                  <div className="mt-8 flex flex-col gap-3 shrink-0">
                    {/* Baris 1: Bookmark + Baca */}
                    <div className="flex gap-3 h-11 md:h-12">
                      <button
                        onClick={handleToggleSave}
                        className={`w-11 md:w-12 h-full flex items-center justify-center rounded-xl hover:-translate-y-1 transition-all shadow-md cursor-pointer shrink-0 border ${isSaved ? "bg-booku-yellow text-gray-900 border-booku-yellow" : "bg-slate-800 text-booku-yellow border-slate-700 hover:bg-slate-700"}`}
                      >
                        <IconBookmark filled={isSaved} />
                      </button>
                      <button
                        onClick={handleReadClick}
                        className="flex-1 max-w-[200px] h-full bg-booku-coral text-white font-bold rounded-xl hover:brightness-110 hover:-translate-y-1 transition-all shadow-md text-sm cursor-pointer border-none"
                      >
                        {t("bpm_btn_read")}
                      </button>
                    </div>

                    {/* Baris 2: Favorit + Tonton */}
                    <div className="flex gap-3 h-11 md:h-12">
                      <button
                        onClick={handleToggleFavorite}
                        className={`w-11 md:w-12 h-full flex items-center justify-center rounded-xl hover:-translate-y-1 transition-all shadow-md cursor-pointer shrink-0 border ${isFavorite ? "bg-booku-coral text-white border-booku-coral" : "bg-slate-800 text-booku-coral border-slate-700 hover:bg-slate-700"}`}
                      >
                        <IconHeart filled={isFavorite} />
                      </button>

                      <button
                        onClick={() => window.open(activeYoutubeUrl, "_blank")}
                        disabled={!activeYoutubeUrl}
                        className={`flex-1 max-w-[200px] h-full font-bold rounded-xl transition-all shadow-md text-sm shrink-0 border ${activeYoutubeUrl ? "bg-booku-cyan text-gray-900 border-booku-cyan hover:brightness-110 hover:-translate-y-1 cursor-pointer" : "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"}`}
                      >
                        {t("bpm_btn_watch")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* KOLOM KANAN */}
                <div className="hidden lg:flex flex-1 items-center justify-center pr-12 z-10">
                  <div className="w-52 xl:w-60 aspect-[2/3] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-slate-700 transform hover:-translate-y-2 transition-transform duration-500 bg-booku-cream">
                    <img
                      src={getImageUrl(coverUrl)}
                      alt={`Cover ${bookTitle}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/150x220?text=Cover";
                      }}
                    />
                  </div>
                </div>
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
