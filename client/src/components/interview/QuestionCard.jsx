import { motion } from "framer-motion";
import { CheckCircle2, Code2, HelpCircle } from "lucide-react";

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswerChange,
  disabled = false,
}) {
  if (!question) {
    return null;
  }

  const typeLabel = question.type || "Technical";

  return (
    <motion.div
      key={question._id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <HelpCircle size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold text-blue-600">
              Question {questionNumber} of {totalQuestions}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {typeLabel}
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          <Code2 size={14} />
          {question.difficulty}
        </span>
      </div>

      <div className="mt-7">
        <h2 className="text-lg font-semibold leading-8 text-slate-900 sm:text-xl">
          {question.question}
        </h2>
      </div>

      <div className="mt-7">
        <label
          htmlFor={`answer-${question._id}`}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Your Answer
        </label>

        <textarea
          id={`answer-${question._id}`}
          value={answer}
          onChange={(event) => onAnswerChange(event.target.value)}
          disabled={disabled}
          placeholder="Type your answer here..."
          rows={9}
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />

        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>
            Explain your approach clearly and provide examples when
            relevant.
          </span>

          <span>{answer.length} characters</span>
        </div>
      </div>

      {answer.trim() && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600">
          <CheckCircle2 size={15} />
          Answer entered
        </div>
      )}
    </motion.div>
  );
}

export default QuestionCard;
