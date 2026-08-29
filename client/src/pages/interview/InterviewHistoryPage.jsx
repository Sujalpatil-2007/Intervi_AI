import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useInterviews } from "../../hooks/queries/useInterviews";

function InterviewHistoryPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading, isError, error, refetch } = useInterviews({
    page,
    limit: 10,
    status: status || undefined,
  });

  const interviews = useMemo(() => {
    return data?.data?.interviews || data?.data || [];
  }, [data]);

  const pagination = data?.pagination || data?.data?.pagination;

  const totalPages = pagination?.totalPages || 1;

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClasses = (value) => {
    switch (value) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getStatusLabel = (value) => {
    if (!value) {
      return "Unknown";
    }

    return value.replace("_", " ");
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((previous) => previous - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((previous) => previous + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={22} />
          <span>Loading interview history...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertTriangle size={32} className="mx-auto text-red-500" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load interview history
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong while loading your interviews."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Interview History
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                View all your generated interviews and their results.
              </p>
            </div>

            <Link
              to="/interview/generate"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <FileText size={17} />
              New Interview
            </Link>
          </div>
        </div>

        {/* Filters */}

        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Your Interviews</h2>

              <p className="text-sm text-slate-500">
                Filter interviews by status.
              </p>
            </div>

            <select
              value={status}
              onChange={handleStatusChange}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Interviews</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Empty */}

        {!interviews.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <FileText size={40} className="mx-auto text-slate-300" />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No interviews found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {status
                ? "There are no interviews with this status."
                : "Generate your first AI interview to see it here."}
            </p>

            {!status && (
              <Link
                to="/interview/generate"
                className="mt-5 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Generate Interview
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}

            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Interview
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Difficulty
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Questions
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Score
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {interviews.map((interview) => (
                      <tr
                        key={interview._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div className="font-semibold text-slate-900">
                            {interview.targetRole || "Interview"}
                          </div>

                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <Calendar size={13} />
                            {formatDate(interview.createdAt)}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-sm capitalize text-slate-700">
                            {interview.difficulty || "—"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-sm text-slate-700">
                            {interview.totalQuestions || 0}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="font-semibold text-slate-900">
                            {interview.status === "completed"
                              ? `${Number(interview.score || 0).toFixed(1)}/10`
                              : "—"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                              interview.status,
                            )}`}
                          >
                            {getStatusLabel(interview.status)}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            to={`/interview/${interview._id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            <Eye size={16} />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}

            <div className="space-y-4 md:hidden">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {interview.targetRole || "Interview"}
                      </h3>

                      <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={13} />
                        {formatDate(interview.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                        interview.status,
                      )}`}
                    >
                      {getStatusLabel(interview.status)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Difficulty</p>
                      <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                        {interview.difficulty || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Score</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {interview.status === "completed"
                          ? `${Number(interview.score || 0).toFixed(1)}/10`
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Questions</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {interview.totalQuestions || 0}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Duration</p>
                      <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-800">
                        <Clock3 size={14} />
                        {interview.duration || 0} min
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/interview/${interview._id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Eye size={16} />
                    View Interview
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}

            {totalPages > 1 && (
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={page === 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="text-sm font-medium text-slate-600">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default InterviewHistoryPage;
