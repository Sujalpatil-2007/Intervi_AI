import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { logoutUser } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";

function DashboardNavbar({ onMenuClick }) {
  const navigate = useNavigate();

  const { user, clearUser } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);

  async function handleLogout() {
    try {
      await logoutUser();

      clearUser();

      toast.success("Logged out successfully.");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to logout.");
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={24} />
        </button>

        <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
      </div>

      {/* Right */}
      <div className="relative">
        <button
          onClick={() => setOpenMenu((prev) => !prev)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-medium text-slate-800">
              {user?.fullName}
            </p>

            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          <ChevronDown size={18} />
        </button>

        <AnimatePresence>
          {openMenu && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.2,
              }}
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-xl"
            >
              <Link
                to="/profile"
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100"
              >
                <User size={18} />
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default DashboardNavbar;
