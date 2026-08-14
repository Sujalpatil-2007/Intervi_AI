import { CheckCircle2 } from "lucide-react";

function InterviewProgress({
  currentIndex,
  totalQuestions,
  answeredQuestions,
}) {
  const currentNumber = currentIndex + 1;
  const progress =
    totalQuestions > 0 ? (currentNumber / totalQuestions) * 100 : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Question {currentNumber} of {totalQuestions}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {answeredQuestions} of {totalQuestions} answered
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <CheckCircle2 size={17} />
          {Math.round(progress)}%
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default InterviewProgress;
