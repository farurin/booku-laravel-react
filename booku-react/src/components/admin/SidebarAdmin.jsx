import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  HiChartPie,
  HiBookOpen,
  HiLibrary,
  HiTag,
  HiDatabase,
  HiCog,
  HiUsers,
  HiArrowSmLeft,
} from "react-icons/hi";

// Import logo diganti menjadi Storyland
import logoStoryland from "../../assets/logo-storyland.png";
import { useAuth } from "../../context/AuthContext";

// menu & role yang diizinkan untuk mengaksesnya
const allNavItems = [
  {
    to: "/admin/dashboard",
    icon: HiChartPie,
    label: "Dashboard",
    allowedRoles: ["super_admin", "admin", "editor"],
  },
  {
    to: "/admin/users",
    icon: HiUsers,
    label: "Manajemen Pengguna",
    allowedRoles: ["super_admin"],
  },
  {
    to: "/admin/books",
    icon: HiBookOpen,
    label: "Manajemen Buku",
    allowedRoles: ["super_admin", "admin", "editor"],
  },
  {
    to: "/admin/perpustakaan",
    icon: HiLibrary,
    label: "Perpustakaan",
    allowedRoles: ["super_admin", "admin", "editor"],
  },
  {
    to: "/admin/categories",
    icon: HiTag,
    label: "Kategori & Tag",
    allowedRoles: ["super_admin", "admin"],
  },
  {
    to: "/admin/backup",
    icon: HiDatabase,
    label: "Backup & Ekspor data",
    allowedRoles: ["super_admin", "admin"],
  },
];

export default function SidebarAdmin() {
  const { user } = useAuth();

  // Ambil role user saat ini (fallback ke 'editor' jika undefined agar aman)
  const currentRole = user?.role || "editor";

  // Filter menu berdasarkan role
  const filteredNavItems = allNavItems.filter((item) =>
    item.allowedRoles.includes(currentRole),
  );

  return (
    // Background diubah menjadi ungu gelap (#2D1B4E)
    <aside className="flex flex-col w-56 min-h-screen bg-[#2D1B4E] border-r border-[#2D1B4E] shrink-0 sticky top-0">
      {/* Logo difungsikan sebagai link kembali ke Halaman Publik */}
      <Link
        to="/"
        className="px-4 py-5 border-b border-white/10 flex flex-col items-center justify-center group hover:bg-white/5 transition-colors cursor-pointer"
        title="Kembali ke Halaman User"
      >
        <img src={logoStoryland} alt="Logo Storyland" className="w-40" />
        <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-gray-400 group-hover:text-purple-300 transition-colors">
          <HiArrowSmLeft className="text-sm" /> Lihat Web
        </div>
      </Link>

      {/* Tambah Cerita Baru */}
      <div className="px-4 pt-5 pb-2">
        <NavLink
          to="/admin/tambah"
          className="flex items-center justify-center gap-3 bg-[#fcebfe] border-[#8c4cf3] rounded-xl px-3 py-3 hover:bg-amber-100 transition-colors shadow-sm"
        >
          <span className="flex items-center justify-center w-6 h-6 bg-[#8c4cf3] rounded-md text-[#fcebfe] text-lg font-black leading-none">
            +
          </span>
          <span className="text-sm font-black text-[#8c4cf3] leading-tight">
            Tambah Cerita Baru
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 flex flex-col gap-1">
        {filteredNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-5 py-3 text-sm font-semibold border-l-4 transition-all",
                isActive
                  ? "bg-white/10 text-[#ff4c9f] border-[#ff4c9f] font-black" // Warna active disesuaikan untuk background gelap
                  : "text-purple-200 border-transparent hover:bg-white/5 hover:text-white", // Warna inactive disesuaikan
              ].join(" ")
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Profile Setting tampil untuk semua role admin */}
      <div className="border-t border-white/10 py-3">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            [
              "flex items-center gap-3 px-5 py-3 text-sm font-semibold border-l-4 transition-all",
              isActive
                ? "bg-white/10 text-orange-400 border-orange-400 font-black"
                : "text-purple-200 border-transparent hover:bg-white/5 hover:text-white",
            ].join(" ")
          }
        >
          <HiCog className="w-5 h-5 shrink-0" />
          Profile Settings
        </NavLink>
      </div>
    </aside>
  );
}
