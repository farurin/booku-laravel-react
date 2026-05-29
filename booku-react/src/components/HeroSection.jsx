import React from "react";
import { Button } from "flowbite-react";
import logoImg from "../assets/logo-booku.png";
import badgePlaystore from "../assets/badge_playstore.png";
import iconBuku from "../assets/icon_buku.png";
import heroIllustration from "../assets/hero_illustration.png";
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();
  const handleScroll = () => {
    const targetSection = document.getElementById("jelajahi-cerita");
    if (targetSection) targetSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full px-4 md:px-8 mt-6 mb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto bg-booku-cream rounded-[48px] flex flex-col lg:flex-row items-center justify-between relative px-6 md:px-16 pt-12 pb-16 lg:py-24 gap-12 lg:gap-8 shadow-sm border border-booku-yellow/30">
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start order-1 lg:order-1 z-10 relative">
          <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-60"></div>
          <img
            src={heroIllustration}
            alt="Ilustrasi BookU"
            className="w-full max-w-md lg:max-w-xl object-contain drop-shadow-2xl animate-fade-in relative z-10"
          />
        </div>

        <div className="w-full lg:w-1/2 z-20 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-2">
          <img
            src={logoImg}
            alt="BookU App"
            className="w-full max-w-[280px] md:max-w-sm object-contain mb-8 drop-shadow-sm bg-white/50 p-4 rounded-3xl backdrop-blur-sm"
          />

          <p className="text-gray-800 mb-10 max-w-md text-lg md:text-xl font-medium leading-relaxed">
            {t("hero_subtitle") ||
              "Jelajahi dunia cerita interaktif yang seru dan mendidik untuk anak-anak."}
          </p>

          <Button
            onClick={handleScroll}
            className="bg-booku-coral! hover:bg-orange-500! border-0 rounded-2xl shadow-xl shadow-booku-coral/30 hover:-translate-y-1 transition-all duration-300 px-8! md:px-12! py-2! md:py-3! focus:ring-0 cursor-pointer"
          >
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <img
                src={iconBuku}
                alt="Icon Buku"
                className="w-6 h-6 md:w-8 md:h-8 object-contain"
              />
              <span className="text-white font-black text-base md:text-2xl tracking-wide uppercase">
                {t("hero_btn")}
              </span>
            </div>
          </Button>

          <div className="flex items-center justify-center lg:justify-start gap-4 my-8 w-full max-w-xs">
            <div className="h-0.5 bg-gray-300/50 flex-1"></div>
            <span className="text-gray-400 text-xs md:text-sm font-black uppercase tracking-widest">
              {t("hero_or")}
            </span>
            <div className="h-0.5 bg-gray-300/50 flex-1"></div>
          </div>

          <a
            href="#"
            className="hover:-translate-y-1 transition-transform duration-300 cursor-pointer block bg-white p-2 rounded-2xl shadow-sm border border-gray-100"
          >
            <img
              src={badgePlaystore}
              alt="Google Play"
              className="h-10 md:h-12 object-contain"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
