import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Card from "./Card";
import { Button } from "flowbite-react";
import bannerImg from "../assets/banner.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ActionPopupModal from "./ActionPopupModal";

import { getImageUrl } from "../utils/getImageUrl";
import { useLanguage } from "../context/LanguageContext";

const BANNER_AFTER_INDEX = 2;

const BannerIklan = ({ latestBook }) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section className="w-full my-16">
      <div className="flex flex-col lg:flex-row items-center justify-between bg-booku-cyan rounded-[40px] p-8 md:p-12 shadow-md relative overflow-hidden border border-booku-cyan">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>

        <div className="w-full lg:w-1/2 text-center lg:text-left relative z-10 text-gray-900">
          <span className="inline-block px-4 py-1 bg-booku-yellow text-gray-800 font-bold text-xs rounded-full mb-6 tracking-widest uppercase shadow-sm border border-white">
            New Arrival
          </span>
          <h1 className="font-black text-3xl md:text-5xl leading-tight mb-4">
            {t("bl_announcement_title")}
          </h1>
          <p className="text-gray-700 mt-4 text-base md:text-lg max-w-md mx-auto lg:mx-0 font-medium">
            {t("bl_announcement_desc")}
          </p>
          <div className="mt-10 flex justify-center lg:justify-start">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-booku-coral font-extrabold rounded-full px-8 py-2.5 shadow-md hover:bg-gray-50 transition-all border-none"
            >
              {t("bl_btn_check")}
            </Button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative z-10 mt-10 lg:mt-0">
          <img
            src={bannerImg}
            alt="Banner Illustration"
            className="w-full max-w-sm lg:max-w-lg object-contain drop-shadow-2xl scale-110 origin-bottom"
          />
        </div>
      </div>

      {latestBook && (
        <ActionPopupModal
          isOpen={isModalOpen}
          image={getImageUrl(latestBook.image)}
          title={t("bl_new_book_title")}
          description={`${t("bl_new_book_desc_1")} "${latestBook.title}". ${t("bl_new_book_desc_2")}`}
          primaryBtnText={t("bl_btn_view")}
          primaryBtnColor="bg-booku-coral hover:brightness-110 text-white"
          secondaryBtnText={t("bl_btn_close")}
          onPrimaryClick={() => {
            setIsModalOpen(false);
            navigate(`${location.pathname}?preview=${latestBook.id}`);
          }}
          onSecondaryClick={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export const CategorySection = ({ category }) => {
  const { t, language } = useLanguage();
  const booksToShow = category.books ? category.books.slice(0, 10) : [];

  const catName =
    language === "en" && category.name_en ? category.name_en : category.name_id;
  const catDesc =
    language === "en" && category.description_en
      ? category.description_en
      : category.description_id;

  return (
    <div className="w-full mb-16 bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
      {/* Kolom Judul & Banner Kategori (KIRI) */}
      <div className="w-full md:w-64 lg:w-80 shrink-0 relative overflow-hidden rounded-2xl bg-booku-coral group">
        <img
          src={getImageUrl(category.image_banner)}
          alt={catName}
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-20 transition-opacity duration-500 mix-blend-multiply"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x800?text=Kategori";
          }}
        />

        <div className="relative z-10 h-full p-6 lg:p-8 flex flex-col justify-end text-white">
          <h3 className="text-3xl lg:text-4xl font-black mb-3 leading-tight drop-shadow-md">
            {catName}
          </h3>
          <p className="text-white/90 text-sm mb-8 line-clamp-3 font-medium">
            {catDesc}
          </p>
          <Link
            to={`/categories/${category.id}`}
            className="inline-flex items-center gap-2 text-sm font-black text-booku-yellow hover:text-white transition-colors uppercase tracking-widest drop-shadow-sm"
          >
            {t("bl_see_all")} <span>→</span>
          </Link>
        </div>
      </div>

      {/* Kolom Slider Buku (KANAN) */}
      <div className="flex-1 min-w-0 relative flex items-center">
        {booksToShow.length > 0 ? (
          <>
            <button
              className={`swiper-prev-${category.id} absolute -left-4 z-20 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center disabled:opacity-0 hover:bg-booku-cream transition border border-gray-100 text-booku-coral`}
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
              spaceBetween={20}
              className="w-full py-4 px-2"
            >
              {booksToShow.map((book) => (
                <SwiperSlide key={book.id} style={{ width: "160px" }}>
                  <Card book={book} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className={`swiper-next-${category.id} absolute -right-4 z-20 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center disabled:opacity-0 hover:bg-booku-cream transition border border-gray-100 text-booku-coral`}
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
          <div className="flex w-full items-center justify-center h-48 bg-booku-cream/50 rounded-2xl text-gray-500 font-medium border border-dashed border-booku-yellow">
            {t("bl_empty_category")}
          </div>
        )}
      </div>
    </div>
  );
};

const BookListSection = ({ data }) => {
  const filtered = data.filter((c) => c.image !== null);
  const allBooks = data.flatMap((category) => category.books || []);
  const latestBook =
    allBooks.length > 0 ? allBooks.sort((a, b) => b.id - a.id)[0] : null;

  return (
    <section className="w-full bg-booku-cream py-12">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        {filtered.map((category, index) => (
          <React.Fragment key={category.id}>
            <CategorySection category={category} />
            {index === BANNER_AFTER_INDEX && (
              <BannerIklan latestBook={latestBook} />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default BookListSection;
