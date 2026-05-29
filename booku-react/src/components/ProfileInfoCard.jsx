import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getUserProfile, getAvatars, updateUserProfile } from "../services/api";

const IconEdit = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
// Icon diubah warnanya ke Orange/Amber
const IconFire = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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
const IconMedal = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#D97706"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="7" fill="#FDE68A" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="#FDE68A" />
  </svg>
);
const IconPodium = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#D97706"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="10" y="9" width="4" height="11" fill="#FDE68A" />
    <rect x="4" y="14" width="4" height="6" fill="#FDE68A" />
    <rect x="16" y="12" width="4" height="8" fill="#FDE68A" />
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
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const [profileData, setProfileData] = useState(null);
  const [avatarList, setAvatarList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    age: "",
    avatar_url: "",
  });
  const [isSaving, setIsSaving] = useState(false);

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

  if (!profileData)
    return (
      <div className="w-full bg-white rounded-[32px] p-8 flex flex-col justify-center items-center min-h-[400px] border border-gray-100 shadow-sm">
        <div className="w-10 h-10 border-4 border-booku-cyan border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 font-bold animate-pulse">
          {t("pic_loading_status")}
        </p>
      </div>
    );

  return (
    <div className="w-full bg-white rounded-[32px] p-6 md:p-10 relative shadow-sm border border-gray-100 animate-fade-in flex flex-col justify-between min-h-auto md:min-h-[400px]">
      <button
        onClick={handleOpenModal}
        className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-2 bg-booku-cream px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-booku-yellow transition-all shadow-sm cursor-pointer z-10"
      >
        <IconEdit /> {t("pic_btn_edit")}
      </button>

      {/* Profil Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5 md:gap-8 mb-10 mt-2">
        <div className="relative">
          <div className="w-24 h-24 md:w-28 md:h-28 bg-booku-cyan/20 rounded-full border-4 border-booku-cyan overflow-hidden shadow-sm">
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
        </div>
        <div className="flex flex-col justify-center pt-2">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight truncate max-w-[200px] md:max-w-[300px] mx-auto md:mx-0">
            {profileData.username}
          </h2>
          <p className="text-sm font-bold text-gray-600 mt-2 bg-gray-100 px-4 py-1.5 rounded-full inline-block w-max mx-auto md:mx-0 border border-gray-200">
            {profileData.age > 0
              ? `${profileData.age} ${t("pic_age_years")}`
              : t("pic_age_not_set")}
          </p>
        </div>
      </div>

      {/* Stats - Dibuat jadi floating widgets */}
      <div className="grid grid-cols-3 gap-4 mb-10 w-full">
        <div className="flex flex-col items-center gap-2 bg-booku-cream p-4 rounded-2xl border border-booku-yellow/40">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <IconFire />
          </div>
          <h4 className="text-xl md:text-2xl font-black text-gray-800">
            {profileData.current_streak}
          </h4>
          <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
            {t("pic_daily_streak")}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 bg-booku-cream p-4 rounded-2xl border border-booku-yellow/40">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <IconMedal />
          </div>
          <h4 className="text-xl md:text-2xl font-black text-gray-800">
            {profileData.total_achievements}
          </h4>
          <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
            {t("pic_achievements")}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 bg-booku-cream p-4 rounded-2xl border border-booku-yellow/40">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <IconPodium />
          </div>
          <h4 className="text-xl md:text-2xl font-black text-gray-800">
            {profileData.rank}
          </h4>
          <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
            {t("pic_rank")}
          </p>
        </div>
      </div>

      {/* Kalender */}
      <div className="w-full bg-gray-50 p-4 rounded-3xl overflow-x-auto scrollbar-hide border border-gray-100">
        <div className="flex justify-between items-center min-w-[300px] gap-2">
          {profileData.calendar &&
            profileData.calendar.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center w-12 h-16 md:w-14 md:h-[72px] rounded-2xl transition-all shrink-0 ${
                  item.isActive
                    ? "bg-booku-cyan text-white shadow-md scale-105"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="h-2 mb-1">
                  {item.isToday && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${item.isActive ? "bg-white" : "bg-gray-800"}`}
                    ></div>
                  )}
                </div>
                <span
                  className={`text-[10px] md:text-xs font-bold mb-0.5 ${item.isActive ? "text-white/80" : "text-gray-400"}`}
                >
                  {dayTranslations[language][item.day] || item.day}
                </span>
                <span
                  className={`text-sm md:text-lg font-black ${item.isActive ? "text-white" : "text-gray-800"}`}
                >
                  {item.date}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Modal Edit Profil */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 md:p-10 relative shadow-2xl scale-100 transition-transform max-h-[90vh] overflow-y-auto scrollbar-hide border-4 border-booku-cream">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer bg-gray-100 rounded-full p-2"
            >
              <IconClose />
            </button>

            <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 mb-8 uppercase tracking-wide">
              {t("pic_modal_title")}
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-booku-cream/50 rounded-2xl px-5 py-3 border-2 border-booku-cream focus-within:border-booku-cyan transition-colors">
                <label className="text-xs font-black text-gray-500 block mb-1 tracking-widest">
                  {t("pic_label_name")}
                </label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                  className="w-full bg-transparent text-gray-900 text-base font-bold outline-none"
                  placeholder={t("pic_ph_name")}
                />
              </div>
              <div className="bg-booku-cream/50 rounded-2xl px-5 py-3 border-2 border-booku-cream focus-within:border-booku-cyan transition-colors">
                <label className="text-xs font-black text-gray-500 block mb-1 tracking-widest">
                  {t("pic_label_age")}
                </label>
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) =>
                    setEditData({ ...editData, age: e.target.value })
                  }
                  className="w-full bg-transparent text-gray-900 text-base font-bold outline-none"
                  placeholder={t("pic_ph_age")}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-gray-800 font-bold text-sm mb-4 text-center">
                {t("pic_select_char")}
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-5 gap-4 max-h-[30vh] overflow-y-auto p-3 bg-gray-50 rounded-3xl border border-gray-100">
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
                  <p className="text-xs text-gray-400 col-span-full text-center py-4">
                    {t("pic_no_avatar")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-booku-coral text-white hover:brightness-110 w-full py-4 rounded-2xl font-black transition-all shadow-md hover:-translate-y-1 disabled:opacity-50 cursor-pointer text-base uppercase tracking-widest"
              >
                {isSaving ? t("pic_btn_saving") : t("pic_btn_save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoCard;
