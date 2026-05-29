import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Carousel from "../components/Carousel";
import CategorySlider from "../components/CategorySlider";
import BookListSection from "../components/BookListSection";
import CtaDownload from "../components/CtaDownload";
import { getCategories, getBooks } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);

  const [, setActiveCategory] = useState("Semua");
  const [, setSearch] = useState("");

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
        console.error("Error fetching data:", err);
        setError(err.message || "Gagal terhubung ke server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoriesWithBooks = categories.map((cat) => ({
    ...cat,
    books: books.filter((b) => b.id_categories === cat.id),
  }));

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-50">
        <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-2">
          {t("home_err_title")}
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-teal-600 text-white rounded-full font-bold shadow-md hover:bg-teal-700 transition cursor-pointer"
        >
          {t("home_btn_reload")}
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-teal-600 font-bold text-xl bg-slate-50">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        {t("home_loading")}
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <HeroSection />
      <div id="jelajahi-cerita" className="scroll-mt-24 md:scroll-mt-28">
        <Carousel
          books={books}
          onChangeCategory={setActiveCategory}
          onSearch={setSearch}
        />
      </div>
      <CategorySlider categories={categories} />
      <BookListSection data={categoriesWithBooks} />
      <CtaDownload />
    </div>
  );
};

export default Home;
