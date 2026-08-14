import { motion } from "framer-motion";
import { CheckCircle2, Code2 } from "lucide-react";

function QuestionCard({ question, answer, onAnswerChange, disabled = false }) {
  return (
    <motion.div
      key={question._id}
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <Code2 size={14} />
          {question.type}
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {question.difficulty}
        </span>
      </div>

      <h1 className="mt-6 text-xl font-semibold leading-8 text-slate-900 sm:text-2xl">
        {question.question}
      </h1>

      <div className="mt-8">
        <label
          htmlFor={`answer-${question._id}`}
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Your Answer
        </label>

        <textarea
          id={`answer-${question._id}`}
          value={answer}
          onChange={(event) => onAnswerChange(event.target.value)}
          disabled={disabled}
          rows={9}
          placeholder="Explain your answer clearly. Include examples or implementation details where relevant..."
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{answer.trim().length} characters</span>

          {answer.trim() && (
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 size={14} />
              Answer entered
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default QuestionCard;
