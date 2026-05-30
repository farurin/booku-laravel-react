import React from "react";
import heroIllustration from "../assets/hero_illustration.png";
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    // Padding atas-bawah pada section dikurangi (pt-6 md:pt-8 pb-4)
    <section className="relative w-full px-4 md:px-8 pt-6 md:pt-8 pb-4 overflow-hidden">
      {/* Padding dalam div krem dikurangi secara signifikan (py-8 lg:py-10) */}
      <div className="max-w-7xl mx-auto bg-booku-cream rounded-4xl md:rounded-[40px] flex flex-col lg:flex-row items-center justify-between relative px-6 md:px-12 py-8 lg:py-10 gap-8 lg:gap-6 shadow-sm border border-booku-yellow/30">
        {/* KIRI: Teks Saja */}
        <div className="w-full lg:w-1/2 z-20 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 lg:mb-5 leading-tight lg:leading-tight">
            {t("hero_title")}
          </h1>

          <p className="text-gray-700 max-w-md text-base md:text-lg font-medium leading-relaxed">
            {t("hero_subtitle")}
          </p>
        </div>

        {/* KANAN: Ilustrasi */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end z-10 relative">
          <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-60"></div>
          {/* max-w untuk layar besar diturunkan dari max-w-lg menjadi max-w-md agar tidak mendongkrak tinggi kontainer */}
          <img
            src={heroIllustration}
            alt="Ilustrasi BookU"
            className="w-full max-w-70 md:max-w-sm lg:max-w-md object-contain drop-shadow-2xl animate-fade-in relative z-10 hover:-translate-y-2 transition-transform duration-500 ease-out"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
