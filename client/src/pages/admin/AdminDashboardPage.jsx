import {
  Activity,
  ClipboardCheck,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { useAdminDashboard } from "../../hooks/queries/useAdminDashboard";
import AdminStatCard from "../../components/admin/AdminStatCard";

function AdminDashboardPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span>Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Something went wrong while loading admin data.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const dashboard = data?.data;

  const overview = dashboard?.overview || {};

  const recentActivity =
    dashboard?.recentActivity || {};

  const recentUsers =
    recentActivity.users || [];

  const recentInterviews =
    recentActivity.interviews || [];

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Admin Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Monitor and manage your InterviAI platform.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <AdminStatCard
            title="Total Users"
            value={overview.totalUsers ?? 0}
            description={`${overview.activeUsers ?? 0} new users in last 30 days`}
            icon={Users}
          />

          <AdminStatCard
            title="Total Resumes"
            value={overview.totalResumes ?? 0}
            description="Uploaded resumes"
            icon={FileText}
          />

          <AdminStatCard
            title="Total Interviews"
            value={overview.totalInterviews ?? 0}
            description={`${overview.completedInterviews ?? 0} completed`}
            icon={ClipboardCheck}
          />

          <AdminStatCard
            title="Average Score"
            value={`${overview.averageScore ?? 0}%`}
            description={`${overview.totalEvaluations ?? 0} evaluations`}
            icon={Trophy}
          />

        </div>

        {/* Activity */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Recent Users */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="font-bold text-slate-900">
                  Recent Users
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Latest registered users
                </p>
              </div>

              <Users
                size={20}
                className="text-slate-400"
              />
            </div>

            <div className="divide-y divide-slate-100">

              {recentUsers.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-slate-500">
                  No users found.
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user.fullName || "User"}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                      {user.role || "user"}
                    </span>
                  </div>
                ))
              )}

            </div>
          </div>

          {/* Recent Interviews */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="font-bold text-slate-900">
                  Recent Interviews
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Latest interview activity
                </p>
              </div>

              <Activity
                size={20}
                className="text-slate-400"
              />
            </div>

            <div className="divide-y divide-slate-100">

              {recentInterviews.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-slate-500">
                  No interviews found.
                </div>
              ) : (
                recentInterviews.map((interview) => (
                  <div
                    key={interview._id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {interview.targetRole || "Interview"}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {interview.user?.fullName ||
                          interview.user?.email ||
                          "Unknown user"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          interview.status === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : interview.status === "in_progress"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {interview.status?.replace(
                          "_",
                          " ",
                        ) || "unknown"}
                      </span>

                      {interview.status === "completed" && (
                        <p className="mt-1 text-xs font-semibold text-slate-600">
                          Score: {interview.score ?? 0}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboardPage;