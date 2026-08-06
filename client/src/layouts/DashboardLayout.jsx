import { useState } from "react";
import { Outlet } from "react-router-dom";

import DashboardNavbar from "../components/layout/DashboardNavbar";
import DashboardSidebar from "../components/layout/DashboardSidebar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="lg:ml-72">
        <DashboardNavbar onMenuClick={openSidebar} />

        <main className="min-h-[calc(100vh-64px)] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
