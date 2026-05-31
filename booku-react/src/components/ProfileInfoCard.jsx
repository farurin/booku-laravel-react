import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getUserProfile, getAvatars, updateUserProfile } from "../services/api";
import ActionPopupModal from "./ActionPopupModal";

// Svg Data URI untuk Modal Logout
const popupDeleteFavSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#E5E7EB"/><path d="M50 75L27 52.8C20 45.8 24 33 35 33C41.6 33 46.8 38 50 42C53.2 38 58.4 33 65 33C76 33 80 45.8 73 52.8L50 75Z" fill="#9CA3AF"/><path d="M55 30 L45 50 L55 60 L45 80" stroke="#E5E7EB" stroke-width="4" fill="none"/></svg>`,
)}`;

const IconEdit = () => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconFire = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#F97316"
    stroke="#F97316"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const dayTranslations = {
  id: {
    Min: "Min",
    Sen: "Sen",
    Sel: "Sel",
    Rab: "Rab",
    Kam: "Kam",
    Jum: "Jum",
    Sab: "Sab",
  },
  en: {
    Min: "Sun",
    Sen: "Mon",
    Sel: "Tue",
    Rab: "Wed",
    Kam: "Thu",
    Jum: "Fri",
    Sab: "Sat",
  },
};

const getLocalAvatarUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("https")) return path;
  const cleanPath = path.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

const ProfileInfoCard = () => {
  const navigate = useNavigate();
  const { token, logout, user } = useAuth();
  const { t, language } = useLanguage();

  const [profileData, setProfileData] = useState(null);
  const [avatarList, setAvatarList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    age: "",
    avatar_url: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin =
    user && ["super_admin", "admin", "editor"].includes(user.role);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      setProfileData(await getUserProfile(token));
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchAvatarData = useCallback(async () => {
    if (!token) return;
    try {
      setAvatarList(await getAvatars(token));
    } catch (err) {
      setAvatarList([]);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
    fetchAvatarData();
  }, [fetchProfile, fetchAvatarData]);

  const handleOpenModal = () => {
    setEditData({
      username: profileData.username || "",
      age: profileData.age || "",
      avatar_url: profileData.avatar_url || avatarList[0]?.image_url || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile(
        {
          username: editData.username,
          age: parseInt(editData.age) || 0,
          avatar_url: editData.avatar_url,
        },
        token,
      );
      await fetchProfile();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    navigate("/");
    setTimeout(() => {
      logout();
    }, 100);
  };

  if (!profileData)
    return (
      <div className="w-full bg-white rounded-[40px] p-8 flex flex-col justify-center items-center min-h-[400px] border-4 border-gray-50 shadow-sm">
        <div className="w-12 h-12 border-4 border-booku-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold text-lg animate-pulse">
          {t("pic_loading_status")}
        </p>
      </div>
    );

  return (
    <div className="w-full bg-white rounded-[40px] shadow-sm border-4 border-white animate-fade-in relative overflow-hidden">
      {/* Dekorasi Background */}
      <div className="absolute top-0 right-0 w-full h-40 bg-booku-cyan/20"></div>

      <div className="relative p-6 md:p-10 flex flex-col items-center">
        {/* Tombol Edit Melayang */}
        <button
          onClick={handleOpenModal}
          className="absolute top-6 right-6 flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl text-xs font-black text-gray-700 hover:bg-booku-yellow hover:text-gray-900 transition-all shadow-md cursor-pointer border-2 border-gray-100 z-10"
        >
          <IconEdit /> {t("pic_btn_edit")}
        </button>

        {/* Profil Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-10 mt-6 z-10">
          <div className="w-28 h-28 md:w-32 md:h-32 bg-booku-cream rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img
              src={getLocalAvatarUrl(profileData.avatar_url)}
              alt="Avatar"
              className="w-full h-full object-cover p-1"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${profileData.username}&background=FFF6DE&color=F48F68`;
              }}
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2">
              {profileData.username}
            </h2>
            <p className="text-sm font-bold text-gray-600 bg-white px-5 py-2 rounded-full border-2 border-gray-100 shadow-sm inline-block">
              {profileData.age > 0
                ? `${profileData.age} ${t("pic_age_years")}`
                : t("pic_age_not_set")}
            </p>
          </div>
        </div>

        {/* Info Streak Tunggal */}
        <div className="w-full bg-booku-cream rounded-[32px] p-6 flex flex-col items-center gap-3 border-4 border-booku-yellow/30 mb-8">
          <div className="bg-white p-3 rounded-full shadow-md">
            <IconFire />
          </div>
          <div className="text-center">
            <h4 className="text-4xl font-black text-gray-900 mb-1">
              {profileData.current_streak} <span className="text-lg">Hari</span>
            </h4>
            <p className="text-xs font-black text-orange-500 uppercase tracking-widest">
              {t("pic_daily_streak")}
            </p>
          </div>
        </div>

        {/* Kalender */}
        <div className="w-full bg-gray-50 p-4 md:p-6 rounded-[32px] overflow-x-auto scrollbar-hide border border-gray-100 mb-10">
          <div className="flex justify-between items-center min-w-[300px] gap-2 md:gap-4">
            {profileData.calendar &&
              profileData.calendar.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center w-12 h-16 md:w-16 md:h-[84px] rounded-2xl transition-all shrink-0 ${
                    item.isActive
                      ? "bg-booku-cyan text-gray-900 shadow-md border-2 border-booku-cyan/50 scale-105"
                      : "bg-white border-2 border-gray-100"
                  }`}
                >
                  <div className="h-2 mb-1">
                    {item.isToday && (
                      <div
                        className={`w-2 h-2 rounded-full ${item.isActive ? "bg-white" : "bg-gray-800"}`}
                      ></div>
                    )}
                  </div>
                  <span
                    className={`text-[10px] md:text-xs font-black mb-1 ${item.isActive ? "opacity-70" : "text-gray-400"}`}
                  >
                    {dayTranslations[language][item.day] || item.day}
                  </span>
                  <span
                    className={`text-base md:text-xl font-black ${item.isActive ? "text-gray-900" : "text-gray-800"}`}
                  >
                    {item.date}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Tombol Aksi Bawah */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-black hover:-translate-y-1 transition-all shadow-md cursor-pointer border border-gray-800"
            >
              Dashboard Admin
            </button>
          )}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex-1 bg-white text-red-500 font-black py-4 rounded-2xl hover:bg-red-50 hover:-translate-y-1 transition-all shadow-sm cursor-pointer border-2 border-red-500"
          >
            {t("prof_btn_logout")}
          </button>
        </div>
      </div>

      {/* Modal Edit Profil */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[40px] w-full max-w-xl p-8 md:p-12 relative shadow-2xl scale-100 transition-transform max-h-[90vh] overflow-y-auto scrollbar-hide border-8 border-booku-cream">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 text-gray-500 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <IconClose />
            </button>

            <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 mb-8 tracking-wide">
              {t("pic_modal_title")}
            </h2>

            <div className="space-y-5 mb-8">
              <div className="bg-gray-50 rounded-2xl px-6 py-4 border-2 border-gray-100 focus-within:border-booku-cyan transition-colors">
                <label className="text-xs font-black text-gray-500 block mb-1 tracking-widest uppercase">
                  {t("pic_label_name")}
                </label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                  className="w-full bg-transparent text-gray-900 text-lg font-bold outline-none"
                  placeholder={t("pic_ph_name")}
                />
              </div>
              <div className="bg-gray-50 rounded-2xl px-6 py-4 border-2 border-gray-100 focus-within:border-booku-cyan transition-colors">
                <label className="text-xs font-black text-gray-500 block mb-1 tracking-widest uppercase">
                  {t("pic_label_age")}
                </label>
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) =>
                    setEditData({ ...editData, age: e.target.value })
                  }
                  className="w-full bg-transparent text-gray-900 text-lg font-bold outline-none"
                  placeholder={t("pic_ph_age")}
                />
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-gray-800 font-black text-base mb-4 text-center tracking-wide">
                {t("pic_select_char")}
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-5 gap-4 max-h-[30vh] overflow-y-auto p-4 bg-gray-50 rounded-3xl border-2 border-gray-100">
                {avatarList && avatarList.length > 0 ? (
                  avatarList.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() =>
                        setEditData({
                          ...editData,
                          avatar_url: avatar.image_url,
                        })
                      }
                      className={`aspect-square rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                        editData.avatar_url === avatar.image_url
                          ? "border-4 border-booku-cyan scale-110 shadow-lg ring-4 ring-white ring-inset"
                          : "border-4 border-white hover:border-booku-cream hover:scale-105 shadow-sm"
                      }`}
                    >
                      <img
                        src={getLocalAvatarUrl(avatar.image_url)}
                        alt={avatar.name}
                        className="w-full h-full object-cover bg-booku-cream p-1"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${avatar.name}&background=FFF6DE&color=F48F68`;
                        }}
                      />
                    </button>
                  ))
                ) : (
                  <p className="text-sm font-bold text-gray-400 col-span-full text-center py-6">
                    {t("pic_no_avatar")}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-booku-coral text-white hover:bg-orange-500 w-full py-4 rounded-2xl font-black transition-transform shadow-md hover:-translate-y-1 disabled:opacity-50 cursor-pointer text-lg tracking-wide border-none"
            >
              {isSaving ? t("pic_btn_saving") : t("pic_btn_save")}
            </button>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Logout */}
      <ActionPopupModal
        isOpen={isLogoutModalOpen}
        image={popupDeleteFavSvg}
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

export default ProfileInfoCard;
