import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import { useLanguage } from "../context/LanguageContext";

const CategorySlider = ({ categories, activeCategoryId }) => {
  const { t, language } = useLanguage();
  const filtered = categories.filter((c) => c.name_id);
  const isDetailPage = activeCategoryId !== undefined;

  return (
    // my-10 dihapus, border dipertebal (border-y-2) dan warnanya disesuaikan
    <div className="w-full bg-white border-y-2 border-booku-yellow py-6 shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {!isDetailPage && (
          <p className="text-sm font-black text-booku-coral uppercase tracking-widest mb-4">
            {t("cat_slider_title")}
          </p>
        )}

        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          slidesPerView="auto"
          spaceBetween={12}
          className="w-full"
        >
          {filtered.map((category) => {
            const isActive =
              isDetailPage && category.id === parseInt(activeCategoryId);
            const categoryName =
              language === "en" && category.name_en
                ? category.name_en
                : category.name_id;

            return (
              <SwiperSlide key={category.id} style={{ width: "auto" }}>
                <Link
                  to={`/categories/${category.id}`}
                  className={`block px-6 py-3 rounded-full text-sm font-bold transition-all border-2 shadow-sm ${
                    isActive
                      ? "bg-booku-coral text-white border-booku-coral shadow-md scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:border-booku-cyan hover:bg-booku-cyan/10 hover:text-teal-800"
                  }`}
                >
                  <span className="opacity-60 mr-1">#</span> {categoryName}
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default CategorySlider;
