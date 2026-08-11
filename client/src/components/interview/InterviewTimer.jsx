import { Clock3 } from "lucide-react";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

function InterviewTimer({ remainingSeconds }) {
  const isWarning = remainingSeconds <= 60;
  const isCritical = remainingSeconds <= 30;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 ${
        isCritical
          ? "border-red-200 bg-red-50 text-red-700"
          : isWarning
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : "border-slate-200 bg-white text-slate-700"
      }`}
      aria-label={`Time remaining ${formatTime(remainingSeconds)}`}
    >
      <Clock3 size={18} />

      <div>
        <p className="text-[10px] font-medium uppercase tracking-wide opacity-70">
          Time Remaining
        </p>

        <p className="font-mono text-sm font-bold">
          {formatTime(Math.max(0, remainingSeconds))}
        </p>
      </div>
    </div>
  );
}

export default InterviewTimer;
