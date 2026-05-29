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
  const [popupConfig, setPopupConfig] = useState(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const [books, categories] = await Promise.all([
          getBooks(),
          getCategories(),
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

          if (isLoggedIn && token) {
            const statusData = await getBookStatus(currentBook.id, token);
            setIsFavorite(statusData.isFavorite);
            setIsSaved(statusData.isSaved);
          }
        }
      } catch (error) {
        console.error(error);
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
    if (!document.fullscreenElement)
      elem.requestFullscreen().catch((err) => console.error(err));
    else document.exitFullscreen();
  };

  if (isLoading)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center font-bold text-gray-400 bg-booku-cream">
        <div className="w-12 h-12 border-4 border-booku-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
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
    <div className="w-full bg-booku-cream min-h-screen pb-12">
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
          <BookInfoBanner book={book} />
        </div>

        {categoryData && (
          <div className="mt-20">
            <CategorySection
              category={categoryData}
              customTitle={`${language === "en" && categoryData.name_en ? categoryData.name_en : categoryData.name_id} ${t("bd_others")}`}
            />
          </div>
        )}
      </div>
      <CtaDownload />
      <ActionPopupModal isOpen={popupConfig !== null} {...popupConfig} />
    </div>
  );
};

export default BookDetail;
