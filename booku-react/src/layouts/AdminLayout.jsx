import { Outlet } from "react-router-dom";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin />
      <main className="flex-1 min-w-0 overflow-y-auto bg-[#ece7fd]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
