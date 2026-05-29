import React from "react";

const ActionPopupModal = ({
  isOpen,
  image,
  title,
  description,
  primaryBtnText,
  primaryBtnColor = "bg-booku-coral hover:brightness-110 text-white", // Default color diubah
  secondaryBtnText,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-3xl w-[92%] max-w-lg pt-12 pb-8 px-6 md:px-10 flex flex-col items-center text-center shadow-2xl transform transition-transform mt-8">
        {/* Gambar diletakkan di dalam box dengan aksen Kuning */}
        <div className="w-32 h-32 md:w-40 md:h-40 mb-6 shrink-0 flex items-center justify-center bg-booku-yellow/40 rounded-full p-4 border-4 border-white shadow-md -mt-24">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain drop-shadow-sm"
            onError={(e) =>
              (e.target.src = "https://placehold.co/150?text=Popup+Image")
            }
          />
        </div>

        <h2 className="text-2xl md:text-[26px] font-bold text-gray-800 mb-3 leading-tight">
          {title}
        </h2>

        <p className="text-sm md:text-base font-medium text-gray-600 mb-8 px-2 leading-relaxed">
          {description}
        </p>

        <div className="flex gap-4 w-full">
          <button
            onClick={onSecondaryClick}
            className="flex-1 py-3 md:py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all shadow-sm active:scale-95 cursor-pointer border border-gray-200"
          >
            {secondaryBtnText}
          </button>
          <button
            onClick={onPrimaryClick}
            className={`flex-1 py-3 md:py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer ${primaryBtnColor}`}
          >
            {primaryBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionPopupModal;
