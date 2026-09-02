import { useEffect, useState } from "react";
import {
  Search,
  Users,
  Shield,
  ShieldOff,
  Trash2,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  MoreVertical,
  Crown,
} from "lucide-react";

import api from "../../api/axios";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [actionLoading, setActionLoading] = useState(null);

  /*
   * ----------------------------------------------------
   * FETCH USERS
   * ----------------------------------------------------
   */

  const fetchUsers = async ({
    showLoader = true,
    currentPage = page,
    currentSearch = search,
    currentRole = role,
  } = {}) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setError("");

      const params = {
        page: currentPage,
        limit: 10,
      };

      if (currentSearch.trim()) {
        params.search = currentSearch.trim();
      }

      if (currentRole) {
        params.role = currentRole;
      }

      const response = await api.get("/admin/users", {
        params,
      });

      const data = response.data?.data;

      setUsers(data?.users || []);

      setPagination(
        data?.pagination || {
          page: currentPage,
          limit: 10,
          totalUsers: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (err) {
      console.error("Admin users fetch error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load users. Please try again.",
      );

      setUsers([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  /*
   * ----------------------------------------------------
   * INITIAL LOAD + SEARCH / FILTER
   * ----------------------------------------------------
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers({
        currentPage: page,
        currentSearch: search,
        currentRole: role,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [page, search, role]);

  /*
   * ----------------------------------------------------
   * REFRESH
   * ----------------------------------------------------
   */

  const handleRefresh = () => {
    fetchUsers({
      showLoader: false,
      currentPage: page,
      currentSearch: search,
      currentRole: role,
    });
  };

  /*
   * ----------------------------------------------------
   * BLOCK / UNBLOCK
   * ----------------------------------------------------
   */

  const handleBlockToggle = async (user) => {
    const action = user.isBlocked ? "unblock" : "block";

    const confirmed = window.confirm(
      user.isBlocked
        ? `Unblock ${user.fullName || user.email}?`
        : `Block ${user.fullName || user.email}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`${action}-${user._id}`);
      setError("");

      await api.patch(`/admin/users/${user._id}/block`, {
        isBlocked: !user.isBlocked,
      });

      await fetchUsers({
        showLoader: false,
        currentPage: page,
        currentSearch: search,
        currentRole: role,
      });
    } catch (err) {
      console.error("Block user error:", err);

      setError(
        err?.response?.data?.message ||
          `Unable to ${action} user. Please try again.`,
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * ----------------------------------------------------
   * CHANGE ROLE
   * ----------------------------------------------------
   */

  const handleRoleChange = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";

    const actionText =
      newRole === "admin" ? "promote to admin" : "demote to user";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${user.fullName || user.email}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`role-${user._id}`);
      setError("");

      await api.patch(`/admin/users/${user._id}/role`, {
        role: newRole,
      });

      await fetchUsers({
        showLoader: false,
        currentPage: page,
        currentSearch: search,
        currentRole: role,
      });
    } catch (err) {
      console.error("Update role error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to update user role. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * ----------------------------------------------------
   * DELETE USER
   * ----------------------------------------------------
   */

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${
        user.fullName || user.email
      }?\n\nThis will also delete their resumes, interviews, evaluations and answers.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`delete-${user._id}`);
      setError("");

      await api.delete(`/admin/users/${user._id}`);

      /*
       * If the last user on a page was deleted,
       * move back to the previous page.
       */
      if (users.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        await fetchUsers({
          showLoader: false,
          currentPage: page,
          currentSearch: search,
          currentRole: role,
        });
      }
    } catch (err) {
      console.error("Delete user error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete user. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * ----------------------------------------------------
   * PAGE CONTROLS
   * ----------------------------------------------------
   */

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setPage((previous) => previous - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPage((previous) => previous + 1);
    }
  };

  /*
   * ----------------------------------------------------
   * HELPERS
   * ----------------------------------------------------
   */

  const getInitials = (name, email) => {
    if (name) {
      return name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    return email?.slice(0, 2).toUpperCase() || "U";
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /*
   * ----------------------------------------------------
   * LOADING SCREEN
   * ----------------------------------------------------
   */

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={22} className="animate-spin" />
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  /*
   * ----------------------------------------------------
   * PAGE
   * ----------------------------------------------------
   */

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------ */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Users size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Users
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage InterviAI users, roles and account access.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ------------------------------------------------ */}
        {/* ERROR */}
        {/* ------------------------------------------------ */}

        {error && (
          <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-semibold text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* STAT */}
        {/* ------------------------------------------------ */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Users</p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {pagination.totalUsers}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Current Page</p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {pagination.page}
                  <span className="text-base font-medium text-slate-400">
                    {" "}
                    / {pagination.totalPages}
                  </span>
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ClipboardIcon />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Showing</p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {users.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* FILTERS */}
        {/* ------------------------------------------------ */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Role */}

            <select
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* USERS TABLE */}
        {/* ------------------------------------------------ */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const roleLoading = actionLoading === `role-${user._id}`;

                  const blockLoading =
                    actionLoading === `block-${user._id}` ||
                    actionLoading === `unblock-${user._id}`;

                  const deleteLoading = actionLoading === `delete-${user._id}`;

                  return (
                    <tr key={user._id} className="transition hover:bg-slate-50">
                      {/* User */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                            {getInitials(user.fullName, user.email)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {user.fullName || "Unnamed User"}
                            </p>

                            <p className="truncate text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}

                      <td className="px-6 py-4">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                            <Crown size={13} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            <Users size={13} />
                            User
                          </span>
                        )}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">
                        {user.isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            <UserX size={13} />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <UserCheck size={13} />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Joined */}

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {/* Promote / Demote */}

                          <button
                            type="button"
                            title={
                              user.role === "admin"
                                ? "Demote to user"
                                : "Promote to admin"
                            }
                            onClick={() => handleRoleChange(user)}
                            disabled={
                              roleLoading || blockLoading || deleteLoading
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {roleLoading ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : user.role === "admin" ? (
                              <ShieldOff size={16} />
                            ) : (
                              <Shield size={16} />
                            )}
                          </button>

                          {/* Block / Unblock */}

                          <button
                            type="button"
                            title={
                              user.isBlocked ? "Unblock user" : "Block user"
                            }
                            onClick={() => handleBlockToggle(user)}
                            disabled={
                              roleLoading || blockLoading || deleteLoading
                            }
                            className={
                              user.isBlocked
                                ? "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                                : "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 text-amber-600 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                            }
                          >
                            {blockLoading ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : user.isBlocked ? (
                              <UserCheck size={16} />
                            ) : (
                              <UserX size={16} />
                            )}
                          </button>

                          {/* Delete */}

                          <button
                            type="button"
                            title="Delete user"
                            onClick={() => handleDelete(user)}
                            disabled={
                              roleLoading || blockLoading || deleteLoading
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deleteLoading ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ------------------------------------------------ */}
          {/* MOBILE USERS */}
          {/* ------------------------------------------------ */}

          <div className="divide-y divide-slate-100 md:hidden">
            {users.map((user) => {
              const roleLoading = actionLoading === `role-${user._id}`;

              const blockLoading =
                actionLoading === `block-${user._id}` ||
                actionLoading === `unblock-${user._id}`;

              const deleteLoading = actionLoading === `delete-${user._id}`;

              return (
                <div key={user._id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                        {getInitials(user.fullName, user.email)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {user.fullName || "Unnamed User"}
                        </p>

                        <p className="truncate text-sm text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <MoreVertical
                      size={20}
                      className="shrink-0 text-slate-400"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                        <Crown size={13} />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        User
                      </span>
                    )}

                    {user.isBlocked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        <UserX size={13} />
                        Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <UserCheck size={13} />
                        Active
                      </span>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-slate-400">
                    Joined {formatDate(user.createdAt)}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRoleChange(user)}
                      disabled={roleLoading || blockLoading || deleteLoading}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
                    >
                      {roleLoading ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : user.role === "admin" ? (
                        <>
                          <ShieldOff size={15} />
                          Demote
                        </>
                      ) : (
                        <>
                          <Shield size={15} />
                          Promote
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBlockToggle(user)}
                      disabled={roleLoading || blockLoading || deleteLoading}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-amber-50 hover:text-amber-600 disabled:opacity-50"
                    >
                      {blockLoading ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : user.isBlocked ? (
                        <>
                          <UserCheck size={15} />
                          Unblock
                        </>
                      ) : (
                        <>
                          <UserX size={15} />
                          Block
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(user)}
                      disabled={roleLoading || blockLoading || deleteLoading}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleteLoading ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <>
                          <Trash2 size={15} />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ------------------------------------------------ */}
          {/* EMPTY STATE */}
          {/* ------------------------------------------------ */}

          {users.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Users size={25} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No users found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or role filter.
              </p>
            </div>
          )}
        </div>

        {/* ------------------------------------------------ */}
        {/* PAGINATION */}
        {/* ------------------------------------------------ */}

        {pagination.totalPages > 0 && (
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-700">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={!pagination.hasPreviousPage}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/*
 * Small icon component used by the stats card.
 * Keeping it here avoids another dependency.
 */
function ClipboardIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 15h4" />
      <path d="M8 11h.01" />
      <path d="M8 15h.01" />
    </svg>
  );
}

export default AdminUsersPage;
