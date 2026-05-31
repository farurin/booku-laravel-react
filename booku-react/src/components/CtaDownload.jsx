import React from "react";
import badgePlaystore from "../assets/badge_playstore.png";
import badgeIos from "../assets/badge_ios.png";
import badgeAppgallery from "../assets/badge_appgallery.png";
import badgePhone from "../assets/badge_phone_new.png";
import { useLanguage } from "../context/LanguageContext";

const CtaDownload = () => {
  const { t } = useLanguage();

  return (
    // margin-top dihapus, border dihapus.
    // Ditambahkan rounded-b-[40px] dan z-20 agar melengkung manis di atas Footer
    <section className="w-full bg-booku-cream pt-16 md:pt-20 overflow-hidden relative rounded-b-[30px] md:rounded-b-[40px] z-20 shadow-sm">
      {/* Kontainer Utama */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 relative z-10">
        {/* KONTEN KIRI */}
        <div className="w-full lg:w-7/12 text-center lg:text-left mb-16 lg:mb-20 mt-4">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-gray-900 tracking-tight mb-5"
            dangerouslySetInnerHTML={{ __html: t("cta_title") }}
          />
          <p className="text-gray-800 font-medium text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-8">
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
                className="h-10 lg:h-12 object-contain drop-shadow-sm"
              />
            </a>
            <div className="flex flex-col items-center opacity-50 grayscale cursor-not-allowed">
              <img
                src={badgeIos}
                alt="App Store"
                className="h-10 lg:h-12 object-contain"
              />
            </div>
            <div className="flex flex-col items-center opacity-50 grayscale cursor-not-allowed">
              <img
                src={badgeAppgallery}
                alt="AppGallery"
                className="h-10 lg:h-12 object-contain"
              />
            </div>
          </div>
        </div>

        {/* GAMBAR KANAN */}
        <div className="w-full lg:w-5/12 flex justify-center lg:justify-end items-end h-full mt-auto">
          <img
            src={badgePhone}
            alt="App Mockup"
            className="w-full max-w-55 md:max-w-65 lg:max-w-75 object-contain drop-shadow-2xl relative z-20 origin-bottom hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default CtaDownload;
