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
    strokeWidth="2"
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
      <div className="w-full aspect-video bg-white md:rounded-[32px] animate-pulse shadow-sm border border-gray-100"></div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="w-full aspect-video bg-white md:rounded-[32px] flex flex-col items-center justify-center shadow-sm border-2 border-dashed border-booku-cyan">
        <IconGlobe className="w-16 h-16 text-booku-cyan mb-4" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-500 mb-2">
          {t("sr_empty_title")}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-8 py-3 bg-booku-yellow text-gray-900 font-bold rounded-xl hover:brightness-95 transition cursor-pointer"
        >
          {t("sr_btn_back")}
        </button>
      </div>
    );
  }

  return (
    <div
      id="story-reader-container"
      className="relative w-full mx-auto overflow-hidden flex flex-col lg:block rounded-[24px] lg:rounded-[40px] group transition-all duration-500 shadow-xl lg:aspect-video bg-booku-cream border-4 border-white"
    >
      <audio ref={audioRef} onEnded={handleAudioEnded} />
      <audio ref={bgmRef} loop />

      {/* OVERLAY MULAI BACA */}
      {!hasStarted && (
        <div className="absolute inset-0 z-30 bg-booku-cyan/90 backdrop-blur-md flex flex-col items-center justify-center gap-5 rounded-[20px] lg:rounded-[36px]">
          {savedProgress > 0 && savedProgress < 100 ? (
            <>
              <button
                onClick={() => handleStartReading(true)}
                className="px-10 py-5 bg-booku-coral hover:brightness-110 text-white text-lg lg:text-2xl font-black rounded-3xl shadow-[0_10px_30px_rgba(244,143,104,0.4)] hover:-translate-y-1 transition-all cursor-pointer border-4 border-white/50"
              >
                {t("sr_btn_resume")} ({savedProgress}%)
              </button>
              <button
                onClick={() => handleStartReading(false)}
                className="px-6 py-2.5 bg-white/20 hover:bg-white/40 text-white text-sm lg:text-base font-bold rounded-xl transition cursor-pointer border border-white/30"
              >
                {t("sr_btn_restart")}
              </button>
            </>
          ) : (
            <button
              onClick={() => handleStartReading(false)}
              className="px-12 py-6 bg-booku-coral hover:brightness-110 text-white text-2xl lg:text-4xl font-black rounded-3xl shadow-[0_10px_30px_rgba(244,143,104,0.4)] hover:-translate-y-1 hover:scale-105 transition-all cursor-pointer border-4 border-white/50"
            >
              {t("sr_btn_start")}
            </button>
          )}
        </div>
      )}

      {/* GAMBAR BACKGROUND */}
      <div className="relative w-full aspect-video lg:aspect-auto lg:absolute lg:inset-0 lg:h-full overflow-hidden shrink-0 rounded-t-[20px] lg:rounded-none bg-booku-cream">
        <img
          src={getImageUrl(pages[currentPage].image)}
          alt={`Halaman ${currentPage + 1}`}
          className="w-full h-full object-cover transition-opacity duration-700"
          onError={(e) => {
            e.target.src = "https://placehold.co/1280x720?text=Scene+Cerita";
          }}
        />
      </div>

      {/* HEADER NAVIGASI */}
      <div className="absolute top-0 left-0 right-0 p-4 lg:p-8 flex items-center justify-between bg-gradient-to-b from-gray-900/60 to-transparent z-40 pointer-events-none rounded-t-[20px] lg:rounded-none">
        <button
          onClick={() =>
            document.fullscreenElement
              ? document.exitFullscreen()
              : navigate(-1)
          }
          className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white transition shadow-md text-gray-900 cursor-pointer pointer-events-auto border border-gray-100"
        >
          <IconBackCurved />
        </button>

        <div className="flex-1 mx-5 lg:mx-10 flex gap-2 lg:gap-3">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`h-2 lg:h-2.5 rounded-full flex-1 transition-all duration-300 ${index <= currentPage ? "bg-booku-coral shadow-sm" : "bg-white/40"}`}
            />
          ))}
        </div>

        <div className="relative pointer-events-auto">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white transition shadow-md text-gray-900 cursor-pointer border border-gray-100"
          >
            <IconGlobe />
          </button>
          {isLangMenuOpen && (
            <div className="absolute right-0 mt-3 w-40 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 z-50">
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

      {/* KONTROL PANEL AUDIO & TEXT */}
      <div
        className={`flex justify-center lg:justify-end gap-3 z-20 transition-all duration-500 pt-5 pb-3 lg:pt-0 lg:pb-0 px-4 lg:px-0 lg:absolute lg:right-10 ${showNarration ? "lg:bottom-[25%]" : "lg:bottom-10"}`}
      >
        <button
          onClick={() => setIsBgmDisabled(!isBgmDisabled)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border-2 hover:-translate-y-1 transition cursor-pointer ${isBgmDisabled ? "bg-red-50 text-red-500 border-red-200" : "bg-white text-gray-700 border-gray-100"}`}
          title="Toggle Music"
        >
          {isBgmDisabled ? <IconMusicOff /> : <IconMusicOn />}
        </button>
        <button
          onClick={() => setIsDubbingDisabled(!isDubbingDisabled)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border-2 hover:-translate-y-1 transition cursor-pointer ${isDubbingDisabled ? "bg-red-50 text-red-500 border-red-200" : "bg-white text-gray-700 border-gray-100"}`}
          title="Toggle Voiceover"
        >
          {isDubbingDisabled ? <IconMicOff /> : <IconMicOn />}
        </button>
        <button
          onClick={toggleAutoPlay}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-md transition hover:-translate-y-1 cursor-pointer border-2 ${isAutoPlay ? "bg-booku-cyan text-gray-900 border-booku-cyan" : "bg-white text-gray-700 border-gray-100"}`}
        >
          AUTO <IconAutoPlay />
        </button>
        <button
          onClick={() => setShowNarration(!showNarration)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border-2 transition hover:-translate-y-1 cursor-pointer ${showNarration ? "bg-gray-900 text-white border-gray-800" : "bg-white text-gray-700 border-gray-100"}`}
          title="Toggle Teks"
        >
          {showNarration ? <IconClose /> : <IconText />}
        </button>
      </div>

      {/* TOMBOL NAVIGASI KIRI & KANAN */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
        disabled={currentPage === 0}
        className="absolute top-[35%] lg:top-1/2 -translate-y-1/2 left-3 lg:left-8 z-20 w-12 h-12 lg:w-16 lg:h-16 bg-white/90 backdrop-blur-md text-gray-900 rounded-full flex items-center justify-center disabled:opacity-0 hover:scale-110 transition shadow-lg cursor-pointer border-4 border-white"
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
        className="absolute top-[35%] lg:top-1/2 -translate-y-1/2 right-3 lg:right-8 z-20 w-12 h-12 lg:w-16 lg:h-16 bg-white/90 backdrop-blur-md text-gray-900 rounded-full flex items-center justify-center disabled:opacity-0 hover:scale-110 transition shadow-lg cursor-pointer border-4 border-white"
      >
        <IconTriangle />
      </button>

      {/* SUBTITLE BOKS */}
      <div
        className={`w-full lg:absolute lg:bottom-10 lg:left-0 lg:right-0 px-4 pb-6 pt-2 lg:pt-0 lg:px-28 transition-all duration-500 z-10 ${showNarration ? "opacity-100 max-h-96 lg:translate-y-0" : "opacity-0 max-h-0 lg:max-h-none lg:translate-y-[150%] overflow-hidden lg:overflow-visible"}`}
      >
        <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl px-6 py-6 lg:px-12 lg:py-8 shadow-2xl border border-gray-100">
          <div className="w-full max-h-48 lg:max-h-[22vh] overflow-y-auto flex items-center justify-center custom-scrollbar pr-3">
            <p className="text-gray-800 font-bold text-base lg:text-xl text-center leading-relaxed">
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
