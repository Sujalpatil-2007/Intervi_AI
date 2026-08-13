import { CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function StrengthsCard({ strengths = [], weaknesses = [] }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <motion.section
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">Strengths</h2>

            <p className="text-xs text-slate-500">
              Areas where you performed well
            </p>
          </div>
        </div>

        {strengths.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {strengths.map((strength, index) => (
              <li
                key={`${strength}-${index}`}
                className="flex gap-3 text-sm leading-6 text-slate-600"
              >
                <CheckCircle2
                  size={17}
                  className="mt-1 shrink-0 text-emerald-500"
                />

                <span>{strength}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm text-slate-500">
            No specific strengths were provided.
          </p>
        )}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertCircle size={20} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">Areas to Improve</h2>

            <p className="text-xs text-slate-500">
              Focus areas for your next interview
            </p>
          </div>
        </div>

        {weaknesses.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {weaknesses.map((weakness, index) => (
              <li
                key={`${weakness}-${index}`}
                className="flex gap-3 text-sm leading-6 text-slate-600"
              >
                <AlertCircle
                  size={17}
                  className="mt-1 shrink-0 text-amber-500"
                />

                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm text-slate-500">
            No specific weaknesses were provided.
          </p>
        )}
      </motion.section>
    </div>
  );
}

export default StrengthsCard;
