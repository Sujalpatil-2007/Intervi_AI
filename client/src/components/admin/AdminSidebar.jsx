import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  ScrollText,
  ArrowLeft,
  Shield,
  X,
} from "lucide-react";
import clsx from "clsx";

const navigation = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Resumes",
    path: "/admin/resumes",
    icon: FileText,
  },
  {
    name: "Interviews",
    path: "/admin/interviews",
    icon: ClipboardCheck,
  },
  {
    name: "Admin Logs",
    path: "/admin/logs",
    icon: ScrollText,
  },
];

function AdminSidebar({ isOpen, onClose }) {
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
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-950 text-white transition-transform duration-300",
          "lg:translate-x-0",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          },
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <Shield size={22} className="text-blue-500" />

              <h1 className="text-xl font-bold text-white">InterviAI</h1>
            </div>

            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
              Admin Panel
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Management
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white",
                  )
                }
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Back to Application */}
        <div className="border-t border-slate-800 p-4">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
          >
            <ArrowLeft size={19} />

            <span>Back to App</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-5 py-4">
          <p className="text-center text-xs text-slate-600">
            InterviAI Admin © 2026
          </p>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
