import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CtaDownload from "../components/CtaDownload";
import BannerCorner from "../components/BannerCorner";
import bannerBg from "../assets/kategori_banner.png";
import bannerIcon from "../assets/kategori_icon.png";
import { getCategories, getBooks } from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";
import { useLanguage } from "../context/LanguageContext";

const IconArrowCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="12" r="12" fill="#F48F68" />
    <path
      d="M10.5 8L14.5 12L10.5 16"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Categories = () => {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
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

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center px-6 bg-booku-cream">
        <h2 className="text-2xl md:text-3xl font-black text-red-500 mb-2">
          {t("cat_err_title")}
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3.5 bg-booku-coral text-white rounded-xl font-bold shadow-md hover:bg-orange-500 transition cursor-pointer"
        >
          {t("btn_retry")}
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-gray-500 font-bold bg-booku-cream">
        <div className="w-12 h-12 border-4 border-booku-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
        {t("cat_loading")}
      </div>
    );
  }

  return (
    <div className="w-full bg-booku-cream min-h-screen">
      <BannerCorner
        title={t("cat_title")}
        bgImage={bannerBg}
        icon={bannerIcon}
      />

      <section className="w-full max-w-7xl mx-auto pt-16 px-4 md:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => {
            const storyCount = books.filter(
              (b) => b.id_categories === cat.id,
            ).length;
            const catName =
              language === "en" && cat.name_en ? cat.name_en : cat.name_id;

            return (
              <Link
                to={`/categories/${cat.id}`}
                key={cat.id}
                className="group block bg-white border-4 border-transparent rounded-4xl overflow-hidden shadow-sm hover:shadow-xl hover:border-booku-cyan hover:-translate-y-2 transition-all duration-300 relative"
              >
                <div className="w-full aspect-2/1 bg-booku-cyan/20 overflow-hidden relative">
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img
                    src={getImageUrl(cat.image_card)}
                    alt={catName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/600x300?text=Ilustrasi+Kategori";
                    }}
                  />
                </div>
                <div className="p-6 flex items-center justify-between bg-white relative z-20">
                  <h2 className="text-xl font-black text-gray-800 group-hover:text-booku-cyan transition-colors">
                    {catName}
                  </h2>
                  <div className="flex items-center gap-3 bg-booku-cream px-4 py-2 rounded-full border border-booku-yellow/50 group-hover:bg-booku-yellow transition-colors">
                    <span className="text-sm font-bold text-gray-800">
                      {storyCount} {t("cat_count")}
                    </span>
                    <IconArrowCircle />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <CtaDownload />
    </div>
  );
};

export default Categories;
