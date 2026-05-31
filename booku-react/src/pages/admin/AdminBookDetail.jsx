import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  HiMusicNote,
  HiOutlineVolumeUp,
  HiChevronRight,
  HiCheck,
  HiX,
  HiPencil,
  HiStop,
  HiMicrophone,
  HiTrash,
} from "react-icons/hi";

import { useAuth } from "../../context/AuthContext";
import {
  getAdminBookDetail,
  updateAdminBookStatus,
  deleteAdminBook,
} from "../../services/api";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAdminToast } from "../../context/AdminToastContext";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";

const AdminBookDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showLoading } = useAdminToast();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // STATE UNTUK AUDIO PLAYER Global
  const [playingAudioUrl, setPlayingAudioUrl] = useState(null);
  const audioRef = useRef(null);

  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    targetStatus: "",
  });

  const fetchDetail = async () => {
    if (!id || id === "undefined") return;
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getAdminBookDetail(id, token);
      setBook(data);
    } catch (err) {
      if (err.message.includes("404")) {
        navigate("/admin/books", { replace: true });
      } else {
        showError("Gagal memuat detail cerita: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const confirmUpdateStatus = async () => {
    const newStatus = statusModal.targetStatus;
    showLoading(true);
    try {
      if (newStatus === "hapus_permanen") {
        await deleteAdminBook(id, token);
        showSuccess("Buku beserta halamannya berhasil dihapus permanen!");
        navigate("/admin/books", { replace: true });
      } else {
        await updateAdminBookStatus(id, newStatus, token);
        showSuccess(
          `Status cerita berhasil diubah menjadi ${newStatus.toUpperCase()}!`,
        );
        setStatusModal({ isOpen: false, targetStatus: "" });
        fetchDetail();
      }
    } catch (err) {
      showError(`Gagal memproses aksi: ${err.message}`);
    } finally {
      showLoading(false);
    }
  };

  const handleToggleAudio = (url) => {
    if (!url) return showError("Audio tidak tersedia");
    const fullUrl = getImageUrl(url);

    if (playingAudioUrl === fullUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudioUrl(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const newAudio = new Audio(fullUrl);
    audioRef.current = newAudio;
    setPlayingAudioUrl(fullUrl);

    newAudio.play().catch((err) => {
      console.error(err);
      showError("Gagal memutar audio. Pastikan file tersedia.");
      setPlayingAudioUrl(null);
    });

    newAudio.onended = () => {
      setPlayingAudioUrl(null);
    };
  };

  const getModalConfig = () => {
    switch (statusModal.targetStatus) {
      case "terbit":
        return {
          title: "Terbitkan Cerita?",
          desc: "Cerita akan langsung tersedia di aplikasi User dan dapat dibaca oleh publik.",
          variant: "primary",
          btn: "Terbitkan",
        };
      case "ditolak":
        return {
          title: "Tolak Cerita?",
          desc: "Cerita ini akan ditolak dan dikembalikan ke penulis/editor untuk diperbaiki.",
          variant: "danger",
          btn: "Tolak Cerita",
        };
      case "arsip":
        return {
          title: "Arsipkan Cerita?",
          desc: "Buku akan ditarik dari publik dan masuk ke daftar Arsip.",
          variant: "primary",
          btn: "Arsipkan",
        };
      case "review":
        return {
          title: "Kirim Ulang ke Review?",
          desc: "Buku ini akan dimasukkan kembali ke antrean Review.",
          variant: "primary",
          btn: "Kirim",
        };
      case "dihapus":
        return {
          title: "Hapus Buku?",
          desc: "Buku ini akan dipindahkan ke daftar 'Dihapus' dan ditarik dari antrean. Anda masih dapat memulihkan statusnya di kemudian hari jika diperlukan.",
          variant: "danger",
          btn: "Ya, Hapus Buku",
        };
      case "hapus_permanen":
        return {
          title: "Hapus Permanen?",
          desc: "Tindakan ini akan menghapus BUKU beserta seluruh HALAMAN, GAMBAR, dan AUDIO dari database secara permanen. Anda yakin?",
          variant: "danger",
          btn: "Hapus Permanen",
        };
      default:
        return {
          title: "Ubah Status?",
          desc: "Lanjutkan aksi ini?",
          variant: "primary",
          btn: "Lanjutkan",
        };
    }
  };

  const currentModalConfig = getModalConfig();

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-bold text-gray-500 animate-pulse">
          Memuat Detail Cerita...
        </div>
      </div>
    );
  if (!book && !isLoading) {
    navigate("/admin/books", { replace: true });
    return null;
  }

  const bgmFullUrl = book.bg_music ? getImageUrl(book.bg_music) : null;
  const isBgmPlaying = playingAudioUrl === bgmFullUrl && bgmFullUrl !== null;

  const titleAudioIdFullUrl = book.title_audio_id_url
    ? getImageUrl(book.title_audio_id_url)
    : null;
  const isTitleAudioIdPlaying =
    playingAudioUrl === titleAudioIdFullUrl && titleAudioIdFullUrl !== null;

  const titleAudioEnFullUrl = book.title_audio_en_url
    ? getImageUrl(book.title_audio_en_url)
    : null;
  const isTitleAudioEnPlaying =
    playingAudioUrl === titleAudioEnFullUrl && titleAudioEnFullUrl !== null;

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-2 text-sm font-bold mb-8">
        <Link
          to="/admin/books"
          className="text-gray-400 hover:text-gray-700 transition"
        >
          Manajemen Buku
        </Link>
        <HiChevronRight className="text-gray-400" />
        <span className="text-orange-500">Detail Cerita ({book.status})</span>
      </div>

      <div className="bg-white w-full rounded-4xl shadow-sm border border-gray-100 p-8 md:p-10 mb-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
          <div className="flex-1 space-y-6 w-full">
            <div>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1.5 block">
                Versi Indonesia
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                  {book.title_id || book.title}
                </h1>
                <button
                  onClick={() => handleToggleAudio(book.title_audio_id_url)}
                  disabled={!book.title_audio_id_url}
                  className={`shrink-0 inline-flex items-center justify-center gap-1.5 font-semibold text-xs px-3 py-2 rounded-lg transition shadow-sm
                    ${
                      !book.title_audio_id_url
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isTitleAudioIdPlaying
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          : "bg-purple-500 hover:bg-purple-600 text-white cursor-pointer"
                    }`}
                >
                  {isTitleAudioIdPlaying ? (
                    <HiStop className="text-base" />
                  ) : (
                    <HiMicrophone className="text-base" />
                  )}
                  {book.title_audio_id_url
                    ? isTitleAudioIdPlaying
                      ? "Stop"
                      : "Play"
                    : "Kosong"}
                </button>
              </div>
              <p className="text-sm font-medium text-gray-600 mt-2 leading-relaxed max-w-3xl">
                {book.description_id || "Belum ada deskripsi."}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1.5 block">
                Versi English
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                  {book.title_en || (
                    <i className="text-gray-400 font-medium text-lg">
                      Belum ada terjemahan judul
                    </i>
                  )}
                </h1>
                <button
                  onClick={() => handleToggleAudio(book.title_audio_en_url)}
                  disabled={!book.title_audio_en_url}
                  className={`shrink-0 inline-flex items-center justify-center gap-1.5 font-semibold text-xs px-3 py-2 rounded-lg transition shadow-sm
                    ${
                      !book.title_audio_en_url
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isTitleAudioEnPlaying
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                    }`}
                >
                  {isTitleAudioEnPlaying ? (
                    <HiStop className="text-base" />
                  ) : (
                    <HiMicrophone className="text-base" />
                  )}
                  {book.title_audio_en_url
                    ? isTitleAudioEnPlaying
                      ? "Stop"
                      : "Play"
                    : "Kosong"}
                </button>
              </div>
              <p className="text-sm font-medium text-gray-600 mt-2 leading-relaxed max-w-3xl">
                {book.description_en || (
                  <i className="text-gray-400">
                    Belum ada terjemahan deskripsi
                  </i>
                )}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span
              className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider inline-block ${
                book.status === "review"
                  ? "bg-yellow-100 text-yellow-700"
                  : book.status === "terbit"
                    ? "bg-green-100 text-green-700"
                    : book.status === "ditolak" || book.status === "arsip"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
              }`}
            >
              {book.status}
            </span>
          </div>
        </div>

        {/* METADATA GRID (Disesuaikan untuk Atribusi) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-sm font-semibold text-gray-600 bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-8">
          <div>
            <span className="block text-xs text-gray-400 mb-1">
              Diajukan Tanggal
            </span>
            <span className="text-gray-900">{book.date}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400 mb-1">
              Sumber Cerita
            </span>
            <span
              className="text-gray-900 truncate block max-w-[150px]"
              title={book.attribution_text || "Original Funtasya"}
            >
              {book.attribution_text
                ? "Eksternal (Lisensi)"
                : "Original Funtasya"}
            </span>
          </div>
          <div>
            <span className="block text-xs text-gray-400 mb-1">Kategori</span>
            <span className="text-gray-900">
              {book.category_name_id || "Tanpa Kategori"}
            </span>
          </div>
          <div>
            <span className="block text-xs text-gray-400 mb-1">
              Jumlah Scene
            </span>
            <span className="text-gray-900">
              {book.scenes?.length || 0} Scene
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Sampul Buku</h3>
          <div className="flex flex-wrap gap-5">
            <div className="w-36 md:w-44 shrink-0 aspect-[5/8] rounded-2xl overflow-hidden shadow-sm bg-gray-100 relative group border border-gray-200">
              <span className="absolute top-2 right-2 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                ID
              </span>
              <img
                src={getImageUrl(book.cover_image_id || book.cover_image)}
                alt={`${book.title_id || book.title} - Cover ID`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/300x480?text=No+Cover+ID";
                }}
              />
            </div>

            <div className="w-36 md:w-44 shrink-0 aspect-[5/8] rounded-2xl overflow-hidden shadow-sm bg-gray-100 relative group border border-gray-200">
              <span className="absolute top-2 right-2 bg-blue-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                EN
              </span>
              <img
                src={getImageUrl(book.cover_image_en || book.cover_image)}
                alt={`${book.title_en || book.title} - Cover EN`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/300x480?text=No+Cover+EN";
                }}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-3">
          <button
            onClick={() => handleToggleAudio(book.bg_music)}
            className={`inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition shadow-sm cursor-pointer ${
              isBgmPlaying
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-[#F64C4C] hover:bg-red-600 text-white"
            }`}
          >
            {isBgmPlaying ? (
              <HiStop className="text-lg" />
            ) : (
              <HiMusicNote className="text-lg" />
            )}
            {isBgmPlaying ? "Hentikan Musik" : "Putar Musik Latar"}
          </button>

          <Link
            to={`/admin/books/${id}/edit`}
            className="inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-6 py-3 rounded-xl transition shadow-sm cursor-pointer"
          >
            <HiPencil className="text-lg" /> Edit Buku
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {book.scenes.map((scene) => {
          const dubIdFullUrl = scene.dubbing_id_url
            ? getImageUrl(scene.dubbing_id_url)
            : null;
          const isDubIdPlaying =
            playingAudioUrl === dubIdFullUrl && dubIdFullUrl !== null;

          const dubEnFullUrl = scene.dubbing_en_url
            ? getImageUrl(scene.dubbing_en_url)
            : null;
          const isDubEnPlaying =
            playingAudioUrl === dubEnFullUrl && dubEnFullUrl !== null;

          return (
            <div
              key={scene.page_number}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col lg:flex-row gap-8 min-w-0"
            >
              <div className="w-full lg:w-1/3 shrink-0">
                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100">
                  <img
                    src={getImageUrl(scene.image)}
                    alt={`Scene ${scene.page_number}`}
                    className="w-full aspect-[4/3] object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/600x450?text=No+Image";
                    }}
                  />
                </div>
              </div>
              <div className="w-full lg:w-2/3 flex flex-col gap-5 min-w-0">
                <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">
                  Scene {scene.page_number}
                </h3>

                <div className="bg-orange-50/30 p-5 rounded-2xl border border-orange-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-orange-800 block mb-2">
                        Indonesia:
                      </span>
                      <p className="text-sm font-medium text-gray-700 leading-relaxed wrap-break-word whitespace-pre-wrap">
                        {scene.text_id}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleAudio(scene.dubbing_id_url)}
                      disabled={!scene.has_dubbing_id}
                      className={`shrink-0 inline-flex items-center justify-center gap-2 font-semibold text-xs px-4 py-2.5 rounded-lg transition w-full sm:w-auto mt-2 sm:mt-0 cursor-pointer 
                        ${
                          !scene.has_dubbing_id
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : isDubIdPlaying
                              ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                              : "bg-[#6B4EFF] hover:bg-indigo-600 text-white"
                        }`}
                    >
                      {isDubIdPlaying ? (
                        <HiStop className="text-base" />
                      ) : (
                        <HiOutlineVolumeUp className="text-base" />
                      )}
                      {scene.has_dubbing_id
                        ? isDubIdPlaying
                          ? "Hentikan"
                          : "Putar Dubbing"
                        : "Audio Kosong"}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-blue-800 block mb-2">
                        English:
                      </span>
                      <p className="text-sm font-medium text-gray-700 leading-relaxed wrap-break-word whitespace-pre-wrap">
                        {scene.text_en || (
                          <i className="text-gray-400">Belum ada terjemahan</i>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleAudio(scene.dubbing_en_url)}
                      disabled={!scene.has_dubbing_en}
                      className={`shrink-0 inline-flex items-center justify-center gap-2 font-semibold text-xs px-4 py-2.5 rounded-lg transition w-full sm:w-auto mt-2 sm:mt-0 cursor-pointer 
                        ${
                          !scene.has_dubbing_en
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : isDubEnPlaying
                              ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                              : "bg-[#6B4EFF] hover:bg-indigo-600 text-white"
                        }`}
                    >
                      {isDubEnPlaying ? (
                        <HiStop className="text-base" />
                      ) : (
                        <HiOutlineVolumeUp className="text-base" />
                      )}
                      {scene.has_dubbing_en
                        ? isDubEnPlaying
                          ? "Hentikan"
                          : "Putar Dubbing"
                        : "Audio Kosong"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4">
        {book.status === "dihapus" ? (
          <>
            <button
              onClick={() =>
                setStatusModal({ isOpen: true, targetStatus: "hapus_permanen" })
              }
              className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold px-8 py-4 rounded-xl transition cursor-pointer"
            >
              <HiTrash className="text-xl" /> Hapus Permanen
            </button>
            <button
              onClick={() =>
                setStatusModal({ isOpen: true, targetStatus: "arsip" })
              }
              className="flex items-center justify-center gap-2 bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-xl transition cursor-pointer shadow-sm"
            >
              <HiCheck className="text-xl" /> Pulihkan ke Arsip
            </button>
          </>
        ) : (
          <>
            {book.status !== "terbit" && (
              <button
                onClick={() =>
                  setStatusModal({ isOpen: true, targetStatus: "dihapus" })
                }
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 font-bold px-8 py-4 rounded-xl transition cursor-pointer"
              >
                <HiTrash className="text-xl" /> Hapus Buku
              </button>
            )}

            {book.status === "review" && (
              <button
                onClick={() =>
                  setStatusModal({ isOpen: true, targetStatus: "ditolak" })
                }
                className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-8 py-4 rounded-xl transition cursor-pointer"
              >
                <HiX className="text-xl" /> Tolak Cerita
              </button>
            )}

            {(book.status === "review" ||
              book.status === "arsip" ||
              book.status === "ditolak") && (
              <button
                onClick={() =>
                  setStatusModal({
                    isOpen: true,
                    targetStatus:
                      book.status === "review" ? "terbit" : "review",
                  })
                }
                className="flex items-center justify-center gap-2 bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-xl transition cursor-pointer shadow-sm"
              >
                <HiCheck className="text-xl" />
                {book.status === "review"
                  ? "Terbitkan Buku"
                  : "Kirim untuk direview"}
              </button>
            )}

            {book.status === "terbit" && (
              <button
                onClick={() =>
                  setStatusModal({ isOpen: true, targetStatus: "arsip" })
                }
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-8 py-4 rounded-xl transition cursor-pointer"
              >
                Arsipkan Buku Ini
              </button>
            )}
          </>
        )}
      </div>

      <AdminConfirmModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, targetStatus: "" })}
        onConfirm={confirmUpdateStatus}
        title={currentModalConfig.title}
        description={currentModalConfig.desc}
        variant={currentModalConfig.variant}
        confirmText={currentModalConfig.btn}
      />
    </div>
  );
};

export default AdminBookDetail;
