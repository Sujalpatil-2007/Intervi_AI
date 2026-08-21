import {
  ClipboardCheck,
  FileBadge,
  Trophy,
  Target,
  Clock3,
} from "lucide-react";

import { useDashboardSummary } from "../../../hooks/queries/useDashboardSummary";

import Loader from "../../ui/Loader";
import EmptyState from "../../ui/EmptyState";
import StatCard from "./StatCard";

function SummaryCards() {
  const { data, isLoading, isError, refetch } = useDashboardSummary();

  if (isLoading) {
    return <Loader text="Loading dashboard..." />;
  }

  if (isError || !data?.data) {
    return (
      <EmptyState
        title="Unable to load dashboard"
        message="We couldn't load your dashboard summary."
        action={
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        }
      />
    );
  }

  const summary = data.data;

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Interviews"
        value={summary.totalInterviews ?? 0}
        Icon={ClipboardCheck}
        color="bg-blue-600"
      />

      <StatCard
        title="Completed"
        value={summary.completedInterviews ?? 0}
        Icon={Trophy}
        color="bg-green-600"
      />

      <StatCard
        title="Average Score"
        value={`${summary.averageScore ?? 0}%`}
        Icon={FileBadge}
        color="bg-purple-600"
      />

      <StatCard
        title="Best Score"
        value={summary.bestScore ?? 0}
        Icon={Target}
        color="bg-amber-600"
      />

      <StatCard
        title="Latest Score"
        value={summary.latestScore ?? 0}
        Icon={FileBadge}
        color="bg-indigo-600"
      />

      <StatCard
        title="Pending"
        value={summary.pendingInterviews ?? 0}
        Icon={Clock3}
        color="bg-slate-600"
      />
    </div>
  );
}

export default SummaryCards;
