import fallbackImage from "../assets/lovecat.png";

// Ambil URL API dari env (misal: "https://joyleap.net/magang/luthfiyana/storyland/public/api")
const API_URL = import.meta.env.VITE_API_URL || "";

// Buang kata "/api" di paling belakang untuk mendapatkan Base URL folder public Laravel
const BASE_ASSET_URL = API_URL.replace(/\/api\/?$/, "/");

export const getImageUrl = (imagePath) => {
  // 1. Fallback jika data kosong dari database, kembalikan gambar default
  if (!imagePath) return fallbackImage;

  // 2. Jika imagePath sudah berupa URL penuh (http/https), langsung return aslinya
  if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
    return imagePath.replace(/&/g, "%26");
  }

  // 3. Jika imagePath berupa path folder lokal Laravel (misal: "uploads/books/..."),
  // maka gabungkan dengan BASE_ASSET_URL

  // Hapus garis miring di awal (jika ada) agar tidak double slash
  const cleanPath = imagePath.replace(/^\//, "");

  const finalUrl = `${BASE_ASSET_URL}${cleanPath}`;

  // Pastikan URL aman dari karakter '&'
  return finalUrl.replace(/&/g, "%26");
};
