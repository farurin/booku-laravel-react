import React from "react";
import ProgressCard from "./ProgressCard";
import SavedCard from "./SavedCard";
import { useLanguage } from "../context/LanguageContext";

const Progress = ({ data, search, type }) => {
  const { language } = useLanguage();

  const filterBySearch = (items) => {
    if (!search) return items;
    return items.filter((item) => {
      const b = item.book || item;
      const titleToSearch =
        language === "en" && b.title_en ? b.title_en : b.title_id;
      return (titleToSearch || "").toLowerCase().includes(search.toLowerCase());
    });
  };

  const groups = Object.entries(data);
  const hasResults = groups.some(
    ([, items]) => filterBySearch(items).length > 0,
  );

  if (!hasResults) return null;

  return (
    // Layer Luar: Ditambahkan <section className="w-full">
    <section className="w-full">
      {/* Layer Dalam: Tetap sama */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-24 flex flex-col gap-8">
        {groups.map(([label, items]) => {
          const filtered = filterBySearch(items);
          if (filtered.length === 0) return null;

          const showLabel = type === "riwayat";

          return (
            <div
              key={label}
              className="bg-white rounded-4xl md:rounded-[40px] p-6 md:p-10 shadow-sm border border-gray-100"
            >
              {showLabel && (
                <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                  <div className="w-3 h-8 bg-booku-cyan rounded-full"></div>
                  <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                    {label}
                  </h3>
                </div>
              )}

              {type === "disimpan" ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filtered.map((item) => (
                    <SavedCard key={item.id} book={item.book || item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-6">
                  {filtered.map((item) => (
                    <div key={item.id} className="w-36 md:w-40 shrink-0">
                      <ProgressCard progress={item} type={type} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Progress;
