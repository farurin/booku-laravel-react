import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoDuniaDongeng from "../assets/logo-booku.png";
import { useLanguage } from "../context/LanguageContext";
import { getCategories } from "../services/api";

const IconInstagram = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
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
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);
const IconYoutube = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
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
    // margin-top diubah jadi negatif (-mt-10) agar masuk ke bawah lengkungan CtaDownload.
    // pt (padding-top) ditambah agar kontennya tidak tertutup lengkungan tersebut.
    // rounded-t dihapus karena sisi atasnya sudah tertutup oleh CtaDownload.
    <footer className="w-full bg-booku-cyan text-gray-900 pt-20 pb-6 -mt-10 relative z-10">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-10 border-b border-gray-900/10 pb-8">
          {/* KIRI: Logo & Deskripsi */}
          <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="bg-white px-5 py-3 rounded-2xl mb-5 shadow-sm border border-gray-100">
              <img
                src={LogoDuniaDongeng}
                alt="Logo BookU"
                className="h-8 md:h-10 object-contain"
              />
            </div>
            <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed mb-6 max-w-sm">
              {t("foot_desc")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-800 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
              >
                <IconInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-800 hover:bg-booku-coral hover:text-white transition-all shadow-sm"
              >
                <IconTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-800 hover:bg-booku-yellow hover:text-gray-900 transition-all shadow-sm"
              >
                <IconYoutube />
              </a>
            </div>
          </div>

          {/* KANAN: Grid Link */}
          <div className="w-full lg:w-6/12 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-1 opacity-70">
                {t("foot_platform")}
              </h4>
              <Link
                to="/about"
                className="text-gray-800 font-bold hover:text-white transition-colors text-sm md:text-base"
              >
                {t("foot_about")}
              </Link>
              <Link
                to="/corner"
                className="text-gray-800 font-bold hover:text-white transition-colors text-sm md:text-base"
              >
                {t("foot_corner")}
              </Link>
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
              <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-1 opacity-70">
                {t("foot_category_title")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
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
                        className="text-gray-800 font-bold hover:text-white transition-colors flex items-center gap-2 text-sm md:text-base"
                      >
                        <span className="text-white text-lg leading-none">
                          •
                        </span>{" "}
                        {catName}
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-gray-700 text-sm font-bold">
                    {t("foot_loading")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT CENTERED - Dijadikan 1 Baris */}
        <div className="flex justify-center pt-6 text-[11px] md:text-xs font-black text-gray-800 uppercase tracking-wider text-center">
          <p>
            {t("foot_copyright")} &nbsp;|&nbsp; {t("foot_made_with")}{" "}
            <a
              href="https://github.com/farurin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-booku-coral underline decoration-2 underline-offset-2 transition-colors"
            >
              Farurin
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
