function InterviewProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
}) {
  const progress =
    totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Interview Progress
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Question {currentQuestion} of {totalQuestions}
          </p>
        </div>

        <span className="text-sm font-semibold text-blue-600">
          {progress}%
        </span>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default InterviewProgress;
