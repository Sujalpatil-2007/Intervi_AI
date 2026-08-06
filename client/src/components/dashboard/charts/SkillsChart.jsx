import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { Brain } from "lucide-react";

import { useSkills } from "../../../hooks/queries/useSkills";

import Loader from "../../ui/Loader";
import EmptyState from "../../ui/EmptyState";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#16a34a",
  "#ea580c",
  "#0891b2",
  "#db2777",
  "#4f46e5",
];

function SkillsTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const skill = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
      <p className="font-semibold">{skill.category}</p>

      <p className="mt-2 text-blue-600 font-bold">{skill.averageScore}%</p>
    </div>
  );
}

function SkillsChart() {
  const { data, isLoading, isError } = useSkills();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load skills"
        description="Please try again."
      />
    );
  }

  const skills = data?.data || [];

  if (!skills.length) {
    return (
      <EmptyState
        title="No skill evaluation available"
        description="Complete interviews to see your skill performance."
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Brain className="text-violet-600" />

        <div>
          <h2 className="text-lg font-semibold">Skill Performance</h2>

          <p className="text-sm text-slate-500">
            Average score by interview category
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={skills}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="category"
            angle={-15}
            textAnchor="end"
            interval={0}
            height={60}
          />

          <YAxis domain={[0, 100]} />

          <Tooltip content={<SkillsTooltip />} />

          <Bar dataKey="averageScore" radius={[8, 8, 0, 0]}>
            {skills.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SkillsChart;
