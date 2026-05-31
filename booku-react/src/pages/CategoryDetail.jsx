import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BannerCorner from "../components/BannerCorner";
import CtaDownload from "../components/CtaDownload";
import Card from "../components/Card";
import CategorySlider from "../components/CategorySlider";
import { getCategories, getBooks } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

// Icon Search disesuaikan untuk tombol bulat warna coral
const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CategoryDetail = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");

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

  // Mengambil Nama Kategori
  const catName = category
    ? language === "en" && category.name_en
      ? category.name_en
      : category.name_id
    : t("cat_title");

  // Mengambil Deskripsi Kategori
  const catDesc = category
    ? language === "en" && category.description_en
      ? category.description_en
      : category.description_id || t("cd_fallback_desc")
    : t("cd_fallback_desc");

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
      <div className="w-full h-screen flex flex-col items-center justify-center text-center px-6 bg-booku-cream">
        <h2 className="text-2xl md:text-3xl font-black text-red-500 mb-4">
          {t("cat_err_col")}
        </h2>
        <p className="text-gray-700 font-medium mb-8 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3.5 bg-booku-coral text-white rounded-full font-bold shadow-md hover:bg-orange-500 transition cursor-pointer"
        >
          {t("btn_retry")}
        </button>
      </div>
    );

  if (isLoading)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-booku-cream">
        <div className="w-12 h-12 border-4 border-booku-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-gray-500 font-bold text-lg">
          {t("cd_loading")}
        </span>
      </div>
    );

  return (
    <div className="w-full bg-booku-cream min-h-screen">
      {/* Banner melempar title dan description sesuai kategori yang dipilih */}
      <BannerCorner title={catName} description={catDesc} />

      {/* Slider Kategori */}
      <div className="mt-8 mb-4">
        <CategorySlider categories={categories} activeCategoryId={id} />
      </div>

      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-12 mb-20">
        {/* Search Bar - Chunky Style (Centered) */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-2xl group">
            <input
              type="text"
              placeholder={t("cd_search")}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-6 pr-16 py-4 md:py-5 rounded-full border-4 border-white focus:outline-none focus:border-booku-cyan text-base md:text-lg text-gray-800 font-bold placeholder-gray-400 shadow-sm bg-white transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-booku-coral rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-orange-500 transition-colors">
              <IconSearch />
            </div>
          </div>
        </div>

        {/* Kontainer Rak Buku (White Island) */}
        <div className="w-full bg-white rounded-[40px] md:rounded-[48px] p-6 md:p-10 lg:p-12 shadow-sm border border-gray-100 min-h-[40vh]">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 justify-items-center">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="w-full max-w-45 transition-transform duration-300 hover:-translate-y-3 cursor-pointer"
                >
                  <Card book={book} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-booku-cream/40 rounded-3xl border-2 border-dashed border-booku-yellow">
              <span className="text-5xl mb-4 block">🔍</span>
              <p className="text-gray-500 font-bold text-lg text-center max-w-md">
                {t("cd_empty")}
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaDownload />
    </div>
  );
};

export default CategoryDetail;
