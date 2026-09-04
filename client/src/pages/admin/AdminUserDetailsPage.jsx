import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  FileText,
  ClipboardCheck,
  CheckCircle,
  Clock,
  Activity,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useAdminUser } from "../../hooks/queries/useAdminUser";

function AdminUserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useAdminUser(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={24} className="animate-spin" />
          <span>Loading user...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle size={24} />
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load user
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't retrieve this user's information.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const user = data?.data?.user;
  const stats = data?.data?.stats;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">User Not Found</h2>

          <p className="mt-2 text-sm text-slate-500">
            The requested user does not exist.
          </p>

          <Link
            to="/admin/users"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const initials =
    user.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back */}

        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Users
        </Link>

        {/* Header */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-slate-900 to-slate-800 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                {/* Avatar */}

                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-lg">
                  {initials}
                </div>

                {/* User Info */}

                <div className="min-w-0 text-white">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold">
                      {user.fullName || "Unnamed User"}
                    </h1>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </div>

                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                    <Mail size={15} />
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Account Status */}

              <div>
                {user.isBlocked ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Blocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* User Information */}

          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Basic information and account status.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCard
                icon={User}
                label="Full Name"
                value={user.fullName || "Not available"}
              />

              <InfoCard
                icon={Mail}
                label="Email"
                value={user.email || "Not available"}
              />

              <InfoCard
                icon={Shield}
                label="Role"
                value={user.role || "user"}
                capitalize
              />

              <InfoCard
                icon={Calendar}
                label="Member Since"
                value={createdDate}
              />

              <InfoCard
                icon={Activity}
                label="Account Status"
                value={user.isBlocked ? "Blocked" : "Active"}
              />

              <InfoCard
                icon={CheckCircle}
                label="Email Verified"
                value={user.isVerified ? "Verified" : "Not Verified"}
              />
            </div>
          </div>
        </div>

        {/* Statistics */}

        <div className="mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">User Activity</h2>

            <p className="mt-1 text-sm text-slate-500">
              Interview and resume activity for this user.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={FileText}
              label="Resumes"
              value={stats?.resumeCount ?? 0}
              iconClass="bg-blue-50 text-blue-600"
            />

            <StatCard
              icon={ClipboardCheck}
              label="Total Interviews"
              value={stats?.interviewCount ?? 0}
              iconClass="bg-indigo-50 text-indigo-600"
            />

            <StatCard
              icon={CheckCircle}
              label="Completed"
              value={stats?.completedInterviews ?? 0}
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              icon={Star}
              label="Average Score"
              value={stats?.averageScore ?? 0}
              suffix="/100"
              iconClass="bg-amber-50 text-amber-600"
            />
          </div>
        </div>

        {/* Interview Status */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Interview Breakdown
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current interview status distribution.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ActivityCard
              icon={Clock}
              label="Pending"
              value={stats?.pendingInterviews ?? 0}
              className="bg-amber-50 text-amber-600"
            />

            <ActivityCard
              icon={Activity}
              label="In Progress"
              value={stats?.inProgressInterviews ?? 0}
              className="bg-blue-50 text-blue-600"
            />

            <ActivityCard
              icon={CheckCircle}
              label="Completed"
              value={stats?.completedInterviews ?? 0}
              className="bg-emerald-50 text-emerald-600"
            />
          </div>
        </div>

        {/* Evaluation */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Star size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">Evaluation Summary</h2>

              <p className="text-sm text-slate-500">
                AI interview evaluation statistics.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Evaluations Completed</p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stats?.evaluationCount ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Average Interview Score</p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stats?.averageScore ?? 0}
                <span className="ml-1 text-base font-medium text-slate-400">
                  /100
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, capitalize = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p
            className={`mt-1 truncate font-semibold text-slate-900 ${
              capitalize ? "capitalize" : ""
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, suffix = "", iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
            {suffix && (
              <span className="ml-1 text-sm font-medium text-slate-400">
                {suffix}
              </span>
            )}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ icon: Icon, label, value, className }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div>
        <p className="text-sm text-slate-500">{label}</p>

        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      </div>

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${className}`}
      >
        <Icon size={21} />
      </div>
    </div>
  );
}

export default AdminUserDetailsPage;
