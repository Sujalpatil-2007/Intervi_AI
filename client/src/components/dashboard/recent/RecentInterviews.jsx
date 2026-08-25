import { Link } from "react-router-dom";
import { History, ArrowRight } from "lucide-react";

import { useRecentInterviews } from "../../../hooks/queries/useRecentInterviews";

import Loader from "../../ui/Loader";
import EmptyState from "../../ui/EmptyState";

const STATUS_STYLES = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-blue-100 text-blue-700",
};

function RecentInterviews() {
  const { data, isLoading, isError } = useRecentInterviews();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load interviews"
        description="Please try again later."
      />
    );
  }

  const interviews = data?.data || [];

  if (!interviews.length) {
    return (
      <EmptyState
        title="No interviews found"
        description="Generate your first AI interview to get started."
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="text-blue-600" />

          <div>
            <h2 className="text-lg font-semibold">Recent Interviews</h2>

            <p className="text-sm text-slate-500">
              Your latest interview activity
            </p>
          </div>
        </div>

        <Link
          to="/interviews"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {interviews.map((interview) => (
          <div
            key={interview._id}
            className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h3 className="font-semibold text-slate-900">
                {interview.targetRole}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Difficulty: {interview.difficulty}
              </p>

              <p className="text-sm text-slate-500">
                {new Date(
                  interview.completedAt || interview.createdAt,
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  STATUS_STYLES[interview.status] ||
                  "bg-slate-100 text-slate-700"
                }`}
              >
                {interview.status.replace("_", " ")}
              </span>

              <div className="text-right">
                <p className="text-xs text-slate-500">Score</p>

                <p className="text-lg font-bold text-blue-600">
                  {interview.score ?? "--"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentInterviews;
