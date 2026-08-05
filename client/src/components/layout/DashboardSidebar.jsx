import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Upload,
  MessagesSquare,
  History,
  Trophy,
  User,
  X,
} from "lucide-react";
import clsx from "clsx";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Upload Resume",
    path: "/resume/upload",
    icon: Upload,
  },
  {
    name: "My Resume",
    path: "/resume",
    icon: FileText,
  },
  {
    name: "Generate Interview",
    path: "/interview/generate",
    icon: MessagesSquare,
  },
  {
    name: "Interview History",
    path: "/interview",
    icon: History,
  },
  {
    name: "Leaderboard",
    path: "/leaderboard",
    icon: Trophy,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

function DashboardSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-900 text-white transition-transform duration-300 lg:translate-x-0",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          },
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-blue-500">InterviAI</h1>

            <p className="text-sm text-slate-400">AI Mock Interview</p>
          </div>

          <button onClick={onClose} className="lg:hidden">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-lg px-4 py-3 transition-all",
                    {
                      "bg-blue-600 text-white": isActive,

                      "text-slate-300 hover:bg-slate-800": !isActive,
                    },
                  )
                }
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-5">
          <p className="text-center text-sm text-slate-500">© 2026 InterviAI</p>
        </div>
      </aside>
    </>
  );
}

export default DashboardSidebar;
