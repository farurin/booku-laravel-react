import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiMusicNote, HiMicrophone, HiOutlineUpload } from "react-icons/hi";
import { getCategories, createAdminBook } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useAdminToast } from "../../context/AdminToastContext";

const AdminAddBook = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showLoading } = useAdminToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [categoryList, setCategoryList] = useState([]);

  // Informasi Umum (Dwibahasa)
  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionId, setDescriptionId] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [youtubeUrlId, setYoutubeUrlId] = useState("");
  const [youtubeUrlEn, setYoutubeUrlEn] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [bgMusic, setBgMusic] = useState(null);
  const [titleAudioId, setTitleAudioId] = useState(null);
  const [titleAudioEn, setTitleAudioEn] = useState(null);

  // Sampul 2 bahasa
  const [coverImageId, setCoverImageId] = useState(null);
  const [coverPreviewId, setCoverPreviewId] = useState(null);

  const [coverImageEn, setCoverImageEn] = useState(null);
  const [coverPreviewEn, setCoverPreviewEn] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategoryList(res);
      } catch (err) {
        console.error("Gagal mengambil kategori:", err);
      }
    };
    fetchCats();
  }, []);

  const handleNextToStep2 = (e) => {
    e.preventDefault();
    if (!titleId || !descriptionId)
      return showError("Harap isi Judul (ID) dan Deskripsi (ID)!");
    setCurrentStep(2);
  };

  const handleNextToStep3 = () => {
    if (!categoryId) return showError("Harap pilih kategori!");
    setCurrentStep(3);
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

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

  const handleSubmitFinal = async (statusBook) => {
    // Validasi cover ID wajib ada, cover EN opsional (tapi disarankan)
    if (!coverImageId)
      return showError(
        "Harap unggah gambar sampul (thumbnail) versi Indonesia!",
      );

    showLoading(true);
    const formData = new FormData();
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

    if (bgMusic) formData.append("bg_music", bgMusic);
    if (titleAudioId) formData.append("title_audio_id", titleAudioId);
    if (titleAudioEn) formData.append("title_audio_en", titleAudioEn);

    try {
      const data = await createAdminBook(formData, token);
      showSuccess(data.message || "Draft Buku berhasil dibuat!");

      // REDIRECT OTOMATIS KE HALAMAN EDIT UNTUK KELOLA SCENE
      navigate(`/admin/books/${data.bookId}`);
    } catch (err) {
      showError("Terjadi kesalahan: " + err.message);
    } finally {
      showLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 w-full flex justify-center items-start min-h-screen">
      <div className="bg-white w-full max-w-5xl rounded-4xl shadow-sm border border-gray-100 p-8 md:p-12 mt-4 relative">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="absolute top-8 left-8 text-gray-400 hover:text-gray-800 font-semibold text-sm cursor-pointer"
          >
            ← Kembali
          </button>
        )}

        <div className="text-center mb-10 mt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {currentStep === 3 ? "Tambahkan Sampul" : "Informasi Buku"}
          </h2>
          <p className="text-sm font-medium text-gray-400 max-w-lg mx-auto">
            {currentStep === 3
              ? "Tambahkan sampul atau thumbnail dengan ukuran 1600 x 2560 px atau 5:8."
              : "Lengkapi informasi dasar buku. Anda akan menambahkan halaman (scene) di tahap selanjutnya."}
          </p>
        </div>

        {currentStep === 1 && (
          <form
            onSubmit={handleNextToStep2}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Judul Cerita (ID)
                </label>
                <input
                  type="text"
                  value={titleId}
                  onChange={(e) => setTitleId(e.target.value)}
                  placeholder="Judul Konten..."
                  className="w-full bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-yellow-400 rounded-xl px-5 py-4 text-sm font-medium outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Judul Cerita (EN){" "}
                  <span className="text-gray-400 font-normal ml-1">
                    (Opsional)
                  </span>
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Story Title..."
                  className="w-full bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-yellow-400 rounded-xl px-5 py-4 text-sm font-medium outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Deskripsi Cerita (ID)
                </label>
                <textarea
                  value={descriptionId}
                  onChange={(e) => setDescriptionId(e.target.value)}
                  placeholder="Deskripsi Konten..."
                  rows="6"
                  className="w-full bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-yellow-400 rounded-xl px-5 py-4 text-sm font-medium outline-none resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Deskripsi Cerita (EN){" "}
                  <span className="text-gray-400 font-normal ml-1">
                    (Opsional)
                  </span>
                </label>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Story Description..."
                  rows="6"
                  className="w-full bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-yellow-400 rounded-xl px-5 py-4 text-sm font-medium outline-none resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Link Video YouTube (ID){" "}
                  <span className="text-gray-400 font-normal ml-1">
                    (Opsional)
                  </span>
                </label>
                <input
                  type="url"
                  value={youtubeUrlId}
                  onChange={(e) => setYoutubeUrlId(e.target.value)}
                  placeholder="https://youtu.be/..."
                  className="w-full bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-yellow-400 rounded-xl px-5 py-4 text-sm font-medium outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Link Video YouTube (EN){" "}
                  <span className="text-gray-400 font-normal ml-1">
                    (Opsional)
                  </span>
                </label>
                <input
                  type="url"
                  value={youtubeUrlEn}
                  onChange={(e) => setYoutubeUrlEn(e.target.value)}
                  placeholder="https://youtu.be/..."
                  className="w-full bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-yellow-400 rounded-xl px-5 py-4 text-sm font-medium outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-sm mt-4 cursor-pointer transition-colors"
            >
              Selanjutnya
            </button>
          </form>
        )}

        {currentStep === 2 && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Pilih Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#F3F4F6] rounded-xl px-5 py-4 text-sm font-medium text-gray-500 outline-none"
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
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Tambahkan Musik Latar
                </label>
                <label className="w-full inline-flex items-center justify-center gap-2 bg-[#F64C4C] hover:bg-red-600 text-white font-semibold text-sm px-6 py-4 rounded-xl cursor-pointer transition-colors">
                  <HiMusicNote className="text-lg" />{" "}
                  {bgMusic ? bgMusic.name : "Upload Musik (Opsional)"}
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setBgMusic(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Suara Judul Cerita (ID)
                </label>
                <label className="w-full inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm px-6 py-4 rounded-xl cursor-pointer transition-colors">
                  <HiMicrophone className="text-lg" />{" "}
                  {titleAudioId ? titleAudioId.name : "Upload Audio (Opsional)"}
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setTitleAudioId(e.target.files[0])}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Suara Judul Cerita (EN)
                </label>
                <label className="w-full inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-6 py-4 rounded-xl cursor-pointer transition-colors">
                  <HiMicrophone className="text-lg" />{" "}
                  {titleAudioEn ? titleAudioEn.name : "Upload Audio (Opsional)"}
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setTitleAudioEn(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <button
              onClick={handleNextToStep3}
              className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-sm mt-8 cursor-pointer transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col items-center max-w-4xl mx-auto">
            {/* Container 2 Cover */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 justify-center w-full">
              {/* Box Cover Indonesia */}
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-gray-900 mb-3">
                  Sampul Indonesia
                </span>
                <label className="w-48 md:w-56 aspect-5/8 border-[3px] border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-colors relative overflow-hidden group">
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
                    <div className="flex flex-col items-center text-center p-4 text-gray-400 group-hover:text-orange-500 transition-colors">
                      <HiOutlineUpload className="text-4xl mb-3" />
                      <span className="text-sm font-bold text-gray-600 group-hover:text-orange-600 mb-1">
                        Upload ID
                      </span>
                      <span className="text-[10px] font-medium">
                        PNG, JPG maks 2MB
                      </span>
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

              {/* Box Cover English */}
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-gray-900 mb-3">
                  Sampul English
                </span>
                <label className="w-48 md:w-56 aspect-5/8 border-[3px] border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors relative overflow-hidden group">
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
                    <div className="flex flex-col items-center text-center p-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                      <HiOutlineUpload className="text-4xl mb-3" />
                      <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600 mb-1">
                        Upload EN
                      </span>
                      <span className="text-[10px] font-medium">Opsional</span>
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

            {/* Tombol Simpan (Tetap Sama) */}
            <div className="w-full max-w-lg flex flex-col gap-3">
              <button
                onClick={() => handleSubmitFinal("review")}
                className="w-full bg-[#F8AF2F] hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-sm cursor-pointer transition-colors"
              >
                Simpan & Kelola Scene
              </button>
              <button
                onClick={() => handleSubmitFinal("arsip")}
                className="w-full bg-[#D1D5DB] hover:bg-gray-400 text-gray-700 font-bold py-4 rounded-xl shadow-sm cursor-pointer transition-colors"
              >
                Simpan Draft ke Arsip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAddBook;
