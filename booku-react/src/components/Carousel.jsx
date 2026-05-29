import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Card from "./Card";
import { useLanguage } from "../context/LanguageContext";

// Icon SVG
const IconLike = () => (
  <div className="bg-white/30 p-1.5 rounded-full flex items-center justify-center shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  </div>
);
const IconFire = () => (
  <div className="bg-white/30 p-1.5 rounded-full flex items-center justify-center shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
    >
      <path d="M12 22C6.477 22 2 17.523 2 12c0-4.478 3.158-8.23 7.5-9.613.56-.178 1.096.34 1.01.916-.145.975-.125 2.15.534 3.057.48.567 1.22.905 2.015.892 1.458-.024 2.85-.79 3.513-2.072.28-.544 1.08-.432 1.25.158A9.972 9.972 0 0 1 22 12c0 5.523-4.477 10-10 10Zm-2-7a2 2 0 1 0 4 0c0-1.105-.895-2-2-2s-2 .895-2 2Z" />
    </svg>
  </div>
);
const IconStar = () => (
  <div className="bg-white/30 p-1.5 rounded-full flex items-center justify-center shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  </div>
);
const IconArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="#0D9488"
    stroke="#0D9488"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 5 L7 12 L15 19 Z" />
  </svg>
);
const IconArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="#0D9488"
    stroke="#0D9488"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 5 L17 12 L9 19 Z" />
  </svg>
);

const Carousel = ({ books = [] }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const categoriesData = useMemo(() => {
    const recomBooks = [...books].sort(
      (a, b) =>
        (b.favorites_count || 0) +
        (b.saved_count || 0) -
        ((a.favorites_count || 0) + (a.saved_count || 0)),
    );
    const popBooks = [...books].sort(
      (a, b) => (b.views_count || 0) - (a.views_count || 0),
    );
    const latestBooks = [...books].sort((a, b) => b.id - a.id);
    const LIMIT = 12;

    return [
      {
        id: 0,
        label: t("car_tab_recom"),
        icon: <IconLike />,
        activeClass: "bg-booku-cyan text-gray-800",
        inactiveClass: "bg-booku-cream/60 text-gray-500 hover:bg-booku-cream",
        items: recomBooks.slice(0, LIMIT),
      },
      {
        id: 1,
        label: t("car_tab_popular"),
        icon: <IconFire />,
        activeClass: "bg-booku-coral text-white",
        inactiveClass: "bg-booku-cream/60 text-gray-500 hover:bg-booku-cream",
        items: popBooks.slice(0, LIMIT),
      },
      {
        id: 2,
        label: t("car_tab_new"),
        icon: <IconStar />,
        activeClass: "bg-booku-yellow text-gray-800",
        inactiveClass: "bg-booku-cream/60 text-gray-500 hover:bg-booku-cream",
        items: latestBooks.slice(0, LIMIT),
      },
    ];
  }, [books, t]);

  const listToDisplay = useMemo(() => {
    if (searchQuery) {
      return books.filter((book) => {
        const titleToSearch =
          language === "en" && book.title_en ? book.title_en : book.title_id;
        return (titleToSearch || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    }
    return categoriesData[activeTab].items;
  }, [searchQuery, books, activeTab, categoriesData, language]);

  return (
    <section className="pt-16 pb-12 w-full bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        {/* JUDUL & SEARCH */}
        <div className="flex flex-col items-center justify-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6 text-center">
            {t("car_search_res")}
          </h2>
          <div className="relative w-full max-w-2xl group">
            <input
              type="text"
              placeholder={t("car_search_ph")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-booku-cream focus:outline-none focus:border-booku-cyan text-base text-gray-700 shadow-sm bg-gray-50 focus:bg-white transition-colors"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-booku-coral rounded-full flex items-center justify-center text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>
        </div>

        {/* DUA KOLOM: SIDEBAR & SLIDER */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* SIDEBAR TAB VERTICAL */}
          {!searchQuery && (
            <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
              {categoriesData.map((cat) => {
                const isActive = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap min-w-max lg:min-w-0 ${isActive ? `${cat.activeClass} shadow-lg scale-100 lg:scale-105` : cat.inactiveClass}`}
                  >
                    <div className={`${!isActive && "text-gray-400"}`}>
                      {cat.icon}
                    </div>
                    <span className="text-sm md:text-base tracking-wide">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* SLIDER BUKU */}
          <div className="flex-1 min-w-0 relative bg-booku-cream p-6 md:p-8 rounded-[32px] border border-booku-yellow/50 shadow-sm">
            {listToDisplay.length > 0 ? (
              <>
                <div className="absolute top-4 right-6 z-20 flex gap-2">
                  <button className="carousel-prev w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-booku-coral hover:bg-booku-yellow transition disabled:opacity-30 border border-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button className="carousel-next w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-booku-coral hover:bg-booku-yellow transition disabled:opacity-30 border border-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>

                <div className="mt-8">
                  <Swiper
                    key={searchQuery ? "search" : `tab-${activeTab}`}
                    modules={[Autoplay, Navigation]}
                    navigation={{
                      prevEl: ".carousel-prev",
                      nextEl: ".carousel-next",
                    }}
                    slidesPerView="auto"
                    spaceBetween={24}
                    autoplay={
                      searchQuery
                        ? false
                        : { delay: 3500, disableOnInteraction: false }
                    }
                    className="w-full pb-8 pt-4 px-2"
                  >
                    {listToDisplay.map((book) => (
                      <SwiperSlide key={book.id} style={{ width: "160px" }}>
                        <div className="h-full hover:-translate-y-2 transition-transform duration-300">
                          <Card book={book} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </>
            ) : (
              <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500 font-bold bg-white rounded-2xl border-2 border-dashed border-booku-yellow">
                <span className="text-4xl mb-4">🔍</span>
                {searchQuery ? t("car_empty_search") : t("car_empty_cat")}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
