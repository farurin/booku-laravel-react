import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StoryReader from "../components/StoryReader";
import StoryActions from "../components/StoryActions";
import BookInfoBanner from "../components/BookInfoBanner";
import { CategorySection } from "../components/BookListSection";
import CtaDownload from "../components/CtaDownload";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ActionPopupModal from "../components/ActionPopupModal";
import {
  getBooks,
  getCategories,
  getBookStatus,
  getBookPages, // <-- KUNCI PERBAIKAN 1: Import getBookPages
  toggleFavorite,
  toggleSaved,
} from "../services/api";

import popupDeleteFavImg from "../assets/popups/popup-delete-fav.png";
import popupFavImg from "../assets/popups/popup-fav.png";
import popupBookmarkImg from "../assets/popups/popup-bookmark.png";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isLoggedIn, triggerRefresh } = useAuth();
  const { t, language } = useLanguage();

  const [book, setBook] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [popupConfig, setPopupConfig] = useState(null);

  // KUNCI PERBAIKAN 2: State untuk menyimpan total halaman
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        // Ambil data buku, kategori, dan HALAMAN BUKU secara bersamaan
        const [books, categories, pages] = await Promise.all([
          getBooks(),
          getCategories(),
          getBookPages(id), // Ambil halaman berdasarkan id buku di URL
        ]);

        const currentBook = books.find((b) => b.id === parseInt(id));

        if (currentBook) {
          const cat = categories.find(
            (c) => c.id === currentBook.id_categories,
          );
          if (cat) {
            currentBook.category_name_id = cat.name_id;
            currentBook.category_name_en = cat.name_en;
            currentBook.category_color = cat.color_hex;
            cat.books = books.filter((b) => b.id_categories === cat.id);
            setCategoryData(cat);
          }
          setBook(currentBook);

          // KUNCI PERBAIKAN 3: Simpan panjang array halaman
          setTotalPages(pages ? pages.length : 0);

          if (isLoggedIn && token) {
            const statusData = await getBookStatus(currentBook.id, token);
            setIsFavorite(statusData.isFavorite);
            setIsSaved(statusData.isSaved);
            setUserRating(statusData.userRating || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookData();
    window.scrollTo(0, 0);
  }, [id, isLoggedIn, token]);

  const executeToggleFavAPI = async () => {
    try {
      const data = await toggleFavorite(book.id, token);
      setIsFavorite(data.isFavorite);
      triggerRefresh();
    } catch (error) {
      console.error("Gagal toggle favorit:", error);
    }
  };

  const executeToggleSaveAPI = async () => {
    try {
      const data = await toggleSaved(book.id, token);
      setIsSaved(data.isSaved);
      triggerRefresh();
    } catch (error) {
      console.error("Gagal toggle simpan:", error);
    }
  };

  const handleToggleFavorite = async () => {
    // ... (Logic handleToggleFavorite sama persis)
    if (!isLoggedIn) {
      setPopupConfig({
        image: popupFavImg,
        title: t("bd_guest_fav_title"),
        description: t("bd_guest_fav_desc"),
        primaryBtnText: t("bd_btn_register"),
        primaryBtnColor: "bg-booku-coral hover:bg-orange-500 text-white",
        secondaryBtnText: t("bd_btn_later"),
        onPrimaryClick: () => navigate("/register"),
        onSecondaryClick: () => setPopupConfig(null),
      });
      return;
    }

    if (isFavorite) {
      setPopupConfig({
        image: popupDeleteFavImg,
        title: t("bd_rm_fav_title"),
        description: t("bd_rm_fav_desc"),
        primaryBtnText: t("bd_btn_delete"),
        primaryBtnColor: "bg-red-500 hover:bg-red-600 text-white",
        secondaryBtnText: t("bd_btn_cancel"),
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
        title: t("bd_add_fav_title"),
        description: t("bd_add_fav_desc"),
        primaryBtnText: t("bd_btn_view"),
        primaryBtnColor: "bg-booku-coral hover:bg-orange-500 text-white",
        secondaryBtnText: t("bd_btn_close"),
        onPrimaryClick: () => navigate("/corner"),
        onSecondaryClick: () => setPopupConfig(null),
      });
    }
  };

  const handleToggleSave = async () => {
    // ... (Logic handleToggleSave sama persis)
    if (!isLoggedIn) {
      setPopupConfig({
        image: popupBookmarkImg,
        title: t("bd_guest_save_title"),
        description: t("bd_guest_save_desc"),
        primaryBtnText: t("bd_btn_register"),
        primaryBtnColor: "bg-booku-coral hover:bg-orange-500 text-white",
        secondaryBtnText: t("bd_btn_later"),
        onPrimaryClick: () => navigate("/register"),
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
        title: t("bd_add_save_title"),
        description: t("bd_add_save_desc"),
        primaryBtnText: t("bd_btn_view"),
        primaryBtnColor: "bg-booku-coral hover:bg-orange-500 text-white",
        secondaryBtnText: t("bd_btn_close"),
        onPrimaryClick: () => navigate("/corner"),
        onSecondaryClick: () => setPopupConfig(null),
      });
    }
  };

  const handleFullscreen = () => {
    const elem = document.getElementById("story-reader-container");
    if (!elem) return;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error(err.message);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center font-bold text-teal-600 text-xl bg-booku-cream">
        {t("bd_loading")}
      </div>
    );
  if (!book)
    return (
      <div className="w-full h-screen flex items-center justify-center font-bold text-red-500 text-xl bg-booku-cream">
        {t("bd_not_found")}
      </div>
    );

  const bookTitle =
    language === "en" && book.title_en ? book.title_en : book.title_id;

  return (
    // DIUBAH: Kelas pb-12 dihapus agar menempel rapat dengan Footer
    <div className="w-full bg-booku-cream min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-10">
        <div className="text-center mb-10">
          <div className="inline-block px-5 py-2 bg-booku-yellow text-gray-900 font-black tracking-widest uppercase rounded-full text-xs md:text-sm mb-4 shadow-sm border border-white">
            {categoryData
              ? language === "en"
                ? categoryData.name_en
                : categoryData.name_id
              : "Cerita"}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            {bookTitle}
          </h1>
        </div>

        <StoryReader book={book} />

        <StoryActions
          isFavorite={isFavorite}
          isSaved={isSaved}
          onToggleFavorite={handleToggleFavorite}
          onToggleSave={handleToggleSave}
          onToggleFullscreen={handleFullscreen}
        />

        <div className="mt-16">
          <BookInfoBanner
            book={book}
            userRating={userRating}
            totalPages={totalPages}
          />
        </div>

        {/* Jarak bottom margin untuk kategori terakhir (mb-16) agar ada ruang lega SEBELUM CTADownload, BUKAN sesudahnya */}
        {categoryData && (
          <div className="mt-16 mb-16 bg-white p-6 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <CategorySection
              category={categoryData}
              customTitle={`${language === "en" && categoryData.name_en ? categoryData.name_en : categoryData.name_id} ${t("bd_others")}`}
            />
          </div>
        )}
      </div>

      {/* CtaDownload sekarang bebas dan akan menempel langsung dengan Footer yang ada di MainLayout */}
      <CtaDownload />
      <ActionPopupModal isOpen={popupConfig !== null} {...popupConfig} />
    </div>
  );
};

export default BookDetail;
