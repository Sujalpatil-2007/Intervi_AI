import { FileText, ClipboardCheck, Trophy, FileBadge } from "lucide-react";

import {useDashboardSummary} from "../../../hooks/queries/useDashboardSummary";

import Loader from "../../ui/Loader";
import EmptyState from "../../ui/EmptyState";
import StatCard from "./StatCard";

function SummaryCards() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data?.data) {
    return (
      <EmptyState
        title="Unable to load dashboard"
        description="Please try again later."
      />
    );
  }

  const summary = data.data;

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Interviews"
        value={summary.totalInterviews}
        icon={ClipboardCheck}
        color="bg-blue-600"
      />

      <StatCard
        title="Completed"
        value={summary.completedInterviews}
        icon={Trophy}
        color="bg-green-600"
      />

      <StatCard
        title="Average Score"
        value={`${summary.averageScore}%`}
        icon={FileBadge}
        color="bg-purple-600"
      />

      <StatCard title="Best Score" value={summary.bestScore} />

      <StatCard title="Latest Score" value={summary.latestScore} />

      <StatCard title="Pending" value={summary.pendingInterviews} />
    </div>
  );
}

export default SummaryCards;
