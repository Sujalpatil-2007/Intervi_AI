import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;