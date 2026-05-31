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

  const [activeTab, setActiveTab] = useState("info");
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

  // STATE ATRIBUSI
  const [attributionText, setAttributionText] = useState("");

  const [youtubeUrlId, setYoutubeUrlId] = useState("");
  const [youtubeUrlEn, setYoutubeUrlEn] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [statusBook, setStatusBook] = useState("review");

  const [bgMusic, setBgMusic] = useState(null);
  const [titleAudioId, setTitleAudioId] = useState(null);
  const [titleAudioEn, setTitleAudioEn] = useState(null);

  const [coverImageId, setCoverImageId] = useState(null);
  const [coverPreviewId, setCoverPreviewId] = useState(null);
  const [coverImageEn, setCoverImageEn] = useState(null);
  const [coverPreviewEn, setCoverPreviewEn] = useState(null);

  // STATE TAB 2: KELOLA SCENE
  const [scenes, setScenes] = useState([]);
  const [isSceneModalOpen, setIsSceneModalOpen] = useState(false);
  const [currentEditScene, setCurrentEditScene] = useState(null);
  const [sceneImagePreview, setSceneImagePreview] = useState(null);
  const [sceneImageFile, setSceneImageFile] = useState(null);
  const [sceneSubId, setSceneSubId] = useState("");
  const [sceneSubEn, setSceneSubEn] = useState("");
  const [sceneDubIdFile, setSceneDubIdFile] = useState(null);
  const [sceneDubEnFile, setSceneDubEnFile] = useState(null);
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

      // Mengambil data atribusi
      setAttributionText(bookData.attribution_text || "");

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

  const handleUpdateBookInfo = async (e) => {
    e.preventDefault();
    if (!titleId || !descriptionId || !categoryId) {
      return showError("Judul (ID), Deskripsi (ID), dan Kategori wajib diisi!");
    }

    showLoading(true);
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("title_id", titleId);
    formData.append("title_en", titleEn || "");
    formData.append("description_id", descriptionId);
    formData.append("description_en", descriptionEn || "");

    // Memasukkan atribusi ke Payload
    formData.append("attribution_text", attributionText || "");

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

  const handleOpenSceneModal = (scene = null) => {
    setCurrentEditScene(scene);
    if (scene) {
      setSceneImagePreview(getImageUrl(scene.image));
      setSceneSubId(scene.text_id || "");
      setSceneSubEn(scene.text_en || "");
    } else {
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
        await updateAdminBookPage(currentEditScene.id, formData, token);
        showSuccess(
          `Scene ${currentEditScene.page_number} berhasil diperbarui!`,
        );
      } else {
        await addAdminBookPage(id, formData, token);
        showSuccess("Halaman baru berhasil ditambahkan!");
      }
      handleCloseSceneModal();
      fetchBookData();
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
    <div className="p-8 md:p-12 w-full flex justify-center items-start min-h-screen bg-slate-50">
      <div className="bg-white w-full max-w-6xl rounded-[40px] shadow-sm border border-gray-200 p-8 md:p-10 relative">
        <button
          onClick={() => navigate("/admin/books")}
          className="absolute top-8 left-8 text-gray-400 hover:text-gray-800 font-bold text-sm cursor-pointer transition-colors"
        >
          ← Kembali
        </button>

        <div className="text-center mb-8 mt-6">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Update Buku: <span className="text-teal-600">{titleId}</span>
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Kelola informasi utama dan susunan halaman cerita di bawah ini.
          </p>
        </div>

        <div className="flex border-b border-gray-200 mb-10 justify-center gap-4">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-3 px-8 font-black text-sm border-b-4 transition-all cursor-pointer ${
              activeTab === "info"
                ? "border-yellow-400 text-yellow-600"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            Informasi Buku
          </button>
          <button
            onClick={() => setActiveTab("scenes")}
            className={`py-3 px-8 font-black text-sm border-b-4 transition-all cursor-pointer ${
              activeTab === "scenes"
                ? "border-yellow-400 text-yellow-600"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            Kelola Halaman ({scenes.length})
          </button>
        </div>

        {activeTab === "info" && (
          <form
            onSubmit={handleUpdateBookInfo}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* KOLOM UPLOAD SAMPUL */}
              <div className="w-full md:w-1/3 flex flex-col gap-6 items-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs font-black text-gray-700 mb-3 uppercase tracking-wider">
                    Sampul Indonesia
                  </span>
                  <label className="w-48 aspect-[5/8] border-4 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-colors relative overflow-hidden group bg-white shadow-sm">
                    {coverPreviewId ? (
                      <>
                        <img
                          src={coverPreviewId}
                          alt="Cover ID"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <HiOutlineUpload className="text-3xl text-white mb-2" />
                          <span className="text-white font-bold text-sm">
                            Ganti Sampul
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-center flex flex-col items-center gap-2">
                        <HiOutlineUpload className="text-3xl" />
                        <span className="font-bold text-sm">Upload ID</span>
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

                <div className="w-full flex flex-col items-center pt-6 border-t border-gray-200">
                  <span className="text-xs font-black text-gray-700 mb-3 uppercase tracking-wider">
                    Sampul English
                  </span>
                  <label className="w-48 aspect-[5/8] border-4 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors relative overflow-hidden group bg-white shadow-sm">
                    {coverPreviewEn ? (
                      <>
                        <img
                          src={coverPreviewEn}
                          alt="Cover EN"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <HiOutlineUpload className="text-3xl text-white mb-2" />
                          <span className="text-white font-bold text-sm">
                            Ganti Sampul
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-center flex flex-col items-center gap-2">
                        <HiOutlineUpload className="text-3xl" />
                        <span className="font-bold text-sm">Upload EN</span>
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

              {/* KOLOM FORM TEKS */}
              <div className="w-full md:w-2/3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2">
                      Judul Cerita (ID)
                    </label>
                    <input
                      type="text"
                      value={titleId}
                      onChange={(e) => setTitleId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-teal-400 focus:bg-white rounded-xl px-4 py-3.5 text-sm font-bold outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2">
                      Judul Cerita (EN){" "}
                      <span className="text-gray-400 font-normal ml-1">
                        (Opsional)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-teal-400 focus:bg-white rounded-xl px-4 py-3.5 text-sm font-bold outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2">
                      Deskripsi / Sinopsis (ID)
                    </label>
                    <textarea
                      value={descriptionId}
                      onChange={(e) => setDescriptionId(e.target.value)}
                      rows="4"
                      className="w-full bg-gray-50 border border-gray-200 focus:border-teal-400 focus:bg-white rounded-xl px-4 py-3.5 text-sm font-medium outline-none resize-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2">
                      Deskripsi / Sinopsis (EN){" "}
                      <span className="text-gray-400 font-normal ml-1">
                        (Opsional)
                      </span>
                    </label>
                    <textarea
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      rows="4"
                      className="w-full bg-gray-50 border border-gray-200 focus:border-teal-400 focus:bg-white rounded-xl px-4 py-3.5 text-sm font-medium outline-none resize-none transition-colors"
                    />
                  </div>
                </div>

                {/* FORM ATRIBUSI STORYWEAVER */}
                <div className="w-full bg-teal-50/50 p-5 border border-teal-100 rounded-2xl">
                  <label className="block text-sm font-black text-teal-800 mb-2">
                    Kredit & Atribusi Lisensi{" "}
                    <span className="text-teal-600/60 font-normal ml-1">
                      (Opsional)
                    </span>
                  </label>
                  <textarea
                    value={attributionText}
                    onChange={(e) => setAttributionText(e.target.value)}
                    rows="2"
                    placeholder="Contoh: Original story by Pratham Books. Licensed under CC BY 4.0."
                    className="w-full bg-white border border-teal-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm font-medium outline-none resize-y transition-colors"
                  />
                  <p className="text-[11px] font-bold text-teal-600/70 mt-2 leading-relaxed">
                    Jika cerita ini berasal dari platform domain publik (seperti
                    StoryWeaver), cantumkan informasi penulis, ilustrator, jenis
                    lisensi, dan link sumber di sini untuk mematuhi aturan hak
                    cipta.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2">
                      Kategori Cerita
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-teal-400 focus:bg-white rounded-xl px-4 py-3.5 text-sm font-bold outline-none cursor-pointer transition-colors"
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
                    <label className="block text-sm font-black text-gray-800 mb-2">
                      Status Penayangan
                    </label>
                    <select
                      value={statusBook}
                      onChange={(e) => setStatusBook(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-teal-400 focus:bg-white rounded-xl px-4 py-3.5 text-sm font-bold outline-none cursor-pointer transition-colors"
                    >
                      <option value="review">Review</option>
                      <option value="terbit">Terbit</option>
                      <option value="arsip">Arsip</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2">
                      Link YouTube (ID){" "}
                      <span className="text-gray-400 font-normal ml-1">
                        (Opsional)
                      </span>
                    </label>
                    <input
                      type="url"
                      value={youtubeUrlId}
                      onChange={(e) => setYoutubeUrlId(e.target.value)}
                      placeholder="https://youtu.be/..."
                      className="w-full bg-gray-50 border border-gray-200 focus:border-teal-400 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2">
                      Link YouTube (EN){" "}
                      <span className="text-gray-400 font-normal ml-1">
                        (Opsional)
                      </span>
                    </label>
                    <input
                      type="url"
                      value={youtubeUrlEn}
                      onChange={(e) => setYoutubeUrlEn(e.target.value)}
                      placeholder="https://youtu.be/..."
                      className="w-full bg-gray-50 border border-gray-200 focus:border-teal-400 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-purple-50/80 p-5 rounded-2xl border border-purple-100 space-y-5">
                  <div>
                    <label className="block text-xs font-black text-purple-900 mb-2">
                      Ubah Musik Latar (BGM)
                    </label>
                    <label className="w-full inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs px-4 py-3.5 rounded-xl cursor-pointer shadow-sm transition-colors">
                      <HiMusicNote className="text-base" />{" "}
                      {bgMusic
                        ? bgMusic.name
                        : existingBgMusic
                          ? "Audio BGM Tersimpan. Klik untuk Ganti."
                          : "Upload BGM"}
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => setBgMusic(e.target.files[0])}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-purple-200 pt-5">
                    <div>
                      <label className="block text-xs font-black text-purple-900 mb-2">
                        Voiceover Judul (ID)
                      </label>
                      <label className="w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-100 font-bold text-xs px-2 py-3 rounded-xl cursor-pointer transition-colors">
                        <HiMicrophone className="text-base shrink-0" />{" "}
                        <span className="truncate">
                          {titleAudioId
                            ? titleAudioId.name
                            : existingTitleAudioId
                              ? "Tersimpan (Ganti)"
                              : "Upload Audio"}
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
                      <label className="block text-xs font-black text-purple-900 mb-2">
                        Voiceover Judul (EN)
                      </label>
                      <label className="w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-100 font-bold text-xs px-2 py-3 rounded-xl cursor-pointer transition-colors">
                        <HiMicrophone className="text-base shrink-0" />{" "}
                        <span className="truncate">
                          {titleAudioEn
                            ? titleAudioEn.name
                            : existingTitleAudioEn
                              ? "Tersimpan (Ganti)"
                              : "Upload Audio"}
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

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="bg-orange-400 hover:bg-orange-500 text-white font-black py-4 px-12 rounded-2xl shadow-md transition-all cursor-pointer hover:-translate-y-1"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: KELOLA HALAMAN / SCENE */}
        {activeTab === "scenes" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">
                Susunan Halaman
              </h3>
              <button
                onClick={() => handleOpenSceneModal()}
                className="bg-teal-500 hover:bg-teal-600 text-white font-black py-3 px-6 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <HiPlus className="text-lg" /> Tambah Halaman
              </button>
            </div>

            {scenes.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-black mb-2 text-lg">
                  Buku ini belum memiliki isi cerita.
                </p>
                <p className="text-sm text-gray-400 font-medium">
                  Klik "Tambah Halaman" untuk memulai menyusun gambar dan teks
                  cerita.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenes.map((scene) => (
                  <div
                    key={scene.id}
                    className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all relative group flex flex-col"
                  >
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-black px-3 py-1.5 rounded-lg shadow-sm z-10 border border-gray-100">
                      Hal {scene.page_number}
                    </div>

                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-4 relative">
                      <img
                        src={getImageUrl(scene.image)}
                        alt={`Page ${scene.page_number}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <p className="text-xs font-black text-gray-500 mb-1">
                          Teks Tampil (ID):
                        </p>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                          {scene.text_id || (
                            <span className="italic text-gray-400 font-normal">
                              Kosong
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex gap-2">
                          <div
                            title={
                              scene.has_dubbing_id
                                ? "Audio ID Tersedia"
                                : "Audio ID Kosong"
                            }
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${scene.has_dubbing_id ? "bg-purple-100 border-purple-200 text-purple-700" : "bg-gray-50 border-gray-100 text-gray-400"}`}
                          >
                            <span className="text-[10px] font-black">ID</span>
                          </div>
                          <div
                            title={
                              scene.has_dubbing_en
                                ? "Audio EN Tersedia"
                                : "Audio EN Kosong"
                            }
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${scene.has_dubbing_en ? "bg-blue-100 border-blue-200 text-blue-700" : "bg-gray-50 border-gray-100 text-gray-400"}`}
                          >
                            <span className="text-[10px] font-black">EN</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenSceneModal(scene)}
                            className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center hover:bg-orange-500 hover:text-white cursor-pointer transition-colors"
                          >
                            <HiPencil />
                          </button>
                          <button
                            onClick={() => {
                              setSceneToDelete(scene);
                              setIsDeleteModalOpen(true);
                            }}
                            className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white cursor-pointer transition-colors"
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

      {isSceneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl p-6 md:p-10 custom-scrollbar border-4 border-gray-100">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h3 className="text-2xl font-black text-gray-900">
                {currentEditScene
                  ? `Edit Halaman ${currentEditScene.page_number}`
                  : "Tambah Halaman Baru"}
              </h3>
              <button
                onClick={handleCloseSceneModal}
                className="w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors cursor-pointer"
              >
                <HiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSaveScene} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 flex flex-col">
                  <label className="text-sm font-black text-gray-900 mb-3">
                    Ilustrasi Halaman
                  </label>
                  <label className="w-full aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden relative group border-4 border-dashed border-gray-200 cursor-pointer hover:border-teal-400 transition-colors">
                    {sceneImagePreview ? (
                      <img
                        src={sceneImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <HiOutlineUpload className="text-4xl mb-2 text-gray-300" />
                        <span className="text-sm font-bold">Pilih Gambar</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-sm">
                        Ganti Gambar
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
                    <p className="text-xs text-red-500 mt-2 font-bold text-center">
                      *Gambar Wajib Diisi
                    </p>
                  )}
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                  <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-black text-purple-900">
                        Konten Bahasa Indonesia
                      </label>
                      <label className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm">
                        <HiMicrophone className="text-base" />{" "}
                        {sceneDubIdFile
                          ? sceneDubIdFile.name
                          : currentEditScene?.has_dubbing_id
                            ? "Ganti Audio"
                            : "Upload Audio"}
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
                      placeholder="Ketik narasi teks di sini..."
                      className="w-full bg-white rounded-xl px-5 py-4 text-sm font-medium min-h-[100px] outline-none border border-gray-200 focus:border-purple-400 resize-y"
                    />
                  </div>

                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-black text-blue-900">
                        Konten Bahasa Inggris
                      </label>
                      <label className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm">
                        <HiMicrophone className="text-base" />{" "}
                        {sceneDubEnFile
                          ? sceneDubEnFile.name
                          : currentEditScene?.has_dubbing_en
                            ? "Ganti Audio"
                            : "Upload Audio"}
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
                      placeholder="Type the narrative text here..."
                      className="w-full bg-white rounded-xl px-5 py-4 text-sm font-medium min-h-[100px] outline-none border border-gray-200 focus:border-blue-400 resize-y"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseSceneModal}
                  className="px-8 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-3.5 rounded-2xl font-black shadow-md transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  {currentEditScene
                    ? "Simpan Perubahan Halaman"
                    : "Simpan Halaman Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteScene}
        title="Hapus Halaman?"
        description={`Halaman ${sceneToDelete?.page_number} akan dihapus secara permanen dari buku ini.`}
        warningText="Gambar, teks, dan audio pada halaman ini tidak dapat dikembalikan lagi."
        variant="danger"
        confirmText="Ya, Hapus Sekarang"
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #9CA3AF; }
      `}</style>
    </div>
  );
};

export default AdminEditBook;
