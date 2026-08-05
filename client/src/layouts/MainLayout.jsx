import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}

      <main>
        <Outlet />
      </main>

      {/* Footer */}
    </div>
  );
}

export default MainLayout;
