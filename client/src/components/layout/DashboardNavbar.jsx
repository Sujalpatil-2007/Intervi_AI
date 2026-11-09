import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, User, ChevronDown, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { logoutUser } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

function DashboardNavbar({ onMenuClick }) {
  const navigate = useNavigate();

  const { user, clearUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-950 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-md p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={24} />
        </button>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
          Dashboard
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-yellow-400 dark:hover:bg-slate-700"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            aria-expanded={openMenu}
            className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:gap-3 sm:px-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-slate-800 dark:text-white">
                {user?.fullName}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email}
              </p>
            </div>

            <ChevronDown
              size={18}
              className="text-slate-600 dark:text-slate-300"
            />
          </button>

          <AnimatePresence>
            {openMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                <Link
                  to="/profile"
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <User size={18} />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;
