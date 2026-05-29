import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import BannerCorner from "../components/BannerCorner";
import FilterCorner from "../components/FilterCorner";
import Progress from "../components/Progress";
import CtaDownload from "../components/CtaDownload";
import { getCornerData } from "../services/api";

const Corner = () => {
  const { isLoggedIn, token, refreshKey } = useAuth();
  const { t, language } = useLanguage();

  const [activeFilter, setActiveFilter] = useState(
    () => localStorage.getItem("cornerActiveTab") || "riwayat",
  );
  useEffect(() => {
    localStorage.setItem("cornerActiveTab", activeFilter);
  }, [activeFilter]);

  const [search, setSearch] = useState("");
  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const groupHistoryByDate = useCallback(
    (historyArray) => {
      const grouped = {
        [t("cor_today")]: [],
        [t("cor_yesterday")]: [],
        [t("cor_older")]: [],
      };
      const today = new Date().setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(new Date(today).getDate() - 1);
      historyArray.forEach((item) => {
        const readDate = new Date(item.last_read_at).setHours(0, 0, 0, 0);
        if (readDate === today) grouped[t("cor_today")].push(item);
        else if (readDate === yesterday) grouped[t("cor_yesterday")].push(item);
        else grouped[t("cor_older")].push(item);
      });
      return grouped;
    },
    [t],
  );

  const fetchCornerData = useCallback(async () => {
    if (!isLoggedIn) {
      setProgressData({});
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      let endpoint =
        activeFilter === "favorit"
          ? "favorites"
          : activeFilter === "disimpan"
            ? "saved"
            : "history";
      const data = await getCornerData(endpoint, token);
      if (activeFilter === "favorit") setProgressData({ [t("cor_fav")]: data });
      else if (activeFilter === "disimpan")
        setProgressData({ [t("cor_saved")]: data });
      else setProgressData(groupHistoryByDate(data));
    } catch (err) {
      console.error(err.message);
      setProgressData({});
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, isLoggedIn, token, t, groupHistoryByDate]);

  useEffect(() => {
    const savedTab = localStorage.getItem("cornerActiveTab");
    if (savedTab) setActiveFilter(savedTab);
    fetchCornerData();
  }, [fetchCornerData, refreshKey]);

  const filteredProgressData = useMemo(() => {
    if (!search) return progressData;
    const filtered = {};
    for (const [groupName, books] of Object.entries(progressData)) {
      const matchedBooks = books.filter((book) => {
        const titleToSearch =
          language === "en" && book.title_en ? book.title_en : book.title_id;
        return (titleToSearch || "")
          .toLowerCase()
          .includes(search.toLowerCase());
      });
      if (matchedBooks.length > 0) filtered[groupName] = matchedBooks;
    }
    return filtered;
  }, [progressData, search, language]);

  const emptyContent = {
    riwayat: isLoggedIn
      ? { title: t("cor_empty_hist_title"), desc: t("cor_empty_hist_desc") }
      : { title: t("cor_guest_hist_title"), desc: t("cor_guest_hist_desc") },
    favorit: isLoggedIn
      ? { title: t("cor_empty_fav_title"), desc: t("cor_empty_fav_desc") }
      : { title: t("cor_guest_fav_title"), desc: t("cor_guest_fav_desc") },
    disimpan: isLoggedIn
      ? { title: t("cor_empty_save_title"), desc: t("cor_empty_save_desc") }
      : { title: t("cor_guest_save_title"), desc: t("cor_guest_save_desc") },
  };

  const hasNoBooksOriginal =
    !isLoading &&
    Object.values(progressData).every((group) => group.length === 0);
  const hasNoSearchResults =
    !isLoading &&
    search &&
    Object.values(filteredProgressData).every((group) => group.length === 0);

  return (
    <div className="w-full bg-booku-cream min-h-screen">
      <BannerCorner />
      <FilterCorner
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
        onSearch={setSearch}
      />

      <div className="w-full min-h-[50vh]">
        {error && !isLoading && (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-20 text-center bg-white mt-12 mb-20 rounded-[40px] border-4 border-red-100 shadow-sm">
            <h3 className="text-xl md:text-2xl font-black text-red-500 leading-tight">
              {t("cor_err")}
            </h3>
            <p className="text-gray-500 mt-3 text-base max-w-lg mx-auto font-medium">
              {error}
            </p>
            <button
              onClick={fetchCornerData}
              className="mt-8 px-10 py-3.5 bg-booku-coral text-white font-black rounded-2xl hover:bg-orange-600 hover:-translate-y-1 transition-all shadow-md"
            >
              {t("btn_retry")}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-32 text-center flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-booku-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-gray-500 font-bold">
              {t("cor_loading")} {activeFilter}...
            </span>
          </div>
        )}

        {!isLoading && !error && hasNoBooksOriginal && !search && (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-32 text-center bg-white/50 mt-8 mb-24 rounded-[48px] border-2 border-dashed border-booku-cyan/50">
            <div className="w-24 h-24 bg-booku-yellow/30 rounded-full mx-auto mb-8 flex items-center justify-center">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-3xl font-black text-gray-800 leading-tight">
              {emptyContent[activeFilter].title}
            </h3>
            <p className="text-gray-600 mt-4 text-lg font-medium max-w-md mx-auto">
              {emptyContent[activeFilter].desc}
            </p>
          </div>
        )}

        {!isLoading && !error && hasNoSearchResults && (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 text-center bg-white/50 mt-8 mb-20 rounded-[40px] border-2 border-dashed border-booku-yellow">
            <span className="text-5xl mb-6 block">🔍</span>
            <h3 className="text-2xl font-black text-gray-500 leading-tight">
              {t("cor_empty_search")}
            </h3>
            <p className="text-gray-500 mt-3 text-lg font-medium">
              {t("cor_empty_search_desc_1")}{" "}
              <span className="font-black text-gray-700">"{search}"</span>{" "}
              {t("cor_empty_search_desc_2")}
            </p>
          </div>
        )}

        {!isLoading && !error && !hasNoBooksOriginal && !hasNoSearchResults && (
          <>
            {activeFilter === "favorit" && !search && (
              <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-12 -mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-booku-coral rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                    {t("cor_fav_title")}
                  </h2>
                </div>
                <p className="text-gray-600 font-medium mt-3 text-base md:text-lg">
                  {t("cor_fav_desc")}
                </p>
              </div>
            )}
            {activeFilter === "disimpan" && !search && (
              <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-12 -mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-booku-yellow rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                    {t("cor_save_title")}
                  </h2>
                </div>
                <p className="text-gray-600 font-medium mt-3 text-base md:text-lg">
                  <span className="font-black text-gray-900 bg-booku-yellow/40 px-2 py-0.5 rounded-md">
                    {progressData[t("cor_saved")]?.length || 0}
                  </span>{" "}
                  {t("cor_save_desc")}
                </p>
              </div>
            )}
            {search && (
              <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-12 -mb-2">
                <h2 className="text-2xl font-black text-gray-900">
                  {t("cor_result")}
                </h2>
              </div>
            )}

            <Progress
              data={filteredProgressData}
              search={search}
              type={activeFilter}
            />
          </>
        )}
      </div>
      <CtaDownload />
    </div>
  );
};

export default Corner;
