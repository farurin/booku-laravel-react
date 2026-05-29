import React, { useState, useEffect } from "react";
import {
  HiOutlineSearch,
  HiCloudDownload,
  HiOutlineExternalLink,
  HiChevronDown,
} from "react-icons/hi";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAuth } from "../../context/AuthContext";
import { getAdminBooks, getAdminUsers } from "../../services/api";
import { useAdminToast } from "../../context/AdminToastContext";

const AdminBackupExport = () => {
  const { token } = useAuth();
  const { showError, showSuccess } = useAdminToast();

  const [activeTab, setActiveTab] = useState("Data Buku");
  const [searchQuery, setSearchQuery] = useState("");

  const [dateFilter, setDateFilter] = useState("Bulan ini");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filterOptions = [
    "Hari ini",
    "Minggu ini",
    "Bulan ini",
    "Tahun ini",
    "Pilih Rentang Waktu...",
  ];

  const [booksData, setBooksData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const books = await getAdminBooks(token);

        // PERBAIKAN 1: Sesuaikan dengan struktur API dwibahasa yang baru
        const formattedBooks = books.map((b) => ({
          id: b.id,
          title: b.title_id || "Tanpa Judul", // Mengutamakan title_id
          category: b.category_name_id || "Tanpa Kategori",
          views: `${b.views_count} kali`,
          status: b.status === "terbit" ? "Aktif" : "Non Aktif",
          date: new Date(b.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));
        setBooksData(formattedBooks);

        const users = await getAdminUsers(token);
        const normalUsers = users.filter((u) => u.role === "user");

        const formattedUsers = normalUsers.map((u) => ({
          id: `0${u.id}`.slice(-2),
          name: u.name,
          avatar: u.avatar,
          email: u.email,
          // PERBAIKAN 2: Mengambil data read_count dinamis dari Backend
          readCount: `${u.read_count || 0} Buku`,
          status: u.status === "active" ? "Aktif" : "Non Aktif",
          date: new Date(u.created_at || new Date()).toLocaleDateString(
            "id-ID",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            },
          ),
        }));

        setUsersData(formattedUsers);
      } catch (err) {
        showError("Gagal mengambil data: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchData();
  }, [token, showError]);

  const filteredBooks = booksData.filter((b) =>
    (b.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredUsers = usersData.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleExportCSV = () => {
    const dataToExport =
      activeTab === "Data Buku" ? filteredBooks : filteredUsers;

    if (dataToExport.length === 0) {
      return showError("Tidak ada data yang bisa diekspor.");
    }

    const headers = Object.keys(dataToExport[0]).filter(
      (key) => key !== "avatar",
    ); // Sembunyikan URL avatar di CSV
    const csvRows = dataToExport.map((row) => {
      return headers
        .map((fieldName) => {
          return JSON.stringify(row[fieldName] || "");
        })
        .join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Export_${activeTab.replace(" ", "_")}_${dateFilter}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess("File CSV berhasil diunduh!");
  };

  const renderStatus = (status) => {
    const isActive = status === "Aktif";
    return (
      <div
        className={`flex items-center gap-2 font-bold ${isActive ? "text-green-600" : "text-red-500"}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${isActive ? "bg-green-600" : "bg-red-500"}`}
        ></span>
        {status}
      </div>
    );
  };

  return (
    <div className="p-8 md:p-12 w-full min-h-screen flex justify-center items-start">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 bg-white rounded-[20px] shadow-sm border border-gray-100 flex items-center px-5 py-4">
            <HiOutlineSearch className="text-gray-400 text-xl mr-3" />
            <input
              type="text"
              placeholder={
                activeTab === "Data Buku" ? "Search Buku" : "Search Pengguna"
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="relative w-full md:w-56 shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white rounded-[20px] shadow-sm border border-gray-100 px-5 py-4 flex items-center justify-between text-sm font-bold text-orange-500 cursor-pointer hover:border-orange-200 transition-colors"
            >
              {dateFilter}
              <HiChevronDown
                className={`text-lg transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-[20px] overflow-hidden z-20 animate-fade-in">
                {filterOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      setDateFilter(opt);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-5 py-3.5 text-sm font-bold cursor-pointer transition-colors ${
                      dateFilter === opt
                        ? "bg-orange-50 text-orange-500"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6 border-b border-gray-200 pb-4">
          <div className="flex gap-8 px-2">
            {["Data Buku", "Data Pengguna"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery("");
                }}
                className={`text-xl font-black pb-4 -mb-4.5 transition-all border-b-4 cursor-pointer ${
                  activeTab === tab
                    ? "text-orange-500 border-orange-500"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* PERBAIKAN 3: Tombol Backup di-disable dengan tooltip khusus */}
            <div className="relative group flex-1 md:flex-none">
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border-2 border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed transition-colors"
              >
                <HiCloudDownload className="text-lg" /> Backup data
              </button>
              {/* Tooltip Segera Hadir */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                Segera Hadir
                {/* Segitiga panah kecil di bawah tooltip */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#F8AF2F] hover:bg-yellow-500 text-white transition-colors shadow-sm cursor-pointer"
            >
              <HiOutlineExternalLink className="text-lg" /> Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto min-h-100">
          <table className="w-full text-left min-w-200">
            {activeTab === "Data Buku" && (
              <>
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      ID
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Judul Buku
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Kategori
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Total Dibaca
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Status
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Tanggal Tambah
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-10 text-center font-bold text-gray-400"
                      >
                        Memuat Data...
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors cursor-default"
                      >
                        <td className="py-4 px-6 text-sm font-bold text-gray-600">
                          {book.id}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-800">
                          {book.title}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-600">
                          {book.category}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-600">
                          {book.views}
                        </td>
                        <td className="py-4 px-6">
                          {renderStatus(book.status)}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-600">
                          {book.date}
                        </td>
                      </tr>
                    ))
                  )}
                  {!isLoading && filteredBooks.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-10 text-center text-gray-400 font-bold"
                      >
                        Data buku tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </>
            )}

            {activeTab === "Data Pengguna" && (
              <>
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      ID
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Nama
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Email
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Buku Dibaca
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Status
                    </th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-800">
                      Tanggal Daftar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors cursor-default"
                    >
                      <td className="py-4 px-6 text-sm font-bold text-gray-600">
                        {user.id}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-800">
                        {user.name}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-600 flex items-center gap-3">
                        <img
                          src={
                            user.avatar
                              ? getImageUrl(user.avatar)
                              : `https://ui-avatars.com/api/?name=${user.name}`
                          }
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover bg-gray-200"
                          onError={(e) =>
                            (e.target.src = `https://ui-avatars.com/api/?name=${user.name}`)
                          }
                        />
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-600">
                        {user.readCount}
                      </td>
                      <td className="py-4 px-6">{renderStatus(user.status)}</td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-600">
                        {user.date}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-10 text-center text-gray-400 font-bold"
                      >
                        Data pengguna tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .animate-fade-in { animation: fadeIn 0.2s ease-out; transform-origin: top; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px) scaleY(0.9); } to { opacity: 1; transform: translateY(0) scaleY(1); } }
      `,
        }}
      />
    </div>
  );
};

export default AdminBackupExport;
