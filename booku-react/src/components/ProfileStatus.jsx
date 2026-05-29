import React, { useState, useEffect } from "react";
import ProfileCharacterSelect from "./ProfileCharacterSelect";
import ProfileInfoCard from "./ProfileInfoCard";
import { useLanguage } from "../context/LanguageContext";
import { getImageUrl } from "../utils/getImageUrl";
import defaultMascotImg from "../assets/lovecat.png";

const fallbackCharacters = [
  {
    id: 1,
    name: "Student",
    image: "default-mascot",
    isUnlocked: true,
    isActive: true,
  },
];

const ProfileStatus = () => {
  const { t } = useLanguage();
  const [isEditingCharacter, setIsEditingCharacter] = useState(false);
  const [characterList, setCharacterList] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [tempCharacter, setTempCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFeatureDisabled = true;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCharacterList(fallbackCharacters);
      setSelectedCharacter(fallbackCharacters[0]);
      setTempCharacter(fallbackCharacters[0]);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = async () => {
    if (isFeatureDisabled) return;
    if (isEditingCharacter) setIsEditingCharacter(false);
    else {
      setTempCharacter(selectedCharacter);
      setIsEditingCharacter(true);
    }
  };

  if (isLoading || !selectedCharacter)
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full min-h-[300px]">
        <div className="w-12 h-12 border-4 border-booku-coral border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse">
          {t("ps_loading_char")}
        </p>
      </div>
    );

  const displayImage = isEditingCharacter
    ? tempCharacter.image_url || tempCharacter.image
    : selectedCharacter.image_url || selectedCharacter.image;
  const finalImageSrc =
    displayImage === "default-mascot"
      ? defaultMascotImg
      : getImageUrl(displayImage);

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center h-full w-full py-6">
      {/* Container Maskot Kiri - Dibuat seperti Kartu ID */}
      <div className="flex flex-col items-center shrink-0 w-full max-w-[300px] bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-booku-yellow"></div>
        <div className="w-48 h-48 sm:w-52 sm:h-52 relative mb-6 mt-4 bg-white rounded-full p-2 shadow-lg border-4 border-booku-cream z-10">
          <img
            src={finalImageSrc}
            alt="Maskot Profil"
            className={`w-full h-full object-contain rounded-full bg-booku-cyan/20 ${isEditingCharacter && !tempCharacter.isUnlocked ? "grayscale opacity-50" : ""}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultMascotImg;
            }}
          />
        </div>

        <button
          onClick={handleButtonClick}
          disabled={isFeatureDisabled}
          className={`font-black py-3 px-8 w-full rounded-2xl text-sm transition-all shadow-sm ${
            isFeatureDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-booku-coral text-white hover:brightness-110 hover:-translate-y-1 cursor-pointer"
          }`}
        >
          {isFeatureDisabled
            ? t("ps_btn_coming_soon")
            : isEditingCharacter
              ? t("ps_btn_save")
              : t("ps_btn_edit")}
        </button>
      </div>

      <div className="flex-1 w-full max-w-2xl">
        {isEditingCharacter && !isFeatureDisabled ? (
          <ProfileCharacterSelect
            characterList={characterList}
            tempCharacter={tempCharacter}
            setTempCharacter={setTempCharacter}
          />
        ) : (
          <ProfileInfoCard />
        )}
      </div>
    </div>
  );
};

export default ProfileStatus;
