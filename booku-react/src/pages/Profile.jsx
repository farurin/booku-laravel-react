import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import CtaDownload from "../components/CtaDownload";
import ProfileStatus from "../components/ProfileStatus";
import ProfileAchievement from "../components/ProfileAchievement";
import ProfileLeaderboard from "../components/ProfileLeaderboard";
import ProfileMission from "../components/ProfileMission";
import ActionPopupModal from "../components/ActionPopupModal";
import popupDeleteFavImg from "../assets/popups/popup-delete-fav.png";

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState("status");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const tabs = [
    { id: "status", label: t("prof_tab_status"), disabled: false },
    { id: "achievement", label: t("prof_tab_achievement"), disabled: true },
    { id: "leaderboard", label: t("prof_tab_leaderboard"), disabled: true },
    { id: "mission", label: t("prof_tab_mission"), disabled: true },
  ];

  const isAdmin =
    user && ["super_admin", "admin", "editor"].includes(user.role);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    navigate("/");
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <div className="w-full relative bg-booku-cream min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-10 min-h-[60vh]">
        <h1 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-10 tracking-tight">
          {t("prof_title")}
        </h1>

        <div className="flex justify-center mb-16">
          {/* Container Tab - Floating Widget Style */}
          <div className="bg-white w-full max-w-sm md:max-w-none md:w-auto p-2 rounded-[24px] md:rounded-full shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 md:flex md:items-center gap-2 md:gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`px-4 md:px-8 py-3 rounded-[16px] md:rounded-full font-black text-sm md:text-base transition-all relative group
                    ${
                      activeTab === tab.id
                        ? "bg-booku-cyan text-gray-900 shadow-md"
                        : tab.disabled
                          ? "text-gray-300 cursor-not-allowed bg-transparent"
                          : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                    }
                  `}
                >
                  {tab.label}
                  {tab.disabled && (
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white font-bold text-xs px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                      Coming Soon!
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="transition-all duration-300">
          {activeTab === "status" && <ProfileStatus />}
          {activeTab === "achievement" && <ProfileAchievement />}
          {activeTab === "leaderboard" && <ProfileLeaderboard />}
          {activeTab === "mission" && <ProfileMission />}
        </div>

        {/* Layout tombol Dashboard dan Logout */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mt-24 mb-10">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full sm:w-auto bg-gray-900 text-white font-black py-4 px-12 rounded-2xl hover:bg-black hover:-translate-y-1 transition-all shadow-md cursor-pointer border border-gray-800"
            >
              Dashboard Admin
            </button>
          )}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full sm:w-auto bg-white text-red-500 font-black py-4 px-14 rounded-2xl hover:bg-red-50 hover:-translate-y-1 transition-all shadow-sm cursor-pointer border-2 border-red-500"
          >
            {t("prof_btn_logout")}
          </button>
        </div>
      </div>

      <CtaDownload />

      <ActionPopupModal
        isOpen={isLogoutModalOpen}
        image={popupDeleteFavImg}
        title={t("prof_logout_confirm")}
        description={t("prof_logout_desc")}
        primaryBtnText={t("prof_btn_exit")}
        primaryBtnColor="bg-red-500 hover:bg-red-600 text-white"
        secondaryBtnText={t("auth_btn_close")}
        onPrimaryClick={handleConfirmLogout}
        onSecondaryClick={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
