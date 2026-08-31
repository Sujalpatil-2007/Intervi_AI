import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>

          <div className="ml-3">
            <p className="text-sm font-bold text-slate-900">InterviAI</p>

            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </header>

        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
