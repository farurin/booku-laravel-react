import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Card from "./Card";
import { useLanguage } from "../context/LanguageContext";

const IconLike = () => (
  <div className="bg-black/5 p-1.5 rounded-full flex items-center justify-center shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  </div>
);
const IconStar = () => (
  <div className="bg-black/5 p-1.5 rounded-full flex items-center justify-center shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  </div>
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
    const latestBooks = [...books].sort((a, b) => b.id - a.id);
    const LIMIT = 12;

    return [
      {
        id: 0,
        label: t("car_tab_recom"),
        icon: <IconLike />,
        activeClass:
          "bg-booku-cyan text-gray-950 shadow-md border-transparent cursor-default",
        inactiveClass:
          "bg-transparent border-transparent text-gray-600 hover:bg-gray-200/50 cursor-pointer",
        items: recomBooks.slice(0, LIMIT),
      },
      {
        id: 1,
        label: t("car_tab_new"),
        icon: <IconStar />,
        activeClass:
          "bg-booku-yellow text-gray-955 shadow-md border-transparent cursor-default",
        inactiveClass:
          "bg-transparent border-transparent text-gray-600 hover:bg-gray-200/50 cursor-pointer",
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
    <section className="pt-14 pb-20 w-full bg-linear-to-b from-gray-50 via-white/10 to-booku-cyan overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-950 text-center lg:text-left tracking-tight">
            {searchQuery ? t("car_search_res") : t("car_title")}
          </h2>

          <div className="relative w-full lg:w-96 group">
            <input
              type="text"
              placeholder={t("car_search_ph")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-14 py-4 rounded-full border-4 border-white focus:outline-none focus:border-booku-cyan text-base font-bold text-gray-800 shadow-sm bg-white transition-all focus:shadow-md"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-booku-coral rounded-full flex items-center justify-center text-white shadow-sm transition-transform group-focus-within:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative w-full bg-white rounded-[40px] px-4 md:px-10 pt-8 pb-6 shadow-sm border-4 border-white">
          <div className="flex justify-center md:justify-start mb-8 md:ml-4">
            {!searchQuery && (
              <div className="bg-gray-100 p-1.5 rounded-full border-2 border-gray-50 flex gap-1 shadow-inner">
                {categoriesData.map((cat) => {
                  const isActive = activeTab === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-sm md:text-base transition-all select-none border-2 ${
                        isActive ? cat.activeClass : cat.inactiveClass
                      }`}
                    >
                      {cat.icon}
                      <span className="tracking-wide">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {listToDisplay.length > 0 ? (
            <div className="relative w-full">
              {/* PENYESUAIAN KUNCI: Wrapper Swiper diberi padding horizontal yang cukup lebar */}
              <div className="px-12 md:px-16 w-full">
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
                  className="w-full pt-2 pb-6"
                >
                  {listToDisplay.map((book) => (
                    <SwiperSlide key={book.id} style={{ width: "160px" }}>
                      <div className="h-full">
                        <Card book={book} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Panah ditempatkan secara absolut terhadap kontainer relative terluar, mengisi ruang padding Swiper */}
              <button className="carousel-prev absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-booku-coral hover:bg-booku-cyan hover:text-gray-950 transition-all border-2 border-gray-100 disabled:opacity-0 disabled:pointer-events-none cursor-pointer transform hover:scale-110 active:scale-95">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button className="carousel-next absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-booku-coral hover:bg-booku-cyan hover:text-gray-950 transition-all border-2 border-gray-100 disabled:opacity-0 disabled:pointer-events-none cursor-pointer transform hover:scale-110 active:scale-95">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400 font-black bg-gray-50 rounded-4xl border-4 border-dashed border-gray-200 my-4">
              <span className="text-4xl mb-3 animate-bounce">🔍</span>
              {searchQuery ? t("car_empty_search") : t("car_empty_cat")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
