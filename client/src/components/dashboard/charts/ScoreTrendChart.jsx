import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { TrendingUp } from "lucide-react";

import { useScoreTrend } from "../../../hooks/queries/useScoreTrend";

import Loader from "../../ui/Loader";
import EmptyState from "../../ui/EmptyState";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
      <p className="font-semibold">Interview #{data.interview}</p>

      <p className="text-sm text-slate-600 mt-2">Role</p>

      <p className="font-medium">{data.targetRole}</p>

      <p className="text-sm text-slate-600 mt-2">Score</p>

      <p className="font-bold text-blue-600">{data.score}%</p>

      <p className="text-sm text-slate-500 mt-2">
        {new Date(data.date).toLocaleDateString()}
      </p>
    </div>
  );
}

function ScoreTrendChart() {
  const { data, isLoading, isError } = useScoreTrend();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load score trend"
        description="Please try again."
      />
    );
  }

  const chartData = data?.data || [];

  if (!chartData.length) {
    return (
      <EmptyState
        title="No interview data"
        description="Complete your first interview to see score trends."
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <TrendingUp className="text-blue-600" />

        <div>
          <h2 className="text-lg font-semibold">Score Trend</h2>

          <p className="text-sm text-slate-500">
            Performance across completed interviews
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="interview" tickFormatter={(value) => `#${value}`} />

          <YAxis domain={[0, 100]} />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{
              r: 5,
            }}
            activeDot={{
              r: 8,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScoreTrendChart;
