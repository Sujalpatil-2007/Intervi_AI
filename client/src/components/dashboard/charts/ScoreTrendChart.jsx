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
      <p className="font-semibold text-slate-900">
        Interview #{data.interview}
      </p>

      {data.targetRole && (
        <>
          <p className="mt-2 text-sm text-slate-500">Role</p>

          <p className="font-medium text-slate-800">{data.targetRole}</p>
        </>
      )}

      <p className="mt-2 text-sm text-slate-500">Score</p>

      <p className="font-bold text-blue-600">
        {Number(data.score ?? 0).toFixed(1)}/10
      </p>

      {data.date && (
        <p className="mt-2 text-sm text-slate-500">
          {new Date(data.date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function ScoreTrendChart() {
  const { data, isLoading, isError, refetch } = useScoreTrend();

  if (isLoading) {
    return <Loader text="Loading score trend..." />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load score trend"
        message="We couldn't load your interview performance."
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

  const chartData = Array.isArray(data?.data) ? data.data : [];

  if (!chartData.length) {
    return (
      <EmptyState
        title="No interview data"
        message="Complete your first interview to see your score trends."
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <TrendingUp size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">Score Trend</h2>

          <p className="text-sm text-slate-500">
            Performance across completed interviews
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="interview" tickFormatter={(value) => `#${value}`} />

          <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScoreTrendChart;
