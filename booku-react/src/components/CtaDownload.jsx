import React, { useState, useEffect } from "react";
import badgePlaystore from "../assets/badge_playstore.png";
import badgeIos from "../assets/badge_ios.png";
import badgeAppgallery from "../assets/badge_appgallery.png";
import badgePhone from "../assets/badge_phone_new.png";
import { useLanguage } from "../context/LanguageContext";
import { getBooks, getCategories } from "../services/api";

const CtaDownload = () => {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState({ books: 0, categories: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksData, categoriesData] = await Promise.all([
          getBooks(),
          getCategories(),
        ]);
        setStats({
          books: booksData?.length || 0,
          categories: categoriesData?.length || 0,
        });
      } catch (error) {
        console.error("Gagal mengambil statistik untuk CTA:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    // Layer Luar: Background Penuh
    <section className="w-full bg-booku-cream pt-16 md:pt-20 overflow-hidden relative rounded-b-[30px] md:rounded-b-[40px] z-20 shadow-sm">
      {/* Dekorasi Background CSS Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-booku-yellow/20 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/2 w-48 h-48 bg-booku-cyan/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Layer Dalam: Constrained Content (Standarisasi menjadi px-4 md:px-8) */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 relative z-10">
        {/* KONTEN KIRI */}
        <div className="w-full lg:w-7/12 text-center lg:text-left mb-16 lg:mb-20 mt-4 flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border-4 border-white shadow-sm mb-6 transition-all hover:scale-105 cursor-default relative z-10">
            <span className="text-2xl">📚</span>
            {isLoading ? (
              <div className="h-5 w-48 bg-gray-100 rounded-full animate-pulse"></div>
            ) : (
              <p
                className="text-sm md:text-base font-black text-gray-700 tracking-wide"
                dangerouslySetInnerHTML={{
                  __html: t("cta_stats")
                    .replace("{{books}}", stats.books)
                    .replace("{{categories}}", stats.categories),
                }}
              />
            )}
          </div>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black leading-[1.15] text-gray-950 tracking-tight mb-5"
            dangerouslySetInnerHTML={{ __html: t("cta_title") }}
          />
          <p className="text-gray-700 font-bold text-base md:text-lg max-w-lg mb-8 leading-relaxed">
            {t("cta_desc")}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#"
              className="transition-transform hover:scale-105 hover:-translate-y-1"
            >
              <img
                src={badgePlaystore}
                alt="Google Play"
                className="h-12 lg:h-14 object-contain drop-shadow-sm"
              />
            </a>
            <div className="flex flex-col items-center opacity-50 grayscale cursor-not-allowed">
              <img
                src={badgeIos}
                alt="App Store"
                className="h-12 lg:h-14 object-contain"
              />
            </div>
            <div className="flex flex-col items-center opacity-50 grayscale cursor-not-allowed">
              <img
                src={badgeAppgallery}
                alt="AppGallery"
                className="h-12 lg:h-14 object-contain"
              />
            </div>
          </div>
        </div>

        {/* GAMBAR KANAN */}
        <div className="w-full lg:w-5/12 flex justify-center lg:justify-end items-end h-full mt-auto relative">
          <div className="absolute bottom-0 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-10 w-64 h-64 bg-white/60 rounded-full blur-2xl z-0 pointer-events-none"></div>

          <img
            src={badgePhone}
            alt="App Mockup"
            className="w-full max-w-60 md:max-w-xs lg:max-w-sm object-contain drop-shadow-2xl relative z-20 origin-bottom hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default CtaDownload;
