import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Pastikan logo ini versi warna terang/putih jika background gelap!
import LogoDuniaDongeng from "../assets/logo-booku.png";
import { useLanguage } from "../context/LanguageContext";
import { getCategories } from "../services/api";

// SVG icon diperkecil dan dibuat minimalis tanpa background bulat
const IconInstagram = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const IconTwitter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);
const IconYoutube = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.17 1 12 1 12s0 3.83.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.83 23 12 23 12s0-3.83-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

export default function FooterComponent() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const dataCategories = response.data || response;
        setCategories(dataCategories.slice(0, 6));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="w-full bg-gray-900 text-gray-300 pt-20 pb-8 mt-auto rounded-t-[40px] md:rounded-t-[80px] mt-10">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-12 border-b border-gray-800 pb-16">
          {/* KIRI: Logo Besar */}
          <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="bg-white p-5 rounded-3xl mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <img
                src={LogoDuniaDongeng}
                alt="Logo BookU"
                className="h-10 md:h-12 object-contain"
              />
            </div>
            <p className="text-lg font-medium text-gray-400 leading-relaxed mb-8 max-w-md">
              Membangun imajinasi anak bangsa melalui cerita interaktif yang
              edukatif dan menyenangkan.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-booku-cyan hover:bg-booku-cyan hover:text-gray-900 transition-all"
              >
                <IconInstagram />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-booku-coral hover:bg-booku-coral hover:text-white transition-all"
              >
                <IconTwitter />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-booku-yellow hover:bg-booku-yellow hover:text-gray-900 transition-all"
              >
                <IconYoutube />
              </a>
            </div>
          </div>

          {/* KANAN: Grid Link */}
          <div className="w-full lg:w-6/12 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div className="flex flex-col gap-5">
              <h4 className="font-black text-white uppercase tracking-widest text-sm mb-2 opacity-50">
                Platform
              </h4>
              <Link
                to="/about"
                className="text-gray-300 font-bold hover:text-booku-cyan transition-colors"
              >
                Tentang Kami
              </Link>
              <Link
                to="/corner"
                className="text-gray-300 font-bold hover:text-booku-cyan transition-colors"
              >
                Pojok Baca
              </Link>
              <Link
                to="/categories"
                className="text-gray-300 font-bold hover:text-booku-cyan transition-colors"
              >
                Jelajah Cerita
              </Link>
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col gap-5">
              <h4 className="font-black text-white uppercase tracking-widest text-sm mb-2 opacity-50">
                {t("foot_category_title") || "Kategori"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {categories.length > 0 ? (
                  categories.map((category) => {
                    const catName =
                      language === "en" && category.name_en
                        ? category.name_en
                        : category.name_id;
                    return (
                      <Link
                        key={category.id}
                        to={`/categories/${category.id}`}
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-gray-300 font-bold hover:text-booku-yellow transition-colors flex items-center gap-2"
                      >
                        <span className="text-booku-yellow text-xl leading-none opacity-50">
                          •
                        </span>{" "}
                        {catName}
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-gray-600 text-sm">Memuat...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-widest">
          <p>© 2026 EduKids Project - Universitas.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-booku-cream transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-booku-cream transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
