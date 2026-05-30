import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Card from "./Card";
import { useLanguage } from "../context/LanguageContext";

// Icon SVG disesuaikan agar adaptif menggunakan currentColor dan bg-black/10
const IconLike = () => (
  <div className="bg-black/10 p-1.5 rounded-full flex items-center justify-center shrink-0">
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
const IconFire = () => (
  <div className="bg-black/10 p-1.5 rounded-full flex items-center justify-center shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 22C6.477 22 2 17.523 2 12c0-4.478 3.158-8.23 7.5-9.613.56-.178 1.096.34 1.01.916-.145.975-.125 2.15.534 3.057.48.567 1.22.905 2.015.892 1.458-.024 2.85-.79 3.513-2.072.28-.544 1.08-.432 1.25.158A9.972 9.972 0 0 1 22 12c0 5.523-4.477 10-10 10Zm-2-7a2 2 0 1 0 4 0c0-1.105-.895-2-2-2s-2 .895-2 2Z" />
    </svg>
  </div>
);
const IconStar = () => (
  <div className="bg-black/10 p-1.5 rounded-full flex items-center justify-center shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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
        activeClass:
          "bg-booku-cyan border-booku-cyan text-gray-900 shadow-md cursor-default",
        inactiveClass:
          "bg-booku-cyan/15 border-booku-cyan/30 text-teal-700 hover:bg-booku-cyan/30 cursor-pointer",
        items: recomBooks.slice(0, LIMIT),
      },
      {
        id: 1,
        label: t("car_tab_popular"),
        icon: <IconFire />,
        activeClass:
          "bg-booku-coral border-booku-coral text-white shadow-md cursor-default",
        inactiveClass:
          "bg-booku-coral/10 border-booku-coral/30 text-orange-600 hover:bg-booku-coral/20 cursor-pointer",
        items: popBooks.slice(0, LIMIT),
      },
      {
        id: 2,
        label: t("car_tab_new"),
        icon: <IconStar />,
        activeClass:
          "bg-booku-yellow border-booku-yellow text-gray-900 shadow-md cursor-default",
        inactiveClass:
          "bg-booku-yellow/20 border-booku-yellow/40 text-yellow-700 hover:bg-booku-yellow/40 cursor-pointer",
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
    <section className="pt-12 pb-16 w-full bg-linear-to-b from-gray-50 to-booku-cyan/15 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        {/* HEADER: Judul & Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 text-center lg:text-left">
            {searchQuery ? t("car_search_res") : "Jelajahi Cerita"}
          </h2>

          <div className="relative w-full lg:w-96 group">
            <input
              type="text"
              placeholder={t("car_search_ph")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-14 py-3.5 rounded-full border-2 border-white focus:outline-none focus:border-booku-cyan text-base text-gray-700 shadow-sm bg-white transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-booku-coral rounded-full flex items-center justify-center text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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

        {/* CONTAINER KONTEN - Dibungkus ke dalam div dengan background putih semi-transparan */}
        <div className="relative w-full bg-white/80 backdrop-blur-sm rounded-4xl md:rounded-[40px] px-6 md:px-10 pt-8 pb-4 shadow-sm border border-white">
          {/* KONTROL: Tabs Horizontal & Tombol Panah */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
            {!searchQuery && (
              <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide px-1">
                {categoriesData.map((cat) => {
                  const isActive = activeTab === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`flex items-center gap-3 px-5 py-2.5 rounded-full font-bold transition-all whitespace-nowrap min-w-max border-2 ${
                        isActive ? cat.activeClass : cat.inactiveClass
                      }`}
                    >
                      <div className={`${!isActive && "opacity-70"}`}>
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

            {listToDisplay.length > 0 && (
              <div className="flex gap-2 ml-auto shrink-0 px-1">
                <button className="carousel-prev w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-booku-coral hover:bg-booku-cyan transition disabled:opacity-30 border border-gray-100 cursor-pointer">
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
                <button className="carousel-next w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-booku-coral hover:bg-booku-cyan transition disabled:opacity-30 border border-gray-100 cursor-pointer">
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
            )}
          </div>

          {/* SLIDER BUKU */}
          {listToDisplay.length > 0 ? (
            <div className="-mx-4 px-4">
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
                className="w-full pt-4! pb-8!"
              >
                {listToDisplay.map((book) => (
                  <SwiperSlide key={book.id} style={{ width: "160px" }}>
                    <div className="h-full hover:-translate-y-3 transition-transform duration-300">
                      <Card book={book} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500 font-bold bg-white/50 rounded-3xl border-2 border-dashed border-gray-300 my-6">
              <span className="text-4xl mb-4">🔍</span>
              {searchQuery ? t("car_empty_search") : t("car_empty_cat")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
