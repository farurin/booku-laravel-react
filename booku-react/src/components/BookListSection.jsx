import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Card from "./Card";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export const CategorySection = ({ category, index = 0 }) => {
  const { t, language } = useLanguage();
  const booksToShow = category.books ? category.books.slice(0, 10) : [];

  const catName =
    language === "en" && category.name_en ? category.name_en : category.name_id;
  const catDesc =
    language === "en" && category.description_en
      ? category.description_en
      : category.description_id;

  const themes = [
    {
      bg: "bg-booku-cyan",
      text: "text-gray-900",
      desc: "text-gray-800",
      btn: "text-booku-coral hover:text-white",
    },
    {
      bg: "bg-booku-coral",
      text: "text-white",
      desc: "text-white/90",
      btn: "text-booku-yellow hover:text-white",
    },
    {
      bg: "bg-booku-yellow",
      text: "text-gray-900",
      desc: "text-gray-800",
      btn: "text-booku-coral hover:text-white",
    },
  ];

  const theme = themes[index % themes.length];

  return (
    <div className="w-full mb-12 lg:mb-16 bg-white rounded-4xl md:rounded-[40px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-6">
      {/* Kolom Judul & Dekorasi Kategori (KIRI) */}
      <div
        className={`w-full xl:w-72 shrink-0 relative overflow-hidden rounded-2xl md:rounded-[28px] ${theme.bg} group flex flex-col justify-between p-6 md:p-8 min-h-60`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-8 h-8 border-4 border-white/30 rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-4 w-4 h-4 bg-white/40 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex-1 flex flex-col justify-end">
          <h3
            className={`text-2xl md:text-3xl lg:text-4xl font-black mb-3 leading-tight ${theme.text}`}
          >
            {catName}
          </h3>
          <p className={`text-sm mb-8 line-clamp-3 font-medium ${theme.desc}`}>
            {catDesc}
          </p>
        </div>

        <Link
          to={`/categories/${category.id}`}
          className={`relative z-10 inline-flex items-center gap-2 text-sm font-black transition-colors uppercase tracking-widest ${theme.btn} w-max`}
        >
          {t("bl_see_all")} <span className="text-lg leading-none">→</span>
        </Link>
      </div>

      {/* Kolom Slider Buku (KANAN) */}
      <div className="flex-1 min-w-0 relative flex items-center bg-gray-50/50 rounded-2xl md:rounded-[28px] p-2 md:p-4 border border-gray-50">
        {booksToShow.length > 0 ? (
          <>
            <button
              className={`swiper-prev-${category.id} absolute left-0 md:-left-4 z-20 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center disabled:opacity-0 hover:bg-booku-cream transition border border-gray-100 text-booku-coral cursor-pointer`}
            >
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

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: `.swiper-prev-${category.id}`,
                nextEl: `.swiper-next-${category.id}`,
              }}
              slidesPerView="auto"
              spaceBetween={16}
              // DIUBAH: Padding dikembalikan ke ukuran normal karena card sudah tidak melompat.
              className="w-full py-4 px-2 md:px-4"
            >
              {booksToShow.map((book) => (
                <SwiperSlide key={book.id} style={{ width: "160px" }}>
                  {/* DIUBAH: Menghapus class hover:-translate-y */}
                  <div className="h-full">
                    <Card book={book} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className={`swiper-next-${category.id} absolute right-0 md:-right-4 z-20 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center disabled:opacity-0 hover:bg-booku-cream transition border border-gray-100 text-booku-coral cursor-pointer`}
            >
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
          </>
        ) : (
          <div className="flex w-full items-center justify-center h-48 bg-white rounded-2xl text-gray-400 font-bold border-2 border-dashed border-gray-200">
            {t("bl_empty_category")}
          </div>
        )}
      </div>
    </div>
  );
};

const BookListSection = ({ data }) => {
  const filtered = data.filter((c) => c && c.name_id);

  return (
    <section className="w-full bg-booku-cream py-10 md:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        {filtered.map((category, index) => (
          <CategorySection
            key={category.id}
            category={category}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default BookListSection;
