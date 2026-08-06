import { Trophy, Medal, Award } from "lucide-react";

import { useLeaderboard } from "../../../hooks/queries/useLeaderboard";
import { useAuth } from "../../../hooks/useAuth";

import Loader from "../../ui/Loader";
import EmptyState from "../../ui/EmptyState";

function RankIcon({ rank }) {
  switch (rank) {
    case 1:
      return <Trophy size={20} className="text-yellow-500" />;

    case 2:
      return <Medal size={20} className="text-slate-400" />;

    case 3:
      return <Award size={20} className="text-amber-700" />;

    default:
      return (
        <span className="w-5 text-center text-sm font-semibold text-slate-500">
          {rank}
        </span>
      );
  }
}

function LeaderboardCard() {
  const { user } = useAuth();

  const { data, isLoading, isError } = useLeaderboard();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load leaderboard"
        description="Please try again later."
      />
    );
  }

  const leaderboard = data?.data || [];

  if (!leaderboard.length) {
    return (
      <EmptyState
        title="Leaderboard is empty"
        description="Complete interviews to appear on the leaderboard."
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Trophy className="text-yellow-500" />

        <div>
          <h2 className="text-lg font-semibold">Leaderboard</h2>

          <p className="text-sm text-slate-500">
            Top performers across InterviAI
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((item) => {
          const isCurrentUser = String(item.userId) === String(user?._id);

          return (
            <div
              key={item.userId}
              className={`flex items-center justify-between rounded-lg border p-4 transition ${
                isCurrentUser
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <RankIcon rank={item.rank} />

                <div>
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>

                  <p className="text-sm text-slate-500">
                    {item.completedInterviews} Interviews
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {item.averageScore}%
                </p>

                <p className="text-xs text-slate-500">Best: {item.bestScore}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeaderboardCard;
