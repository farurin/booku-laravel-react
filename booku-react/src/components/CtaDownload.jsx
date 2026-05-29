import React from "react";
import badgePlaystore from "../assets/badge_playstore.png";
import badgeIos from "../assets/badge_ios.png";
import badgeAppgallery from "../assets/badge_appgallery.png";
import badgePhone from "../assets/badge_phone_new.png";
import { useLanguage } from "../context/LanguageContext";

const CtaDownload = () => {
  const { t } = useLanguage();

  return (
    <section className="w-full px-4 md:px-8 py-16 lg:py-24">
      {/* Diubah jadi Floating Card Raksasa */}
      <div className="w-full max-w-7xl mx-auto bg-booku-yellow rounded-[48px] lg:rounded-[64px] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between p-8 lg:p-16 shadow-[0_20px_50px_rgba(255,227,148,0.5)] border-8 border-white">
        {/* Dekorasi Blob Cyan di background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-booku-cyan/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

        {/* KONTEN KIRI */}
        <div className="max-w-lg lg:max-w-xl text-center lg:text-left relative z-10">
          <h1
            className="text-4xl md:text-5xl lg:text-[54px] font-black leading-[1.1] text-gray-900 tracking-tight"
            dangerouslySetInnerHTML={{ __html: t("cta_title") }}
          />
          <p className="mt-6 text-gray-700 font-medium text-base md:text-lg max-w-md mx-auto lg:mx-0 bg-white/50 p-4 rounded-2xl backdrop-blur-sm">
            {t("cta_desc")}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 bg-white/40 p-3 rounded-3xl backdrop-blur-md w-max mx-auto lg:mx-0 border border-white/60">
            <a
              href="#"
              className="transition-transform hover:scale-105 hover:-translate-y-1"
            >
              <img
                src={badgePlaystore}
                alt="Google Play"
                className="h-10 lg:h-12 object-contain drop-shadow-sm"
              />
            </a>
            <div className="flex flex-col items-center opacity-60 grayscale cursor-not-allowed">
              <img
                src={badgeIos}
                alt="App Store"
                className="h-10 lg:h-12 object-contain"
              />
            </div>
            <div className="flex flex-col items-center opacity-60 grayscale cursor-not-allowed">
              <img
                src={badgeAppgallery}
                alt="AppGallery"
                className="h-10 lg:h-12 object-contain"
              />
            </div>
          </div>
        </div>

        {/* GAMBAR KANAN (Melayang ke luar batas) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-end h-full mt-12 lg:mt-0 relative z-10 lg:-mr-12 lg:-mb-24">
          <img
            src={badgePhone}
            alt="App Mockup"
            className="w-[80%] md:w-[60%] lg:w-[110%] object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default CtaDownload;
