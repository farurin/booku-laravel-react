import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  getBookPages,
  finishBook,
  updateProgress,
  getBookStatus,
} from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

// icon svg
const IconBackCurved = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
  </svg>
);
const IconGlobe = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);
const IconTriangle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconAutoPlay = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
    <line x1="19" y1="5" x2="19" y2="19" />
  </svg>
);
const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconText = () => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);
const IconMusicOn = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);
const IconMusicOff = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
    <line x1="2" y1="2" x2="22" y2="22"></line>
  </svg>
);
const IconMicOn = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);
const IconMicOff = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="2" y1="2" x2="22" y2="22"></line>
    <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"></path>
    <path d="M5 10v2a7 7 0 0 0 12 5"></path>
    <path d="M15 9.34V4a3 3 0 0 0-5.68-1.33"></path>
    <path d="M9 9v3a3 3 0 0 0 5.12 1.67"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const StoryReader = ({ book }) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t, language, changeLanguage } = useLanguage();

  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [savedProgress, setSavedProgress] = useState(0);

  const [hasStarted, setHasStarted] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showNarration, setShowNarration] = useState(true);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const [isBgmDisabled, setIsBgmDisabled] = useState(false);
  const [isDubbingDisabled, setIsDubbingDisabled] = useState(false);

  const audioRef = useRef(null);
  const bgmRef = useRef(null);

  useEffect(() => {
    if (!book) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const pagesData = await getBookPages(book.id);
        setPages(pagesData);
        if (token) {
          const statusData = await getBookStatus(book.id, token);
          setSavedProgress(statusData.progress || 0);
        }
        setCurrentPage(0);
        setHasFinished(false);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [book, token]);

  const dubbingUrl =
    pages.length > 0
      ? language === "id"
        ? pages[currentPage]?.dubbing_id_url
        : pages[currentPage]?.dubbing_en_url
      : null;

  useEffect(() => {
    if (pages.length === 0) return;
    if (currentPage < pages.length - 1) {
      new Image().src = getImageUrl(pages[currentPage + 1].image);
    }
    if (currentPage > 0) {
      new Image().src = getImageUrl(pages[currentPage - 1].image);
    }
  }, [currentPage, pages]);

  useEffect(() => {
    const bgmNode = bgmRef.current;
    if (!bgmNode || !book?.bg_music_url) return;

    if (hasStarted && !isBgmDisabled) {
      if (!bgmNode.src || !bgmNode.src.includes(book.bg_music_url)) {
        bgmNode.src = getImageUrl(book.bg_music_url);
        bgmNode.volume = 0.35;
      }
      bgmNode.play().catch((err) => console.log("BGM autoplay blocked:", err));
    } else {
      bgmNode.pause();
    }
  }, [hasStarted, isBgmDisabled, book]);

  useEffect(() => {
    const audioNode = audioRef.current;
    if (!audioNode) return;

    if (!hasStarted || !dubbingUrl || isDubbingDisabled) {
      audioNode.pause();
      return;
    }

    audioNode.src = getImageUrl(dubbingUrl);
    audioNode.currentTime = 0;
    audioNode.play().catch((err) => console.log("Dubbing blocked:", err));
  }, [currentPage, dubbingUrl, hasStarted, isDubbingDisabled]);

  useEffect(() => {
    const conditionNoDubbingPlay =
      isAutoPlay && hasStarted && (!dubbingUrl || isDubbingDisabled);

    if (conditionNoDubbingPlay) {
      const timer = setTimeout(() => {
        if (currentPage < pages.length - 1) setCurrentPage((prev) => prev + 1);
        else setIsAutoPlay(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [
    isAutoPlay,
    hasStarted,
    dubbingUrl,
    isDubbingDisabled,
    currentPage,
    pages.length,
  ]);

  useEffect(() => {
    if (
      pages.length > 0 &&
      token &&
      currentPage < pages.length - 1 &&
      hasStarted
    ) {
      const currentPercentage = Math.round(
        ((currentPage + 1) / pages.length) * 100,
      );
      updateProgress(book.id, currentPercentage, token).catch(console.error);
    }
  }, [currentPage, pages.length, token, book, hasStarted]);

  useEffect(() => {
    if (
      pages.length > 0 &&
      currentPage === pages.length - 1 &&
      !hasFinished &&
      token &&
      hasStarted
    ) {
      setHasFinished(true);
      finishBook(book.id, token).catch(console.error);
    }
  }, [currentPage, pages.length, hasFinished, token, book, hasStarted]);

  const handleAudioEnded = () => {
    if (isAutoPlay) {
      setTimeout(() => {
        if (currentPage < pages.length - 1) {
          setCurrentPage((prev) => prev + 1);
        } else {
          setIsAutoPlay(false);
        }
      }, 1000);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay((prev) => {
      const nextState = !prev;
      if (nextState && audioRef.current && dubbingUrl && !isDubbingDisabled) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
      return nextState;
    });
  };

  const handleStartReading = (resume = false) => {
    if (resume && savedProgress > 0 && pages.length > 0) {
      let targetPage = Math.round((savedProgress / 100) * pages.length) - 1;
      targetPage = Math.max(0, Math.min(pages.length - 1, targetPage));
      setCurrentPage(targetPage);
    } else {
      setCurrentPage(0);
    }
    setHasStarted(true);
  };

  if (!book || isLoading) {
    return (
      <div className="w-full aspect-video bg-white md:rounded-[40px] animate-pulse shadow-sm border border-gray-100"></div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="w-full aspect-video bg-white md:rounded-[40px] flex flex-col items-center justify-center shadow-sm border-2 border-dashed border-booku-cyan">
        <IconGlobe className="w-16 h-16 text-booku-cyan mb-4" />
        <h2 className="text-xl md:text-2xl font-black text-gray-500 mb-2 tracking-tight">
          {t("sr_empty_title")}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-8 py-3 bg-booku-yellow text-gray-900 font-bold rounded-2xl shadow-sm hover:-translate-y-1 transition cursor-pointer border border-white"
        >
          {t("sr_btn_back")}
        </button>
      </div>
    );
  }

  return (
    <div
      id="story-reader-container"
      className="relative w-full mx-auto flex flex-col lg:block rounded-4xl lg:rounded-[40px] shadow-sm lg:aspect-video bg-white p-2 lg:p-4 border-4 border-gray-50"
    >
      <audio ref={audioRef} onEnded={handleAudioEnded} />
      <audio ref={bgmRef} loop />

      {/* OVERLAY MULAI BACA - Z-Index 50 (Menutupi kontrol, tapi di bawah navigasi atas) */}
      {!hasStarted && (
        <div className="absolute inset-0 z-50 bg-booku-cyan/70 backdrop-blur-md flex flex-col items-center justify-center gap-5 rounded-[28px] lg:rounded-[36px] m-2 lg:m-4">
          {savedProgress > 0 && savedProgress < 100 ? (
            <>
              <button
                onClick={() => handleStartReading(true)}
                className="px-10 py-5 bg-booku-coral hover:bg-orange-500 text-white text-lg lg:text-2xl font-black rounded-3xl shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-4 border-white/50"
              >
                {t("sr_btn_resume")} ({savedProgress}%)
              </button>
              <button
                onClick={() => handleStartReading(false)}
                className="px-6 py-2.5 bg-white text-gray-700 text-sm lg:text-base font-black rounded-2xl shadow-sm transition-all hover:bg-gray-50 cursor-pointer"
              >
                {t("sr_btn_restart")}
              </button>
            </>
          ) : (
            <button
              onClick={() => handleStartReading(false)}
              className="px-12 py-6 bg-booku-coral hover:bg-orange-500 text-white text-2xl lg:text-4xl font-black rounded-4xl shadow-lg hover:-translate-y-2 hover:scale-105 transition-all cursor-pointer border-4 border-white"
            >
              {t("sr_btn_start")}
            </button>
          )}
        </div>
      )}

      {/* TOP NAVIGATION HEADER (Back & Lang) - Z-Index 60 (Selalu di atas segalanya) */}
      <div className="absolute top-6 left-6 right-6 lg:top-8 lg:left-8 lg:right-8 flex justify-between z-60 pointer-events-none">
        {/* Back Button */}
        <button
          onClick={() =>
            document.fullscreenElement
              ? document.exitFullscreen()
              : navigate(-1)
          }
          className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white shadow-md text-gray-900 cursor-pointer pointer-events-auto border border-gray-100 hover:-translate-x-1 transition-transform"
        >
          <IconBackCurved />
        </button>

        {/* Language Menu */}
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white shadow-md text-gray-900 cursor-pointer border border-gray-100 transition-all hover:scale-105"
          >
            <IconGlobe />
          </button>
          {isLangMenuOpen && (
            <div className="absolute right-0 mt-3 w-40 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 z-50 animate-fade-in">
              <button
                onClick={() => {
                  changeLanguage("id");
                  setIsLangMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-booku-cream transition text-gray-800 font-bold border-b border-gray-50 cursor-pointer"
              >
                <span className="text-xl">🇮🇩</span> Indonesia
              </button>
              <button
                onClick={() => {
                  changeLanguage("en");
                  setIsLangMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-booku-cream transition text-gray-800 font-bold cursor-pointer"
              >
                <span className="text-xl">🇬🇧</span> English
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GAMBAR BACKGROUND - Dilindungi oleh Padding Putih (Frame Effect) */}
      <div className="relative w-full aspect-video lg:aspect-auto lg:absolute lg:inset-4 lg:w-[calc(100%-32px)] lg:h-[calc(100%-32px)] overflow-hidden shrink-0 rounded-3xl lg:rounded-4xl bg-booku-cream shadow-inner border border-gray-100">
        <img
          src={getImageUrl(pages[currentPage].image)}
          alt={`Halaman ${currentPage + 1}`}
          className="w-full h-full object-cover transition-opacity duration-700"
          onError={(e) => {
            e.target.src = "https://placehold.co/1280x720?text=Scene+Cerita";
          }}
        />

        {/* Shadow Gradasi untuk Keterbacaan Teks (Hanya muncul jika Narasi Tampil) */}
        <div
          className={`absolute bottom-0 w-full h-1/2 bg-linear-to-t from-gray-900/60 to-transparent transition-opacity duration-500 pointer-events-none ${showNarration ? "opacity-100" : "opacity-0"}`}
        ></div>
      </div>

      {/* Progress Bar Vertikal (Desktop) - Z-Index 40 (Berada di bawah Overlay Z-50) */}
      <div className="absolute top-22 left-6 lg:top-24 lg:left-8 hidden lg:flex flex-col gap-1 bg-white/50 backdrop-blur-sm p-2 rounded-full shadow-inner w-12 h-48 border border-white z-40 pointer-events-none">
        {pages.map((_, index) => (
          <div
            key={index}
            className={`w-full rounded-full flex-1 transition-all duration-300 ${index <= currentPage ? "bg-booku-coral shadow-sm" : "bg-white/40"}`}
          />
        ))}
      </div>

      {/* Progress Bar Horizontal (Mobile) - Z-Index 40 (Berada di bawah Overlay Z-50) */}
      <div className="relative lg:hidden w-full flex gap-1 px-2 mt-4 z-40">
        {pages.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full flex-1 transition-all duration-300 ${index <= currentPage ? "bg-booku-coral" : "bg-gray-200"}`}
          />
        ))}
      </div>

      {/* Floating Control Island (Desktop) - Z-Index 40 (Berada di bawah Overlay Z-50) */}
      <div className="absolute top-22 right-6 lg:top-24 lg:right-8 bg-white/90 backdrop-blur-md p-2 rounded-3xl shadow-lg border border-gray-100 hidden lg:flex flex-col gap-2 z-40 pointer-events-auto">
        <button
          onClick={() => setIsBgmDisabled(!isBgmDisabled)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${isBgmDisabled ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-700 hover:bg-booku-cream"}`}
          title="Toggle Music"
        >
          {isBgmDisabled ? <IconMusicOff /> : <IconMusicOn />}
        </button>
        <button
          onClick={() => setIsDubbingDisabled(!isDubbingDisabled)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${isDubbingDisabled ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-700 hover:bg-booku-cream"}`}
          title="Toggle Voiceover"
        >
          {isDubbingDisabled ? <IconMicOff /> : <IconMicOn />}
        </button>
        <button
          onClick={() => setShowNarration(!showNarration)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${showNarration ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-booku-cream"}`}
          title="Toggle Teks"
        >
          {showNarration ? <IconClose /> : <IconText />}
        </button>
      </div>

      {/* KONTROL AUDIO & TEKS (Mobile Version Horizontal) - Z-Index 40 (Berada di bawah Overlay Z-50) */}
      <div className="relative flex lg:hidden justify-center gap-3 w-full mt-4 z-40 px-2">
        <button
          onClick={() => setIsBgmDisabled(!isBgmDisabled)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 transition cursor-pointer ${isBgmDisabled ? "bg-red-50 text-red-500" : "bg-white text-gray-700"}`}
        >
          {isBgmDisabled ? <IconMusicOff /> : <IconMusicOn />}
        </button>
        <button
          onClick={() => setIsDubbingDisabled(!isDubbingDisabled)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 transition cursor-pointer ${isDubbingDisabled ? "bg-red-50 text-red-500" : "bg-white text-gray-700"}`}
        >
          {isDubbingDisabled ? <IconMicOff /> : <IconMicOn />}
        </button>
        <button
          onClick={toggleAutoPlay}
          className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm transition border cursor-pointer flex-1 justify-center ${isAutoPlay ? "bg-booku-cyan text-gray-900 border-booku-cyan" : "bg-white text-gray-700 border-gray-100"}`}
        >
          AUTO <IconAutoPlay />
        </button>
        <button
          onClick={() => setShowNarration(!showNarration)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border transition cursor-pointer ${showNarration ? "bg-gray-900 text-white border-gray-800" : "bg-white text-gray-700 border-gray-100"}`}
        >
          {showNarration ? <IconClose /> : <IconText />}
        </button>
      </div>

      {/* Tombol AUTO Play untuk Desktop (Terpisah dari island) - Z-Index 40 */}
      <div className="hidden lg:block absolute bottom-8 right-8 z-40">
        <button
          onClick={toggleAutoPlay}
          className={`px-6 py-4 rounded-[20px] text-sm font-black flex items-center gap-3 shadow-lg transition hover:-translate-y-1 cursor-pointer border-2 ${isAutoPlay ? "bg-booku-cyan text-gray-900 border-white" : "bg-white text-gray-700 border-gray-100"}`}
        >
          AUTO PLAY <IconAutoPlay />
        </button>
      </div>

      {/* TOMBOL NAVIGASI KIRI & KANAN - Z-Index 40 */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
        disabled={currentPage === 0}
        className="absolute top-[40%] lg:top-1/2 -translate-y-1/2 left-2 lg:left-12 z-40 w-12 h-12 lg:w-16 lg:h-16 bg-white/95 backdrop-blur-md text-gray-900 rounded-full flex items-center justify-center disabled:opacity-0 hover:scale-110 hover:bg-white hover:text-booku-coral transition-all shadow-xl cursor-pointer border-4 border-gray-50"
      >
        <div className="rotate-180">
          <IconTriangle />
        </div>
      </button>

      <button
        onClick={() =>
          setCurrentPage((prev) =>
            Math.max(0, Math.min(pages.length - 1, prev + 1)),
          )
        }
        disabled={currentPage === pages.length - 1}
        className="absolute top-[40%] lg:top-1/2 -translate-y-1/2 right-2 lg:right-12 z-40 w-12 h-12 lg:w-16 lg:h-16 bg-white/95 backdrop-blur-md text-gray-900 rounded-full flex items-center justify-center disabled:opacity-0 hover:scale-110 hover:bg-white hover:text-booku-coral transition-all shadow-xl cursor-pointer border-4 border-gray-50"
      >
        <IconTriangle />
      </button>

      {/* SUBTITLE BOKS - Z-Index 30 */}
      <div
        className={`w-full mt-4 lg:mt-0 lg:absolute lg:bottom-12 lg:left-1/2 lg:-translate-x-1/2 px-2 lg:px-0 lg:w-[60%] transition-all duration-500 z-30 ${showNarration ? "opacity-100 max-h-96 lg:translate-y-0" : "opacity-0 max-h-0 lg:max-h-none lg:translate-y-[150%] overflow-hidden lg:overflow-visible pointer-events-none"}`}
      >
        <div className="w-full bg-white/95 backdrop-blur-xl rounded-3xl lg:rounded-4xl px-6 py-5 lg:px-10 lg:py-8 shadow-2xl border-4 border-gray-50 pointer-events-auto">
          <div className="w-full max-h-32 lg:max-h-[15vh] overflow-y-auto flex items-center justify-center custom-scrollbar pr-3">
            <p className="text-gray-900 font-bold text-base lg:text-2xl text-center leading-relaxed lg:leading-normal">
              {language === "id"
                ? pages[currentPage]?.text_id
                : pages[currentPage]?.text_en || t("sr_no_translation")}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default StoryReader;
