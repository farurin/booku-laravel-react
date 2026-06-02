import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import BannerCorner from "../components/BannerCorner";
import CtaDownload from "../components/CtaDownload";

// Hanya menggunakan logo
import logoImg from "../assets/logo-booku.png";

const About = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    // Layer Luar: Full-Bleed
    <div className="w-full bg-booku-cream min-h-screen">
      <BannerCorner title={t("about_heading")} description={t("about_desc")} />

      {/* Layer Dalam: Diubah jadi max-w-7xl untuk standardisasi jarak tepi */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 flex flex-col items-center text-center">
        {/* Logo BookU */}
        <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-gray-100 mb-12 mt-4 hover:scale-105 transition-transform duration-300">
          <img
            src={logoImg}
            alt="BookU Logo"
            className="w-48 md:w-64 object-contain"
          />
        </div>

        {/* Teks Penjelasan */}
        <div className="max-w-3xl flex flex-col gap-6 mb-12 w-full">
          <p className="text-gray-700 font-medium text-base md:text-lg leading-relaxed bg-white/50 p-8 md:px-12 rounded-4xl shadow-sm border border-booku-yellow/20">
            {t("about_p1")}
          </p>
        </div>

        {/* Penutup */}
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100 w-full max-w-3xl mb-12">
          <p className="text-gray-900 text-xl md:text-2xl font-black leading-relaxed">
            {t("about_closing")}
          </p>
        </div>
      </div>

      <CtaDownload />
    </div>
  );
};

export default About;
