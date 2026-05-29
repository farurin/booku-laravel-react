import React from "react";
import defaultBg from "../assets/pojokbaca_banner.png";
import defaultIcon from "../assets/pojokbaca_icon.png";
import { useLanguage } from "../context/LanguageContext";

const BannerCorner = ({ title, bgImage = defaultBg, icon = defaultIcon }) => {
  const { t } = useLanguage();
  const displayTitle = title || t("bc_title");

  return (
    <div
      className="w-full relative h-40 md:h-56 lg:h-64 flex items-center justify-center overflow-hidden rounded-b-3xl"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay gradient Teal dan Coral */}
      <div className="absolute inset-0 bg-gradient-to-r from-booku-cyan/80 to-booku-coral/80 mix-blend-multiply"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5 w-full max-w-7xl mx-auto px-4 mt-2">
        {icon && (
          <div className="bg-white/20 p-2 md:p-3 rounded-full backdrop-blur-sm border border-white/30">
            <img
              src={icon}
              alt="Banner Icon"
              className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain drop-shadow-lg"
            />
          </div>
        )}

        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-extrabold capitalize drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {displayTitle}
        </h1>
      </div>
    </div>
  );
};

export default BannerCorner;
