import { Award, Target, Trophy } from "lucide-react";
import { motion } from "framer-motion";

function ScoreCard({ score, targetRole, difficulty }) {
  const numericScore = Number(score || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border dark:bg-slate-800 dark:border-slate-900 border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Trophy size={30} />
        </div>

        <p className="mt-5 text-sm font-medium dark:text-white text-slate-500">
          Overall Score
        </p>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-5xl font-bold dark:text-slate-50/50 tracking-tight text-slate-900">
            {numericScore.toFixed(1)}
          </span>

          <span className="text-lg dark:text-slate-50/50 text-slate-400">
            /10
          </span>
        </div>

        <div className="mt-5 h-3 w-full max-w-xs overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(Math.max(numericScore * 10, 0), 100)}%`,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-blue-600"
          />
        </div>

        <div className="mt-6 grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl dark:bg-slate-700 dark:border-slate-800 bg-slate-50 p-3">
            <Target size={17} className="mx-auto text-slate-500" />
            <p className="mt-2 text-xs dark:text-white text-slate-500">
              Target Role
            </p>
            <p className="mt-1 truncate dark:text-slate-50/50 text-sm font-semibold text-slate-800">
              {targetRole || "—"}
            </p>
          </div>

          <div className="rounded-xl dark:bg-slate-700 dark:border-slate-800 bg-slate-50 p-3">
            <Award size={17} className="mx-auto text-slate-500" />
            <p className="mt-2 text-xs dark:text-white text-slate-500">
              Difficulty
            </p>
            <p className="mt-1 text-sm dark:text-slate-50/50 font-semibold text-slate-800">
              {difficulty || "—"}
            </p>
          </div>

          <div className="rounded-xl dark:bg-slate-700 dark:border-slate-800 bg-slate-50 p-3">
            <Trophy size={17} className="mx-auto text-slate-500" />
            <p className="mt-2 text-xs dark:text-white text-slate-500">
              Result
            </p>
            <p className="mt-1 text-sm dark:text-slate-50/50 font-semibold text-slate-800">
              Completed
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ScoreCard;
