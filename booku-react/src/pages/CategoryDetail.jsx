import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import BannerCorner from "../components/BannerCorner";
import CtaDownload from "../components/CtaDownload";
import Card from "../components/Card";
import CategorySlider from "../components/CategorySlider";
import { getCategories, getBooks } from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";
import { useLanguage } from "../context/LanguageContext";

import bannerBg from "../assets/kategori_banner.png";
import bannerIcon from "../assets/kategori_icon.png";

const IconGrid = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z" />
  </svg>
);
const IconList = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 14h2v-2H4v2zm0 5h2v-2H4v2zm0-10h2V7H4v2zm4 5h12v-2H8v2zm0 5h12v-2H8v2zM8 7v2h12V7H8z" />
  </svg>
);
const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9ca3af"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CategoryDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catData, bookData] = await Promise.all([
          getCategories(),
          getBooks(),
        ]);
        setCategories(catData);
        setBooks(bookData);
      } catch (err) {
        setError(err.message || "Gagal terhubung ke server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const category = categories.find((c) => c.id === parseInt(id));
  const catName = category
    ? language === "en" && category.name_en
      ? category.name_en
      : category.name_id
    : t("cat_title");

  const filteredBooks = books.filter((b) => {
    const matchCat = b.id_categories === parseInt(id);
    const titleToSearch =
      language === "en" && b.title_en ? b.title_en : b.title_id;
    const matchSearch = (titleToSearch || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (error)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          {t("cat_err_col")}
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-teal-600 text-white rounded-full font-bold shadow-md hover:bg-teal-700 transition cursor-pointer"
        >
          {t("btn_retry")}
        </button>
      </div>
    );

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center text-teal-600 font-bold text-xl">
        {t("cd_loading")}
      </div>
    );

  return (
    <div className="w-full bg-slate-50">
      <BannerCorner title={catName} bgImage={bannerBg} icon={bannerIcon} />

      <div className="mt-8 bg-white py-6 border-b border-gray-100">
        <CategorySlider categories={categories} activeCategoryId={id} />
      </div>

      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder={t("cd_search")}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-5 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-400 focus:ring-0 text-sm shadow-sm bg-white"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <IconSearch />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition cursor-pointer ${viewMode === "grid" ? "bg-teal-50 text-teal-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <IconGrid />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition cursor-pointer ${viewMode === "list" ? "bg-teal-50 text-teal-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <IconList />
            </button>
          </div>
        </div>
      </section>

      <div className="w-full bg-teal-50/50 pt-8 pb-20 min-h-[50vh]">
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8">
          {filteredBooks.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-5 md:gap-6">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="w-full transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
                  >
                    <Card book={book} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                {filteredBooks.map((book) => {
                  const bookTitle =
                    language === "en" && book.title_en
                      ? book.title_en
                      : book.title_id;
                  const bookDesc =
                    language === "en" && book.description_en
                      ? book.description_en
                      : book.description_id;
                  const coverUrl =
                    language === "en"
                      ? book.image_en || book.image_id || book.image
                      : book.image_id || book.image_en || book.image;

                  return (
                    <Link
                      key={book.id}
                      to={`${location.pathname}?preview=${book.id}`}
                      className="flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4 md:p-6 gap-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                    >
                      <div className="w-28 md:w-36 shrink-0 relative">
                        <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm relative">
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                          <img
                            src={getImageUrl(coverUrl)}
                            alt={bookTitle}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/150x220?text=Cover";
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center flex-1 py-2">
                        <h3 className="text-xl md:text-2xl font-extrabold text-gray-800 group-hover:text-teal-600 transition-colors">
                          {bookTitle}
                        </h3>
                        <p className="text-sm md:text-base text-gray-500 mt-3 line-clamp-3 leading-relaxed">
                          {bookDesc ||
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                        </p>
                        <div className="mt-4 mt-auto">
                          <span className="text-sm font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                            Baca Cerita →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-center py-24 text-gray-500 font-medium bg-white rounded-3xl border-2 border-dashed border-gray-200">
              {t("cd_empty")}
            </div>
          )}
        </section>
      </div>
      <CtaDownload />
    </div>
  );
};

export default CategoryDetail;
