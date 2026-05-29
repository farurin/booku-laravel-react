import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiMusicNote,
  HiMicrophone,
  HiOutlineUpload,
  HiX,
  HiPencil,
  HiTrash,
  HiPlus,
} from "react-icons/hi";
import {
  getCategories,
  getAdminBookDetail,
  updateAdminBook,
  addAdminBookPage,
  updateAdminBookPage,
  deleteAdminBookPage,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAdminToast } from "../../context/AdminToastContext";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";

const AdminEditBook = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showLoading } = useAdminToast();

  const [activeTab, setActiveTab] = useState("info"); // 'info' atau 'scenes'
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // STATE TAB 1: INFORMASI BUKU
  const [existingBgMusic, setExistingBgMusic] = useState(null);
  const [existingTitleAudioId, setExistingTitleAudioId] = useState(null);
  const [existingTitleAudioEn, setExistingTitleAudioEn] = useState(null);

  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionId, setDescriptionId] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [youtubeUrlId, setYoutubeUrlId] = useState("");
  const [youtubeUrlEn, setYoutubeUrlEn] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [statusBook, setStatusBook] = useState("review");

  const [bgMusic, setBgMusic] = useState(null);
  const [titleAudioId, setTitleAudioId] = useState(null);
  const [titleAudioEn, setTitleAudioEn] = useState(null);

  // cover baru
  const [coverImageId, setCoverImageId] = useState(null);
  const [coverPreviewId, setCoverPreviewId] = useState(null);
  const [coverImageEn, setCoverImageEn] = useState(null);
  const [coverPreviewEn, setCoverPreviewEn] = useState(null);

  // STATE TAB 2: KELOLA SCENE
  const [scenes, setScenes] = useState([]);

  // State untuk Modal Form Scene
  const [isSceneModalOpen, setIsSceneModalOpen] = useState(false);
  const [currentEditScene, setCurrentEditScene] = useState(null); // null = mode tambah

  const [sceneImagePreview, setSceneImagePreview] = useState(null);
  const [sceneImageFile, setSceneImageFile] = useState(null);
  const [sceneSubId, setSceneSubId] = useState("");
  const [sceneSubEn, setSceneSubEn] = useState("");
  const [sceneDubIdFile, setSceneDubIdFile] = useState(null);
  const [sceneDubEnFile, setSceneDubEnFile] = useState(null);

  // State untuk Modal Hapus Scene
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null);

  const fetchBookData = useCallback(async () => {
    try {
      const cats = await getCategories();
      setCategoryList(cats);

      const bookData = await getAdminBookDetail(id, token);

      setTitleId(bookData.title_id || "");
      setTitleEn(bookData.title_en || "");
      setDescriptionId(bookData.description_id || "");
      setDescriptionEn(bookData.description_en || "");
      setYoutubeUrlId(bookData.youtube_url_id || "");
      setYoutubeUrlEn(bookData.youtube_url_en || "");
      setStatusBook(bookData.status);

      const matchedCat = cats.find(
        (c) => c.name_id === bookData.category_name_id,
      );
      if (matchedCat) setCategoryId(matchedCat.id);

      setCoverPreviewId(
        bookData.cover_image_id ? getImageUrl(bookData.cover_image_id) : null,
      );
      setCoverPreviewEn(
        bookData.cover_image_en ? getImageUrl(bookData.cover_image_en) : null,
      );
      setExistingBgMusic(bookData.bg_music);
      setExistingTitleAudioId(bookData.title_audio_id_url);
      setExistingTitleAudioEn(bookData.title_audio_en_url);

      setScenes(bookData.scenes || []);
    } catch (err) {
      showError("Gagal memuat data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id, token, showError]);

  useEffect(() => {
    if (token) fetchBookData();
  }, [fetchBookData, token]);

  // fungsi handle 2 cover
  const handleCoverIdChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImageId(file);
    setCoverPreviewId(URL.createObjectURL(file));
  };
  const handleCoverEnChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImageEn(file);
    setCoverPreviewEn(URL.createObjectURL(file));
  };

  // SUBMIT TAB 1: INFORMASI BUKU
  const handleUpdateBookInfo = async (e) => {
    e.preventDefault();
    if (!titleId || !descriptionId || !categoryId) {
      return showError("Judul (ID), Deskripsi (ID), dan Kategori wajib diisi!");
    }

    showLoading(true);
    const formData = new FormData();
    formData.append("_method", "PUT"); // Method Spoofing untuk update buku
    formData.append("title_id", titleId);
    formData.append("title_en", titleEn || "");
    formData.append("description_id", descriptionId);
    formData.append("description_en", descriptionEn || "");
    formData.append("youtube_url_id", youtubeUrlId || "");
    formData.append("youtube_url_en", youtubeUrlEn || "");
    formData.append("id_categories", categoryId);
    formData.append("status", statusBook);

    if (coverImageId) formData.append("cover_image_id", coverImageId);
    if (coverImageEn) formData.append("cover_image_en", coverImageEn);
    formData.append("existing_bg_music", existingBgMusic || null);
    formData.append("existing_title_audio_id", existingTitleAudioId || null);
    formData.append("existing_title_audio_en", existingTitleAudioEn || null);

    if (bgMusic) formData.append("bg_music", bgMusic);
    if (titleAudioId) formData.append("title_audio_id", titleAudioId);
    if (titleAudioEn) formData.append("title_audio_en", titleAudioEn);

    try {
      const data = await updateAdminBook(id, formData, token);
      showSuccess(data.message || "Informasi Buku berhasil diperbarui!");
      fetchBookData();
    } catch (err) {
      showError("Terjadi kesalahan: " + err.message);
    } finally {
      showLoading(false);
    }
  };

  // LOGIKA MODAL SCENE
  const handleOpenSceneModal = (scene = null) => {
    setCurrentEditScene(scene);
    if (scene) {
      // Mode Edit
      setSceneImagePreview(getImageUrl(scene.image));
      setSceneSubId(scene.text_id || "");
      setSceneSubEn(scene.text_en || "");
    } else {
      // Mode Tambah Baru
      setSceneImagePreview(null);
      setSceneSubId("");
      setSceneSubEn("");
    }
    setSceneImageFile(null);
    setSceneDubIdFile(null);
    setSceneDubEnFile(null);
    setIsSceneModalOpen(true);
  };

  const handleCloseSceneModal = () => setIsSceneModalOpen(false);

  const handleSaveScene = async (e) => {
    e.preventDefault();
    showLoading(true);

    const formData = new FormData();
    formData.append("text_id", sceneSubId);
    formData.append("text_en", sceneSubEn);

    if (sceneImageFile) formData.append("scene_image", sceneImageFile);
    if (sceneDubIdFile) formData.append("scene_dubbing_id", sceneDubIdFile);
    if (sceneDubEnFile) formData.append("scene_dubbing_en", sceneDubEnFile);

    try {
      if (currentEditScene) {
        // Mode Edit Scene
        await updateAdminBookPage(currentEditScene.id, formData, token);
        showSuccess(
          `Scene ${currentEditScene.page_number} berhasil diperbarui!`,
        );
      } else {
        // Mode Tambah Scene Baru
        await addAdminBookPage(id, formData, token);
        showSuccess("Halaman baru berhasil ditambahkan!");
      }
      handleCloseSceneModal();
      fetchBookData(); // Reload daftar scene dari server
    } catch (err) {
      showError("Terjadi kesalahan: " + err.message);
    } finally {
      showLoading(false);
    }
  };

  const confirmDeleteScene = async () => {
    if (!sceneToDelete) return;
    showLoading(true);
    try {
      await deleteAdminBookPage(sceneToDelete.id, token);
      showSuccess("Halaman berhasil dihapus!");
      setIsDeleteModalOpen(false);
      fetchBookData();
    } catch (err) {
      showError("Gagal menghapus: " + err.message);
    } finally {
      showLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-12 text-center text-gray-500 font-bold w-full min-h-screen flex items-center justify-center">
        Memuat Data Buku...
      </div>
    );

  return (
    <div className="p-8 md:p-12 w-full flex justify-center items-start min-h-screen">
      <div className="bg-white w-full max-w-6xl rounded-4xl shadow-sm border border-gray-100 p-8 md:p-10 relative">
        <button
          onClick={() => navigate("/admin/books")}
          className="absolute top-8 left-8 text-gray-400 hover:text-gray-800 font-semibold text-sm cursor-pointer"
        >
          ← Kembali
        </button>

        <div className="text-center mb-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Update Buku: {titleId}
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Kelola informasi utama dan halaman-halaman cerita di bawah ini.
          </p>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-gray-200 mb-8 justify-center">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-3 px-8 font-bold text-sm border-b-4 transition-colors cursor-pointer ${
              activeTab === "info"
                ? "border-yellow-400 text-yellow-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Informasi Buku
          </button>
          <button
            onClick={() => setActiveTab("scenes")}
            className={`py-3 px-8 font-bold text-sm border-b-4 transition-colors cursor-pointer ${
              activeTab === "scenes"
                ? "border-yellow-400 text-yellow-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Kelola Halaman ({scenes.length})
          </button>
        </div>

        {/* TAB 1: INFORMASI BUKU */}
        {activeTab === "info" && (
          <form
            onSubmit={handleUpdateBookInfo}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Kolom Kiri: Cover Image */}
              <div className="w-full md:w-1/3 flex flex-col gap-6 items-center">
                {/* Cover ID */}
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-900 mb-2">
                    Sampul Indonesia
                  </span>
                  <label className="w-48 aspect-5/8 border-[3px] border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-colors relative overflow-hidden group">
                    {coverPreviewId ? (
                      <>
                        <img
                          src={coverPreviewId}
                          alt="Cover ID"
                          className="w-full h-full object-cover bg-gray-50"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <HiOutlineUpload className="text-3xl text-white mb-2" />
                          <span className="text-white font-bold text-sm">
                            Ganti Sampul ID
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        Upload ID
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={handleCoverIdChange}
                    />
                  </label>
                </div>

                {/* Cover EN */}
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-900 mb-2">
                    Sampul English
                  </span>
                  <label className="w-48 aspect-5/8 border-[3px] border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors relative overflow-hidden group">
                    {coverPreviewEn ? (
                      <>
                        <img
                          src={coverPreviewEn}
                          alt="Cover EN"
                          className="w-full h-full object-cover bg-gray-50"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <HiOutlineUpload className="text-3xl text-white mb-2" />
                          <span className="text-white font-bold text-sm">
                            Ganti Sampul EN
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        Upload EN
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={handleCoverEnChange}
                    />
                  </label>
                </div>
              </div>

              {/* Kolom Kanan: Form Data */}
              <div className="w-full md:w-2/3 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Judul Cerita (ID)
                    </label>
                    <input
                      type="text"
                      value={titleId}
                      onChange={(e) => setTitleId(e.target.value)}
                      className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Judul Cerita (EN){" "}
                      <span className="text-gray-400 font-normal ml-1">
                        (Opsional)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Deskripsi Cerita (ID)
                    </label>
                    <textarea
                      value={descriptionId}
                      onChange={(e) => setDescriptionId(e.target.value)}
                      rows="4"
                      className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm outline-none resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Deskripsi Cerita (EN){" "}
                      <span className="text-gray-400 font-normal ml-1">
                        (Opsional)
                      </span>
                    </label>
                    <textarea
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      rows="4"
                      className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Kategori
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm outline-none"
                    >
                      <option value="" disabled>
                        Pilih Kategori
                      </option>
                      {categoryList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name_id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Status Penayangan
                    </label>
                    <select
                      value={statusBook}
                      onChange={(e) => setStatusBook(e.target.value)}
                      className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      <option value="review">Review</option>
                      <option value="terbit">Terbit</option>
                      <option value="arsip">Arsip</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>

                {/* Media Global */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Link YouTube (ID)
                    </label>
                    <input
                      type="url"
                      value={youtubeUrlId}
                      onChange={(e) => setYoutubeUrlId(e.target.value)}
                      placeholder="https://youtu.be/..."
                      className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Link YouTube (EN)
                    </label>
                    <input
                      type="url"
                      value={youtubeUrlEn}
                      onChange={(e) => setYoutubeUrlEn(e.target.value)}
                      placeholder="https://youtu.be/..."
                      className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">
                      Ubah Musik Latar (BGM)
                    </label>
                    <label className="w-full inline-flex items-center justify-center gap-2 bg-[#F64C4C] hover:bg-red-600 text-white font-semibold text-xs px-4 py-3 rounded-xl cursor-pointer">
                      <HiMusicNote className="text-sm" />{" "}
                      {bgMusic
                        ? bgMusic.name
                        : existingBgMusic
                          ? "Audio Tersimpan. Klik untuk ganti."
                          : "Upload BGM"}
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => setBgMusic(e.target.files[0])}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-2">
                        Voiceover Judul (ID)
                      </label>
                      <label className="w-full inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-xs px-2 py-3 rounded-xl cursor-pointer">
                        <HiMicrophone className="text-sm shrink-0" />{" "}
                        <span className="truncate">
                          {titleAudioId
                            ? titleAudioId.name
                            : existingTitleAudioId
                              ? "Tersimpan (Ganti)"
                              : "Upload"}
                        </span>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => setTitleAudioId(e.target.files[0])}
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-2">
                        Voiceover Judul (EN)
                      </label>
                      <label className="w-full inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs px-2 py-3 rounded-xl cursor-pointer">
                        <HiMicrophone className="text-sm shrink-0" />{" "}
                        <span className="truncate">
                          {titleAudioEn
                            ? titleAudioEn.name
                            : existingTitleAudioEn
                              ? "Tersimpan (Ganti)"
                              : "Upload"}
                        </span>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => setTitleAudioEn(e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-3.5 px-10 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Simpan Perubahan Informasi
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: KELOLA HALAMAN / SCENE */}
        {activeTab === "scenes" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                Daftar Halaman Cerita
              </h3>
              <button
                onClick={() => handleOpenSceneModal()}
                className="bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <HiPlus className="text-lg" /> Tambah Halaman
              </button>
            </div>

            {scenes.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold mb-2">
                  Buku ini belum memiliki halaman.
                </p>
                <p className="text-sm text-gray-400">
                  Klik "Tambah Halaman" untuk memulai menyusun cerita.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenes.map((scene) => (
                  <div
                    key={scene.id}
                    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col"
                  >
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-black px-3 py-1.5 rounded-lg shadow-sm z-10">
                      Hal {scene.page_number}
                    </div>

                    <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-gray-100 mb-4 relative">
                      <img
                        src={getImageUrl(scene.image)}
                        alt={`Page ${scene.page_number}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <p className="text-xs font-bold text-gray-500 mb-1">
                          Teks (ID):
                        </p>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 bg-gray-50 p-2 rounded-lg">
                          {scene.text_id || (
                            <span className="italic text-gray-400">Kosong</span>
                          )}
                        </p>
                      </div>

                      <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex gap-2">
                          {/* Badges Audio */}
                          <div
                            title={
                              scene.has_dubbing_id
                                ? "Audio ID Tersedia"
                                : "Audio ID Kosong"
                            }
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${scene.has_dubbing_id ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-400"}`}
                          >
                            <span className="text-[9px] font-black">ID</span>
                          </div>
                          <div
                            title={
                              scene.has_dubbing_en
                                ? "Audio EN Tersedia"
                                : "Audio EN Kosong"
                            }
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${scene.has_dubbing_en ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                          >
                            <span className="text-[9px] font-black">EN</span>
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleOpenSceneModal(scene)}
                            className="w-9 h-9 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center hover:bg-orange-100 cursor-pointer transition"
                          >
                            <HiPencil />
                          </button>
                          <button
                            onClick={() => {
                              setSceneToDelete(scene);
                              setIsDeleteModalOpen(true);
                            }}
                            className="w-9 h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 cursor-pointer transition"
                          >
                            <HiTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: FORM TAMBAH / EDIT SCENE*/}
      {isSceneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl p-6 md:p-8 custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {currentEditScene
                  ? `Edit Halaman ${currentEditScene.page_number}`
                  : "Tambah Halaman Baru"}
              </h3>
              <button
                onClick={handleCloseSceneModal}
                className="text-gray-400 hover:text-red-500 transition text-2xl"
              >
                <HiX />
              </button>
            </div>

            <form onSubmit={handleSaveScene} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Gambar Scene */}
                <div className="w-full md:w-1/3 flex flex-col">
                  <label className="text-sm font-bold text-gray-900 mb-2">
                    Ilustrasi Halaman
                  </label>
                  <label className="w-full aspect-4/3 bg-gray-100 rounded-2xl overflow-hidden relative group border border-dashed border-gray-300 cursor-pointer hover:border-orange-400 transition-colors">
                    {sceneImagePreview ? (
                      <img
                        src={sceneImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <HiOutlineUpload className="text-3xl mb-2" />
                        <span className="text-sm font-bold">Upload Gambar</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-sm">
                        Pilih Gambar
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSceneImageFile(file);
                          setSceneImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  {!sceneImagePreview && !currentEditScene && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      *Wajib diisi
                    </p>
                  )}
                </div>

                {/* Konten Teks & Audio */}
                <div className="w-full md:w-2/3 space-y-6">
                  {/* Blok Indonesia */}
                  <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-bold text-orange-900">
                        Konten Bahasa Indonesia
                      </label>
                      <label className="flex items-center gap-2 bg-[#C97BFF] hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition">
                        <HiMicrophone />{" "}
                        {sceneDubIdFile
                          ? sceneDubIdFile.name
                          : currentEditScene?.has_dubbing_id
                            ? "Ganti Audio ID"
                            : "Upload Audio ID"}
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => setSceneDubIdFile(e.target.files[0])}
                        />
                      </label>
                    </div>
                    <textarea
                      value={sceneSubId}
                      onChange={(e) => setSceneSubId(e.target.value)}
                      placeholder="Masukkan teks narasi atau dialog..."
                      className="w-full bg-white rounded-xl px-4 py-3 text-sm min-h-25 outline-none border border-gray-200 focus:border-orange-400 resize-y"
                    />
                  </div>

                  {/* Blok Inggris */}
                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-bold text-blue-900">
                        Konten Bahasa Inggris
                      </label>
                      <label className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition">
                        <HiMicrophone />{" "}
                        {sceneDubEnFile
                          ? sceneDubEnFile.name
                          : currentEditScene?.has_dubbing_en
                            ? "Ganti Audio EN"
                            : "Upload Audio EN"}
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => setSceneDubEnFile(e.target.files[0])}
                        />
                      </label>
                    </div>
                    <textarea
                      value={sceneSubEn}
                      onChange={(e) => setSceneSubEn(e.target.value)}
                      placeholder="Enter english narrative or dialogue text..."
                      className="w-full bg-white rounded-xl px-4 py-3 text-sm min-h-25 outline-none border border-gray-200 focus:border-blue-400 resize-y"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseSceneModal}
                  className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#F8AF2F] hover:bg-yellow-500 text-white px-8 py-3 rounded-xl font-bold shadow-sm transition cursor-pointer"
                >
                  {currentEditScene
                    ? "Simpan Perubahan"
                    : "Simpan Halaman Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS SCENE*/}
      <AdminConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteScene}
        title="Hapus Halaman?"
        description={`Halaman ${sceneToDelete?.page_number} akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
        warningText="Data scene (gambar, teks, dan audio) yang dihapus tidak dapat dikembalikan lagi."
        variant="danger"
        confirmText="Ya, Hapus"
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #9CA3AF; }
      `}</style>
    </div>
  );
};

export default AdminEditBook;
