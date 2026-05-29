import { Outlet } from "react-router-dom";
import Navigation from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-booku-cream text-slate-900">
      <Navigation />

      {/* Menambahkan flex-1 agar jika konten sedikit, 
        footer tetap terdorong ke bawah 
      */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
