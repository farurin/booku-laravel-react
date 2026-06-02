import React from "react";
import { useLanguage } from "../context/LanguageContext";

// Dekorasi Kiri: Awan dan Matahari Ceria
const DecoLeft = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md"
  >
    <circle cx="35" cy="45" r="24" className="fill-booku-yellow" />
    <path
      d="M30 75C16.193 75 16.193 53.571 30 53.571C37.143 32.143 72.857 32.143 80 53.571C101.429 53.571 101.429 75 87.143 75H30Z"
      className="fill-white/40"
    />
  </svg>
);

// Dekorasi Kanan: Bintang Bersinar
const DecoRight = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md"
  >
    <path
      d="M40 10L47.5 32.5L70 40L47.5 47.5L40 70L32.5 47.5L10 40L32.5 32.5L40 10Z"
      className="fill-booku-yellow"
    />
    <path
      d="M80 60L83 70L93 73L83 76L80 86L77 76L67 73L77 70L80 60Z"
      className="fill-white/60"
    />
    <path
      d="M75 15L76.5 20L81.5 21.5L76.5 23L75 28L73.5 23L68.5 21.5L73.5 20L75 15Z"
      className="fill-white/40"
    />
  </svg>
);

const BannerCorner = ({ title, description }) => {
  const { t } = useLanguage();
  const displayTitle = title || t("bc_title");
  const displayDesc = description || t("bc_desc");

  return (
    <section className="w-full pt-8">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative w-full h-auto min-h-40 md:min-h-50 py-10 bg-booku-coral rounded-4xl md:rounded-[48px] flex items-center justify-center overflow-hidden shadow-sm border-4 border-white">
          <div className="absolute -left-4 md:left-4 top-1/2 -translate-y-1/2 opacity-60 md:opacity-100 pointer-events-none">
            <DecoLeft />
          </div>

          <div className="absolute -right-2 md:right-8 top-1/2 -translate-y-1/2 opacity-60 md:opacity-100 pointer-events-none">
            <DecoRight />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3 w-full px-12 md:px-32">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-black capitalize tracking-tight drop-shadow-sm">
              {displayTitle}
            </h1>
            <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed drop-shadow-sm max-w-xl">
              {displayDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerCorner;
