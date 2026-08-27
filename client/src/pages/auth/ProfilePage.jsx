import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Pencil,
  Save,
  X,
  LogOut,
  FileText,
  Trophy,
  ClipboardCheck,
  Loader2,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import { useLogout } from "../../hooks/mutations/useLogout";
import { useUpdateProfile } from "../../hooks/mutations/useUpdateProfile";
import { useInterviewActivity } from "../../hooks/queries/useInterviewActivity";

function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();

  const {
    data: interviewData,
    isLoading: isActivityLoading,
    isError: isActivityError,
    refetch: refetchActivity,
  } = useInterviewActivity();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  /*
   * Sync profile form with authenticated user.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
    });
  }, [user]);

  /*
   * Normalize interview activity response.
   */
  const interviews =
    interviewData?.data?.interviews || interviewData?.data || [];

  /*
   * Completed interviews.
   */
  const completedInterviews = interviews.filter(
    (interview) => interview.status === "completed",
  );

  /*
   * Best score.
   */
  const bestScore = completedInterviews.length
    ? Math.max(...completedInterviews.map((interview) => interview.score || 0))
    : 0;

  /*
   * Total interviews.
   */
  const totalInterviews = interviews.length;

  /*
   * Handle input changes.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * Cancel editing.
   */
  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });

    setIsEditing(false);
  };

  /*
   * Save profile.
   */
  const handleSave = (event) => {
    event.preventDefault();

    const name = formData.name.trim();

    if (!name) {
      return;
    }

    updateProfileMutation.mutate(
      {
        name,
      },
      {
        onSuccess: async () => {
          setIsEditing(false);

          if (refreshUser) {
            await refreshUser();
          }
        },
      },
    );
  };

  /*
   * Format member date.
   */
  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  /*
   * Generate initials.
   */
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  /*
   * Format interview date.
   */
  const formatInterviewDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /*
   * Get status UI.
   */
  const getStatusDetails = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          icon: CheckCircle2,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };

      case "in_progress":
        return {
          label: "In Progress",
          icon: Clock3,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "cancelled":
        return {
          label: "Cancelled",
          icon: XCircle,
          className: "bg-red-50 text-red-700 border-red-200",
        };

      case "pending":
      default:
        return {
          label: "Pending",
          icon: Clock3,
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
    }
  };

  /*
   * Loading profile.
   */
  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={22} className="animate-spin" />

          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Manage your account information and view your InterviAI activity.
          </p>
        </div>

        {/* =====================================================
            PROFILE HEADER CARD
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Profile banner */}

          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              {/* User information */}

              <div className="flex items-center gap-5">
                {/* Avatar */}

                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold text-blue-600 shadow-md">
                  {initials}
                </div>

                {/* Name + email */}

                <div className="min-w-0 text-white">
                  <h2 className="truncate text-2xl font-bold">
                    {user.name || "User"}
                  </h2>

                  <p className="mt-1 flex items-center gap-2 text-sm text-blue-100">
                    <Mail size={15} />

                    <span className="truncate">{user.email}</span>
                  </p>
                </div>
              </div>

              {/* Edit button */}

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* =====================================================
              PROFILE INFORMATION
          ====================================================== */}

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Personal Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your basic account information.
              </p>
            </div>

            {/* EDIT MODE */}

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-5">
                {/* Name */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-500"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Email address cannot be changed here.
                  </p>
                </div>

                {/* Buttons */}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={updateProfileMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <X size={17} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* VIEW MODE */

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <User size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Full Name
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {user.name || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <Mail size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 truncate font-semibold text-slate-900">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Member Since */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <Calendar size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Member Since
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {createdDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <User size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Account
                      </p>

                      <p className="mt-1 font-semibold capitalize text-slate-900">
                        {user.role || "User"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            INTERVIEW STATISTICS
        ====================================================== */}

        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Interview Activity
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Track your progress on InterviAI.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Total Interviews */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Interviews</p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {isActivityLoading ? "—" : totalInterviews}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ClipboardCheck size={21} />
                </div>
              </div>
            </div>

            {/* Resume */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Resume</p>

                  <Link
                    to="/resume"
                    className="mt-2 inline-flex items-center gap-1 text-2xl font-bold "
                  >
                    <span className="text-blue-600 hover:text-blue-700">
                      View
                    </span>
                  </Link>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText size={21} />
                </div>
              </div>
            </div>

            {/* Best Score */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Best Score</p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {isActivityLoading ? "—" : bestScore}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Trophy size={21} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            ACTIVITY LIST
        ====================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Recent Interviews
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest interview activity.
                </p>
              </div>

              <Link
                to="/interview/history"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View History
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Loading */}

          {isActivityLoading && (
            <div className="flex items-center justify-center px-6 py-12">
              <div className="flex items-center gap-3 text-slate-500">
                <Loader2 size={20} className="animate-spin" />

                <span>Loading interview activity...</span>
              </div>
            </div>
          )}

          {/* Error */}

          {!isActivityLoading && isActivityError && (
            <div className="px-6 py-10 text-center">
              <AlertTriangle size={28} className="mx-auto text-red-500" />

              <h4 className="mt-3 font-semibold text-slate-900">
                Unable to load activity
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                We couldn't retrieve your interview activity.
              </p>

              <button
                type="button"
                onClick={() => refetchActivity()}
                className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}

          {!isActivityLoading &&
            !isActivityError &&
            interviews.length === 0 && (
              <div className="px-6 py-12 text-center">
                <ClipboardCheck size={32} className="mx-auto text-slate-300" />

                <h4 className="mt-3 font-semibold text-slate-900">
                  No interviews yet
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Start your first AI mock interview to begin tracking your
                  progress.
                </p>

                <Link
                  to="/interview/generate"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Create Interview
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

          {/* Interview list */}

          {!isActivityLoading && !isActivityError && interviews.length > 0 && (
            <div className="divide-y divide-slate-100">
              {interviews.slice(0, 5).map((interview) => {
                const status = getStatusDetails(interview.status);

                const StatusIcon = status.icon;

                return (
                  <div
                    key={interview._id}
                    className="px-6 py-5 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      {/* Interview information */}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-slate-900">
                            {interview.targetRole || "Mock Interview"}
                          </h4>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                          >
                            <StatusIcon size={13} />

                            {status.label}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span>
                            {interview.difficulty || "Difficulty unavailable"}
                          </span>

                          <span>
                            {formatInterviewDate(
                              interview.createdAt || interview.startedAt,
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Score + action */}

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        {interview.status === "completed" && (
                          <div className="text-right">
                            <p className="text-xs text-slate-400">Score</p>

                            <p className="text-lg font-bold text-slate-900">
                              {interview.score ?? 0}
                            </p>
                          </div>
                        )}

                        {interview.status === "completed" ? (
                          <Link
                            to={`/interview/${interview._id}/result`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            View Result
                            <ArrowRight size={14} />
                          </Link>
                        ) : interview.status === "in_progress" ? (
                          <Link
                            to={`/interview/${interview._id}/session`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                          >
                            Continue
                            <ArrowRight size={14} />
                          </Link>
                        ) : interview.status === "pending" ? (
                          <Link
                            to={`/interview/${interview._id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                          >
                            Start
                            <ArrowRight size={14} />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =====================================================
            ACCOUNT ACTIONS
        ====================================================== */}

        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Account Actions</h3>

              <p className="mt-1 text-sm text-slate-500">
                Sign out from your InterviAI account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {logoutMutation.isPending ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut size={17} />
                  Logout
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
