import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Loader2,
  RefreshCw,
  X,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";

import api from "../../api/axios";

function AdminInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalInterviews: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");

  const fetchInterviews = async (page = 1) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get("/admin/interviews", {
        params: {
          page,
          limit: 10,
          search: search.trim(),
          status: status || undefined,
          difficulty: difficulty || undefined,
          sort,
        },
      });

      const data = response.data?.data;

      setInterviews(data?.interviews || []);

      setPagination(
        data?.pagination || {
          page: 1,
          limit: 10,
          totalInterviews: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (err) {
      console.error("Admin interviews error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load interviews. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInterviews(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, status, difficulty, sort]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setDeleteId(id);
      setError("");

      await api.delete(`/admin/interviews/${id}`);

      const currentPage = pagination.page;

      if (interviews.length === 1 && currentPage > 1) {
        await fetchInterviews(currentPage - 1);
      } else {
        await fetchInterviews(currentPage);
      }
    } catch (err) {
      console.error("Delete interview error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete the interview. Please try again.",
      );
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setDifficulty("");
    setSort("-createdAt");
  };

  const getStatusBadge = (interviewStatus) => {
    switch (interviewStatus) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={13} />
            Completed
          </span>
        );

      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Clock size={13} />
            In Progress
          </span>
        );

      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <Circle size={13} />
            Pending
          </span>
        );

      default:
        return (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
            {interviewStatus || "Unknown"}
          </span>
        );
    }
  };

  const getDifficultyBadge = (value) => {
    if (value === "Easy") {
      return (
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Easy
        </span>
      );
    }

    if (value === "Medium") {
      return (
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Medium
        </span>
      );
    }

    if (value === "Hard") {
      return (
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          Hard
        </span>
      );
    }

    return (
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        {value || "-"}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatScore = (score) => {
    if (score === null || score === undefined) return "-";

    return `${score}%`;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <ClipboardCheck size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Interviews
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage and monitor all platform interviews.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchInterviews(pagination.page)}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Filters */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}

            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search user name or email..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Status */}

            <div className="relative">
              <Filter
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Difficulty */}

            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-score">Highest Score</option>
              <option value="score">Lowest Score</option>
            </select>

            {(search || status || difficulty || sort !== "-createdAt") && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <X size={15} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => fetchInterviews(pagination.page)}
              className="font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Card */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Loading */}

          {isLoading ? (
            <div className="flex min-h-100 items-center justify-center">
              <div className="flex items-center gap-3 text-slate-500">
                <Loader2 size={22} className="animate-spin" />
                <span>Loading interviews...</span>
              </div>
            </div>
          ) : interviews.length === 0 ? (
            /* Empty */

            <div className="flex min-h-100 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <ClipboardCheck size={30} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                No interviews found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                No interviews match your current search or filter criteria.
              </p>

              {(search || status || difficulty) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Candidate
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Target Role
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Difficulty
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Score
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Created
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {interviews.map((interview) => (
                      <tr
                        key={interview._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {interview.user?.fullName || "Unknown User"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {interview.user?.email || "-"}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {interview.targetRole || "-"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {interview.totalQuestions || 0} questions
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {getDifficultyBadge(interview.difficulty)}
                        </td>

                        <td className="px-5 py-4">
                          {getStatusBadge(interview.status)}
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-900">
                            {formatScore(interview.score)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(interview.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/interviews/${interview._id}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              title="View interview"
                            >
                              <Eye size={17} />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(interview._id)}
                              disabled={isDeleting}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Delete interview"
                            >
                              {deleteId === interview._id ? (
                                <Loader2
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}

              <div className="divide-y divide-slate-200 lg:hidden">
                {interviews.map((interview) => (
                  <div key={interview._id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-900">
                          {interview.user?.fullName || "Unknown User"}
                        </h3>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {interview.user?.email || "-"}
                        </p>
                      </div>

                      {getStatusBadge(interview.status)}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">Target Role</p>

                        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                          {interview.targetRole || "-"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">Difficulty</p>

                        <div className="mt-1">
                          {getDifficultyBadge(interview.difficulty)}
                        </div>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">Score</p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {formatScore(interview.score)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">Created</p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatDate(interview.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/admin/interviews/${interview._id}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye size={16} />
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(interview._id)}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleteId === interview._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}

              <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {interviews.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {pagination.totalInterviews || 0}
                  </span>{" "}
                  interviews
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!pagination.hasPreviousPage || isLoading}
                    onClick={() => fetchInterviews(pagination.page - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                    {pagination.page} / {pagination.totalPages || 1}
                  </span>

                  <button
                    type="button"
                    disabled={!pagination.hasNextPage || isLoading}
                    onClick={() => fetchInterviews(pagination.page + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminInterviewsPage;