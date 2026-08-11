import { AlertTriangle, X } from "lucide-react";

function FinishInterviewDialog({
  open,
  answeredQuestions,
  totalQuestions,
  isLoading,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  const unansweredQuestions = totalQuestions - answeredQuestions;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="finish-interview-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle size={22} />
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <h2
          id="finish-interview-title"
          className="mt-5 text-xl font-bold text-slate-900"
        >
          Finish Interview?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Are you sure you want to finish this interview? You won't be able to
          submit additional answers afterward.
        </p>

        {unansweredQuestions > 0 && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            You still have <strong>{unansweredQuestions}</strong> unanswered
            question
            {unansweredQuestions !== 1 ? "s" : ""}.
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Continue Interview
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Finishing..." : "Finish Interview"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinishInterviewDialog;
