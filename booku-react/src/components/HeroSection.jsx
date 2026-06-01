import React from "react";
import heroIllustration from "../assets/hero_illustration.png";
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative w-full px-4 md:px-8 pt-6 md:pt-10 pb-6 overflow-hidden">
      {/* KUNCI KONTRAS 1: Border putih tebal (border-[6px] atau [8px]) dan drop shadow */}
      <div className="max-w-7xl mx-auto bg-booku-cream rounded-[40px] flex flex-col lg:flex-row items-center justify-between relative px-6 md:px-12 py-10 lg:py-16 gap-10 lg:gap-6 shadow-xl shadow-booku-yellow/10 border-8 border-booku-cyan overflow-hidden">
        {/* KIRI: Teks */}
        <div className="w-full lg:w-1/2 z-20 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* KUNCI KONTRAS 2: Badge Anchor di atas judul menggunakan translation */}
          <div className="inline-block px-5 py-2 bg-white text-booku-coral font-black rounded-full text-xs md:text-sm mb-6 border-2 border-booku-coral/20 shadow-sm uppercase tracking-widest transform -rotate-2">
            {t("hero_badge")}
          </div>

          {/* Tipografi dipertegas dengan leading-[1.1] dan teks lebih gelap */}
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-gray-950 mb-6 leading-[1.1] tracking-tight">
            {t("hero_title")}
          </h1>

          <p className="text-gray-700 max-w-md text-base md:text-xl font-bold leading-relaxed">
            {t("hero_subtitle")}
          </p>
        </div>

        {/* KANAN: Ilustrasi */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end z-10 relative mt-4 lg:mt-0">
          {/* KUNCI KONTRAS 3: Lingkaran Solid + Dashed Border di belakang ilustrasi */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-[320px] md:h-80 bg-booku-cyan/20 rounded-full border-4 border-dashed border-booku-cyan/40 z-0"></div>

          <img
            src={heroIllustration}
            alt="Ilustrasi BookU"
            className="w-full max-w-70 md:max-w-sm lg:max-w-105 object-contain drop-shadow-2xl relative z-10 hover:-translate-y-3 hover:scale-105 transition-all duration-500 ease-out cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
