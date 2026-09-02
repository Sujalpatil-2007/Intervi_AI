import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  Eye,
  Download,
  FileText,
  User,
  Mail,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";

import api from "../../api/axios";

function AdminResumesPage() {
  const [resumes, setResumes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalResumes: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedResume, setSelectedResume] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const fetchResumes = async (page = 1, showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await api.get("/admin/resumes", {
        params: {
          page,
          limit: 10,
          search: search.trim(),
          skill: skill.trim(),
          targetRole: targetRole.trim(),
          sort: "-createdAt",
        },
      });

      const data = response.data?.data;

      setResumes(data?.resumes || []);

      setPagination(
        data?.pagination || {
          page: 1,
          limit: 10,
          totalResumes: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (err) {
      console.error("Admin resumes error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load resumes. Please try again.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResumes(1);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchResumes(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSkill("");
    setTargetRole("");

    setTimeout(() => {
      fetchResumes(1);
    }, 0);
  };

  const handleViewResume = async (resumeId) => {
    try {
      setIsDetailsLoading(true);

      const response = await api.get(`/admin/resumes/${resumeId}`);

      setSelectedResume(response.data?.data || null);
    } catch (err) {
      console.error("Resume details error:", err);

      alert(err?.response?.data?.message || "Unable to load resume details.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleDelete = async (resume) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resume.originalFileName || "this resume"}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(resume._id);

      await api.delete(`/admin/resumes/${resume._id}`);

      setResumes((previous) =>
        previous.filter((item) => item._id !== resume._id),
      );

      setPagination((previous) => ({
        ...previous,
        totalResumes: Math.max(0, previous.totalResumes - 1),
      }));
    } catch (err) {
      console.error("Delete resume error:", err);

      alert(err?.response?.data?.message || "Unable to delete resume.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/admin/resumes/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "resumes.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export resumes error:", err);

      alert(err?.response?.data?.message || "Unable to export resumes.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSkills = (resume) => {
    if (!Array.isArray(resume.parsedSkills)) {
      return [];
    }

    return resume.parsedSkills.slice(0, 4);
  };

  const hasActiveFilters = search.trim() || skill.trim() || targetRole.trim();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Resume Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage resumes uploaded by InterviAI users.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fetchResumes(pagination.page, true)}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={isRefreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">Total Resumes</p>

              <p className="text-2xl font-bold text-slate-900">
                {pagination.totalResumes}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}

        <form
          onSubmit={handleSearch}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {/* Search */}

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Search User
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Skill */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Skill
              </label>

              <input
                type="text"
                value={skill}
                onChange={(event) => setSkill(event.target.value)}
                placeholder="e.g. React"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Target Role */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Target Role
              </label>

              <input
                type="text"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Search size={16} />
              Search
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Error */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-red-700">{error}</p>

              <button
                type="button"
                onClick={() => fetchResumes(pagination.page)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                <RefreshCw size={15} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Content */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex min-h-75 items-center justify-center">
              <div className="flex items-center gap-3 text-slate-500">
                <Loader2 size={22} className="animate-spin" />
                Loading resumes...
              </div>
            </div>
          ) : resumes.length === 0 ? (
            <div className="flex min-h-75 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <FileText size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No resumes found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                No resumes match your current search or filters.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-225">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Resume
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        User
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Skills
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {resumes.map((resume) => (
                      <tr
                        key={resume._id}
                        className="transition hover:bg-slate-50"
                      >
                        {/* Resume */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <FileText size={19} />
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-55 truncate text-sm font-semibold text-slate-900">
                                {resume.title ||
                                  resume.originalFileName ||
                                  "Untitled Resume"}
                              </p>

                              <p className="mt-1 max-w-55 truncate text-xs text-slate-400">
                                {resume.originalFileName || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* User */}

                        <td className="px-6 py-4">
                          <div>
                            <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                              <User size={14} className="text-slate-400" />
                              {resume.user?.fullName || "Unknown User"}
                            </p>

                            <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                              <Mail size={13} />
                              {resume.user?.email || "—"}
                            </p>
                          </div>
                        </td>

                        {/* Skills */}

                        <td className="px-6 py-4">
                          <div className="flex max-w-55 flex-wrap gap-1.5">
                            {getSkills(resume).length > 0 ? (
                              getSkills(resume).map((item, index) => (
                                <span
                                  key={`${item}-${index}`}
                                  className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600"
                                >
                                  {item}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">
                                No skills
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date */}

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(resume.createdAt)}
                        </td>

                        {/* Actions */}

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewResume(resume._id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              title="View Resume"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(resume)}
                              disabled={deletingId === resume._id}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Delete Resume"
                            >
                              {deletingId === resume._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
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

              <div className="divide-y divide-slate-100 md:hidden">
                {resumes.map((resume) => (
                  <div key={resume._id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FileText size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-slate-900">
                          {resume.title ||
                            resume.originalFileName ||
                            "Untitled Resume"}
                        </h3>

                        <p className="mt-1 truncate text-xs text-slate-400">
                          {resume.originalFileName || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-slate-600">
                        <User size={15} className="text-slate-400" />

                        {resume.user?.fullName || "Unknown User"}
                      </p>

                      <p className="flex items-center gap-2 text-slate-500">
                        <Mail size={15} className="text-slate-400" />

                        {resume.user?.email || "—"}
                      </p>

                      <p className="flex items-center gap-2 text-slate-500">
                        <Briefcase size={15} className="text-slate-400" />

                        {formatDate(resume.createdAt)}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {getSkills(resume).map((item, index) => (
                        <span
                          key={`${item}-${index}`}
                          className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewResume(resume._id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(resume)}
                        disabled={deletingId === resume._id}
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === resume._id ? (
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
                  Page {pagination.page} of {pagination.totalPages || 1}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => fetchResumes(pagination.page - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={!pagination.hasNextPage}
                    onClick={() => fetchResumes(pagination.page + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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

      {/* Resume Details Modal */}

      {selectedResume && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}

            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-slate-900">
                  {selectedResume.title ||
                    selectedResume.originalFileName ||
                    "Resume Details"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Resume ID: {selectedResume._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedResume(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {isDetailsLoading ? (
              <div className="flex min-h-62 items-center justify-center">
                <Loader2 size={25} className="animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-6 p-6">
                {/* User */}

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                    User
                  </h3>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">
                      {selectedResume.user?.fullName || "Unknown User"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedResume.user?.email || "—"}
                    </p>
                  </div>
                </section>

                {/* File */}

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                    Resume File
                  </h3>

                  <div className="mt-3 rounded-xl border border-slate-200 p-4">
                    <p className="text-sm font-medium text-slate-900">
                      {selectedResume.originalFileName || "No file name"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Uploaded {formatDate(selectedResume.createdAt)}
                    </p>
                  </div>
                </section>

                {/* Skills */}

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                    Skills
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.isArray(selectedResume.parsedSkills) &&
                    selectedResume.parsedSkills.length > 0 ? (
                      selectedResume.parsedSkills.map((item, index) => (
                        <span
                          key={`${item}-${index}`}
                          className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">
                        No skills available.
                      </p>
                    )}
                  </div>
                </section>

                {/* Suggested Roles */}

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                    Suggested Roles
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.isArray(selectedResume.suggestedRoles) &&
                    selectedResume.suggestedRoles.length > 0 ? (
                      selectedResume.suggestedRoles.map((role, index) => (
                        <span
                          key={`${role}-${index}`}
                          className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600"
                        >
                          {role}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">
                        No suggested roles available.
                      </p>
                    )}
                  </div>
                </section>

                {/* Education */}

                {Array.isArray(selectedResume.parsedEducation) &&
                  selectedResume.parsedEducation.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                        Education
                      </h3>

                      <div className="mt-3 space-y-2">
                        {selectedResume.parsedEducation.map(
                          (education, index) => (
                            <div
                              key={index}
                              className="rounded-xl border border-slate-200 p-4"
                            >
                              <p className="text-sm text-slate-700">
                                {typeof education === "string"
                                  ? education
                                  : JSON.stringify(education)}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </section>
                  )}

                {/* Experience */}

                {Array.isArray(selectedResume.parsedExperience) &&
                  selectedResume.parsedExperience.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                        Experience
                      </h3>

                      <div className="mt-3 space-y-2">
                        {selectedResume.parsedExperience.map(
                          (experience, index) => (
                            <div
                              key={index}
                              className="rounded-xl border border-slate-200 p-4"
                            >
                              <p className="text-sm text-slate-700">
                                {typeof experience === "string"
                                  ? experience
                                  : JSON.stringify(experience)}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </section>
                  )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminResumesPage;
