import { BrainCircuit, Clock3, ListChecks, Target } from "lucide-react";
import { motion } from "framer-motion";

function InterviewDetailsCard({ interview }) {
  const { targetRole, difficulty, duration, totalQuestions, status } =
    interview;

  const statusLabels = {
    pending: "Ready to Start",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BrainCircuit size={24} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            {targetRole}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your AI-generated mock interview is ready.
          </p>
        </div>

        <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium capitalize text-blue-700">
          {statusLabels[status] || status}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Target size={17} />
            <span className="text-sm">Difficulty</span>
          </div>

          <p className="mt-2 font-semibold text-slate-900">{difficulty}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Clock3 size={17} />
            <span className="text-sm">Duration</span>
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {duration} minutes
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <ListChecks size={17} />
            <span className="text-sm">Questions</span>
          </div>

          <p className="mt-2 font-semibold text-slate-900">{totalQuestions}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default InterviewDetailsCard;
