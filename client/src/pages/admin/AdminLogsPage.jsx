import { useEffect, useState } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  User,
  FileText,
  Video,
  X,
} from "lucide-react";

import api from "../../api/axios";

function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalLogs: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [action, setAction] = useState("");
  const [targetType, setTargetType] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  const fetchLogs = async (page = 1) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get("/admin/logs", {
        params: {
          page,
          limit: 10,
          search,
          action,
          targetType,
          sort,
        },
      });

      const result = response.data?.data;

      setLogs(result?.logs || []);

      setPagination(
        result?.pagination || {
          page: 1,
          limit: 10,
          totalLogs: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (err) {
      console.error("Admin logs error:", err);

      setError(
        err?.response?.data?.message || "Unable to load admin activity logs.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [search, action, targetType, sort]);

  const handleSearch = (event) => {
    event.preventDefault();

    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setAction("");
    setTargetType("");
    setSort("-createdAt");
  };

  const handlePageChange = (page) => {
    fetchLogs(page);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const response = await api.get("/admin/logs/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "admin-logs.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export logs error:", err);

      setError(err?.response?.data?.message || "Unable to export admin logs.");
    } finally {
      setIsExporting(false);
    }
  };

  const getActionLabel = (actionName) => {
    if (!actionName) return "Unknown";

    return actionName
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getActionClass = (actionName) => {
    if (!actionName) {
      return "bg-slate-100 text-slate-600";
    }

    if (actionName.includes("DELETE") || actionName.includes("BLOCK")) {
      return "bg-red-50 text-red-600";
    }

    if (actionName.includes("UPDATE") || actionName.includes("ROLE")) {
      return "bg-amber-50 text-amber-600";
    }

    if (actionName.includes("UNBLOCK")) {
      return "bg-emerald-50 text-emerald-600";
    }

    return "bg-blue-50 text-blue-600";
  };

  const getTargetIcon = (target) => {
    switch (target) {
      case "User":
        return <User size={17} />;

      case "Resume":
        return <FileText size={17} />;

      case "Interview":
        return <Video size={17} />;

      default:
        return <Activity size={17} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasFilters = search || action || targetType || sort !== "-createdAt";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Activity size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Admin Activity Logs
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor administrative actions performed across InterviAI.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExporting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={17} />
                Export CSV
              </>
            )}
          </button>
        </div>

        {/* Error */}

        {error && (
          <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Filters */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={18} className="text-slate-500" />

            <h2 className="font-semibold text-slate-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}

            <form onSubmit={handleSearch} className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search activity description..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-20 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            {/* Action */}

            <select
              value={action}
              onChange={(event) => setAction(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Actions</option>
              <option value="UPDATE_USER_ROLE">Update User Role</option>
              <option value="BLOCK_USER">Block User</option>
              <option value="UNBLOCK_USER">Unblock User</option>
              <option value="DELETE_USER">Delete User</option>
              <option value="DELETE_RESUME">Delete Resume</option>
              <option value="DELETE_INTERVIEW">Delete Interview</option>
            </select>

            {/* Target */}

            <select
              value={targetType}
              onChange={(event) => setTargetType(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Targets</option>
              <option value="User">User</option>
              <option value="Resume">Resume</option>
              <option value="Interview">Interview</option>
            </select>

            {/* Sort */}

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="-createdAt">Newest First</option>

              <option value="createdAt">Oldest First</option>
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Logs */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop Table */}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Admin
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Target
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex items-center justify-center gap-3 text-slate-500">
                        <Loader2 size={21} className="animate-spin" />
                        Loading activity...
                      </div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <Activity size={35} className="mx-auto text-slate-300" />

                      <h3 className="mt-3 font-semibold text-slate-900">
                        No activity found
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        No admin activity matches your filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="transition hover:bg-slate-50">
                      {/* Admin */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                            {log.admin?.fullName?.charAt(0)?.toUpperCase() || (
                              <Shield size={16} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {log.admin?.fullName || "Unknown Admin"}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {log.admin?.email || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Action */}

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getActionClass(
                            log.action,
                          )}`}
                        >
                          {getActionLabel(log.action)}
                        </span>
                      </td>

                      {/* Target */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <span className="text-slate-400">
                            {getTargetIcon(log.targetType)}
                          </span>

                          <div>
                            <p className="font-medium">
                              {log.targetType || "-"}
                            </p>

                            <p className="max-w-32 truncate text-xs text-slate-400">
                              {log.targetId || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Description */}

                      <td className="max-w-md px-6 py-4">
                        <p className="text-sm leading-6 text-slate-600">
                          {log.description || "-"}
                        </p>
                      </td>

                      {/* Date */}

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}

          <div className="lg:hidden">
            {isLoading ? (
              <div className="flex items-center justify-center gap-3 px-6 py-16 text-slate-500">
                <Loader2 size={21} className="animate-spin" />
                Loading activity...
              </div>
            ) : logs.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Activity size={35} className="mx-auto text-slate-300" />

                <h3 className="mt-3 font-semibold text-slate-900">
                  No activity found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  No admin activity matches your filters.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <div key={log._id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                          {log.admin?.fullName?.charAt(0)?.toUpperCase() || (
                            <Shield size={17} />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {log.admin?.fullName || "Unknown Admin"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {log.admin?.email || "-"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getActionClass(
                          log.action,
                        )}`}
                      >
                        {getActionLabel(log.action)}
                      </span>
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-50 p-3">
                      <p className="text-sm leading-6 text-slate-600">
                        {log.description || "-"}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        {getTargetIcon(log.targetType)}
                        {log.targetType || "-"}
                      </span>

                      <span>{formatDate(log.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}

          {!isLoading && logs.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing page{" "}
                <span className="font-semibold text-slate-700">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {pagination.totalPages}
                </span>{" "}
                ·{" "}
                <span className="font-semibold text-slate-700">
                  {pagination.totalLogs}
                </span>{" "}
                total logs
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Refresh */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => fetchLogs(pagination.page)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh logs
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogsPage;