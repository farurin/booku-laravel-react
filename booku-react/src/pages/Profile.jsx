import React from "react";
import { useLanguage } from "../context/LanguageContext";
import CtaDownload from "../components/CtaDownload";
import ProfileStatus from "../components/ProfileStatus";

const Profile = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full relative bg-booku-cream min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-10 min-h-[60vh]">
        <h1 className="text-3xl md:text-5xl font-black text-center text-gray-900 mb-10 tracking-tight">
          {t("prof_title")}
        </h1>

        <div className="transition-all duration-300">
          <ProfileStatus />
        </div>
      </div>

      <CtaDownload />
    </div>
  );
};

export default Profile;
