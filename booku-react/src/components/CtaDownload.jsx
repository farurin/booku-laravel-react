import React, { useState, useEffect } from "react";
import badgePlaystore from "../assets/badge_playstore.png";
import badgeIos from "../assets/badge_ios.png";
import badgeAppgallery from "../assets/badge_appgallery.png";
import badgePhone from "../assets/badge_phone_new.png";
import { useLanguage } from "../context/LanguageContext";
import { getBooks, getCategories } from "../services/api";

const CtaDownload = () => {
  const { t } = useLanguage();
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

  // --- PERBAIKAN KONTRAST TEKS ---
  // Kita timpa warna text-booku-cyan dan coral dari translation.js menjadi text-gray-900
  // agar terlihat jelas di atas background pita cyan.
  let statsHtml = t("cta_stats")
    .replace("text-booku-coral", "text-gray-900")
    .replace("text-booku-cyan", "text-gray-900");

  // Inject gaya pill stat
  statsHtml = statsHtml
    .replace(
      "{{books}}",
      `<span class="inline-block text-white bg-booku-coral px-3 py-1 rounded-xl border-2 border-white mx-1 shadow-sm leading-none align-middle">${stats.books}</span>`,
    )
    .replace(
      "{{categories}}",
      `<span class="inline-block text-gray-900 bg-booku-yellow px-3 py-1 rounded-xl border-2 border-white mx-1 shadow-sm leading-none align-middle">${stats.categories}</span>`,
    );

  return (
    // Layer Luar: Background Penuh untuk seluruh CtaDownload
    <section className="w-full bg-booku-cream overflow-hidden relative rounded-b-[30px] md:rounded-b-[40px] z-20 shadow-sm flex flex-col">
      {/* SECTION ATAS: Pita Statistik (Diberi border kuning atas-bawah ala CategorySlider) */}
      <div className="w-full bg-white border-y-4 border-booku-cyan py-4 md:py-6 shadow-sm z-30 relative">
        {/* Constrained Content Pita */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-center relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-center">
            <span className="text-3xl md:text-4xl animate-bounce">📚</span>
            {isLoading ? (
              <div className="h-8 w-56 md:w-72 bg-white/40 rounded-full animate-pulse"></div>
            ) : (
              <p
                className="text-base md:text-lg lg:text-xl font-black text-gray-900 tracking-wide drop-shadow-sm flex items-center flex-wrap justify-center"
                dangerouslySetInnerHTML={{ __html: statsHtml }}
              />
            )}
          </div>
        </div>
      </div>

      {/* SECTION BAWAH: Area Download App */}
      <div className="relative pt-12 md:pt-16 w-full flex-1">
        {/* Dekorasi Background CSS Shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-booku-yellow/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-1/2 w-48 h-48 bg-booku-cyan/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Constrained Content Area Download */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 relative z-10">
          {/* KONTEN KIRI */}
          <div className="w-full lg:w-7/12 text-center lg:text-left mb-16 lg:mb-20 mt-4 flex flex-col items-center lg:items-start">
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
      </div>
    </section>
  );
};

export default CtaDownload;
