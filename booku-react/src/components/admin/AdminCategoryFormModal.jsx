import React, { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { createCategory, updateCategory } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useAdminToast } from "../../context/AdminToastContext";

const AdminCategoryFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  targetCategory,
}) => {
  const { token } = useAuth();
  const { showSuccess, showError, showLoading } = useAdminToast();

  const isEditMode = !!targetCategory;

  const [nameId, setNameId] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionId, setDescriptionId] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [colorHex, setColorHex] = useState("#6B4EFF");

  const [imageIcon, setImageIcon] = useState(null);
  const [imageBanner, setImageBanner] = useState(null);
  const [imageCard, setImageCard] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setNameId(targetCategory.name_id || "");
        setNameEn(targetCategory.name_en || "");
        setDescriptionId(targetCategory.description_id || "");
        setDescriptionEn(targetCategory.description_en || "");
        setColorHex(targetCategory.color_hex || "#6B4EFF");
      } else {
        setNameId("");
        setNameEn("");
        setDescriptionId("");
        setDescriptionEn("");
        setColorHex("#6B4EFF");
      }
      setImageIcon(null);
      setImageBanner(null);
      setImageCard(null);
    }
  }, [isOpen, targetCategory, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameId || !descriptionId)
      return showError("Nama dan Deskripsi (Indonesia) wajib diisi!");

    showLoading(true);
    try {
      const formData = new FormData();

      if (isEditMode) {
        formData.append("_method", "PUT");
      }

      formData.append("name_id", nameId);
      formData.append("name_en", nameEn);
      formData.append("description_id", descriptionId);
      formData.append("description_en", descriptionEn);
      formData.append("color_hex", colorHex);

      if (!isEditMode) formData.append("status", "active");

      if (imageIcon) formData.append("image_icon", imageIcon);
      if (imageBanner) formData.append("image_banner", imageBanner);
      if (imageCard) formData.append("image_card", imageCard);

      if (isEditMode) {
        await updateCategory(targetCategory.id, formData, token);
        showSuccess("Kategori berhasil diperbarui!");
      } else {
        await createCategory(formData, token);
        showSuccess("Kategori baru berhasil ditambahkan!");
      }

      onSuccess();
      onClose();
    } catch (err) {
      showError(err.message);
    } finally {
      showLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white w-full max-w-150 rounded-3xl p-6 md:p-8 relative max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between mb-6 sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit Kategori" : "Tambah Kategori"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <HiX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
            <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
              <span className="text-lg">🇮🇩</span> Versi Indonesia (Wajib)
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={nameId}
                  onChange={(e) => setNameId(e.target.value)}
                  className="flex-1 border border-blue-200 bg-white rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  placeholder="Nama Kategori (Contoh: Dongeng)"
                  required
                />
                <div
                  className="flex flex-col items-center justify-center gap-1 border border-blue-200 rounded-xl px-3 bg-white hover:bg-gray-50 transition-colors shrink-0"
                  title="Warna Tema Kategori"
                >
                  <span className="text-[10px] font-bold text-gray-500 leading-none mt-1">
                    Warna
                  </span>
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-6 h-6 rounded border-none cursor-pointer bg-transparent"
                  />
                </div>
              </div>
              <textarea
                value={descriptionId}
                onChange={(e) => setDescriptionId(e.target.value)}
                className="w-full border border-blue-200 bg-white rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none h-20"
                placeholder="Deskripsi Singkat"
                required
              />
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
            <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
              <span className="text-lg">🇬🇧</span> Versi Inggris (Opsional)
            </h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full border border-red-200 bg-white rounded-xl p-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors"
                placeholder="Category Name (e.g: Fairy Tales)"
              />
              <textarea
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full border border-red-200 bg-white rounded-xl p-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors resize-none h-20"
                placeholder="Short Description"
              />
            </div>
          </div>

          {/* Penjelasan Resource Gambar yang lebih jelas */}
          <div className="flex flex-col gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-0.5">
                Gambar Slider (Beranda & Kategori)
              </label>
              <p className="text-[10px] text-gray-400 mb-2">
                Tampil dalam bentuk slider (carousel) mendatar. Rekomendasi:
                Landscape memanjang.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageIcon(e.target.files[0])}
                className="text-sm w-full text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 cursor-pointer transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-0.5">
                Gambar Banner Vertikal (Beranda)
              </label>
              <p className="text-[10px] text-gray-400 mb-2">
                Tampil statis di sebelah kiri list buku. Rekomendasi: Potrait
                memanjang ke bawah.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageBanner(e.target.files[0])}
                className="text-sm w-full text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 cursor-pointer transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-0.5">
                Gambar Grid (Halaman Semua Kategori)
              </label>
              <p className="text-[10px] text-gray-400 mb-2">
                Tampil di halaman /categories berupa kotak-kotak besar.
                Rekomendasi: Landscape proporsional.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageCard(e.target.files[0])}
                className="text-sm w-full text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 cursor-pointer transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#F8AF2F] text-white font-bold rounded-xl hover:bg-yellow-500 shadow-sm transition-colors cursor-pointer"
            >
              {isEditMode ? "Simpan Update" : "Tambah Kategori"}
            </button>
          </div>
        </form>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `.animate-fade-in { animation: fadeIn 0.2s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }`,
        }}
      />
    </div>
  );
};

export default AdminCategoryFormModal;
