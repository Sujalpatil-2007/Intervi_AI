import { useMemo } from "react";
import {
  AlertTriangle,
  Crown,
  Medal,
  RefreshCw,
  Trophy,
  User,
  Loader2,
} from "lucide-react";

import { useLeaderboard } from "../../hooks/queries/useLeaderboard";

function LeaderboardPage() {
  const { data, isLoading, isError, error, refetch } = useLeaderboard();

  /*
   * Support common API response structures:
   *
   * {
   *   success: true,
   *   data: [...]
   * }
   *
   * OR
   *
   * {
   *   success: true,
   *   data: {
   *     leaderboard: [...]
   *   }
   * }
   */
  const leaderboard = useMemo(() => {
    const result = data?.data?.leaderboard || data?.data || [];

    return Array.isArray(result) ? result : [];
  }, [data]);

  /*
   * Try to identify the current user's entry.
   *
   * Your backend may return `isCurrentUser`.
   * If not, we also check common field names.
   */
  const currentUser = leaderboard.find(
    (item) => item.isCurrentUser === true || item.currentUser === true,
  );

  const topThree = leaderboard.slice(0, 3);
  const remainingUsers = leaderboard.slice(3);

  /*
   * Loading
   */

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={22} className="animate-spin" />

          <span>Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  /*
   * Error
   */

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertTriangle size={34} className="mx-auto text-red-500" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load leaderboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error?.response?.data?.message ||
              "Something went wrong while loading the leaderboard."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /*
   * Empty state
   */

  if (!leaderboard.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Trophy size={40} className="mx-auto text-amber-500" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            No leaderboard data yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Complete an interview to start appearing on the leaderboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Trophy size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Leaderboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  See how you rank against other InterviAI users.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ================= TOP 3 ================= */}

        {topThree.length >= 1 && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Crown size={25} />
              </div>

              <h2 className="mt-3 text-lg font-bold text-slate-900">
                Top Performers
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                The highest-scoring interview candidates.
              </p>
            </div>

            <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-3">
              {topThree.map((item, index) => {
                const rank = Number(item.rank) || index + 1;

                const name =
                  item.name || item.user?.name || item.username || "User";

                const score = Number(
                  item.score ?? item.averageScore ?? item.bestScore ?? 0,
                );

                const isFirst = rank === 1;

                return (
                  <div
                    key={item._id || item.user?._id || `${rank}-${name}`}
                    className={`relative rounded-2xl border p-6 text-center ${
                      isFirst
                        ? "border-amber-200 bg-amber-50 md:order-2 md:-translate-y-3"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    {isFirst && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                        #1
                      </div>
                    )}

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-bold text-slate-700 shadow-sm">
                      {name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div className="mt-4 flex justify-center">
                      {rank === 1 ? (
                        <Crown size={22} className="text-amber-500" />
                      ) : (
                        <Medal size={22} className="text-slate-400" />
                      )}
                    </div>

                    <h3 className="mt-2 truncate font-bold text-slate-900">
                      {name}
                    </h3>

                    <p className="mt-2 text-3xl font-bold text-blue-600">
                      {score}%
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Interview Score
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= CURRENT USER ================= */}

        {currentUser && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">
                  <User size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Your Ranking
                  </p>

                  <h3 className="font-bold text-slate-900">
                    {currentUser.name || currentUser.user?.name || "You"}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-slate-500">Rank</p>

                  <p className="text-xl font-bold text-slate-900">
                    #{currentUser.rank}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Score</p>

                  <p className="text-xl font-bold text-blue-600">
                    {currentUser.score ?? 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= LEADERBOARD TABLE ================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-bold text-slate-900">Rankings</h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete leaderboard standings.
            </p>
          </div>

          {/* Desktop */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Rank</th>

                  <th className="px-6 py-4">Candidate</th>

                  <th className="px-6 py-4">Interviews</th>

                  <th className="px-6 py-4">Score</th>
                </tr>
              </thead>

              <tbody>
                {leaderboard.map((item, index) => {
                  const rank = Number(item.rank) || index + 1;

                  const name =
                    item.name || item.user?.name || item.username || "User";

                  const score = Number(
                    item.score ?? item.averageScore ?? item.bestScore ?? 0,
                  );

                  const interviews =
                    item.interviewsCompleted ??
                    item.completedInterviews ??
                    item.interviews ??
                    0;

                  const isCurrent =
                    item.isCurrentUser === true || item.currentUser === true;

                  return (
                    <tr
                      key={item._id || item.user?._id || `${rank}-${name}`}
                      className={`border-b border-slate-100 last:border-0 ${
                        isCurrent ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {rank <= 3 ? (
                            <Medal size={19} className="text-amber-500" />
                          ) : null}

                          <span className="font-bold text-slate-700">
                            #{rank}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                            {name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {name}

                              {isCurrent && (
                                <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
                                  You
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {interviews}
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-bold text-blue-600">
                          {score}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}

          <div className="divide-y divide-slate-100 md:hidden">
            {leaderboard.map((item, index) => {
              const rank = Number(item.rank) || index + 1;

              const name =
                item.name || item.user?.name || item.username || "User";

              const score = Number(
                item.score ?? item.averageScore ?? item.bestScore ?? 0,
              );

              const interviews =
                item.interviewsCompleted ??
                item.completedInterviews ??
                item.interviews ??
                0;

              const isCurrent =
                item.isCurrentUser === true || item.currentUser === true;

              return (
                <div
                  key={item._id || item.user?._id || `${rank}-${name}`}
                  className={`flex items-center justify-between p-5 ${
                    isCurrent ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-center font-bold text-slate-500">
                      #{rank}
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                      {name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {interviews} interviews
                      </p>
                    </div>
                  </div>

                  <div className="ml-3 text-right">
                    <p className="font-bold text-blue-600">{score}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
