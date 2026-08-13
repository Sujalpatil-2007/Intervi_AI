import { ChevronDown, MessageCircleWarning } from "lucide-react";
import { useState } from "react";

function QuestionEvaluationList({ questionEvaluations = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (questionEvaluations.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Question-by-Question Review
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Review your performance on every question.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {questionEvaluations.map((item, index) => {
          const score = Number(item.score || 0);
          const isOpen = openIndex === index;

          return (
            <div
              key={`${item.question}-${index}`}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-slate-50"
                aria-expanded={isOpen}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                  {index + 1}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900 sm:whitespace-normal">
                    {item.question}
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    {item.category}
                  </span>
                </span>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                    score >= 7
                      ? "bg-emerald-50 text-emerald-700"
                      : score >= 4
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                  }`}
                >
                  {score}/10
                </span>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-slate-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-slate-200 bg-slate-50 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Feedback
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.feedback || "No feedback provided."}
                    </p>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center gap-2">
                      <MessageCircleWarning
                        size={16}
                        className="text-blue-600"
                      />

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Improvement
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.improvement ||
                        "No specific improvement was provided."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default QuestionEvaluationList;
