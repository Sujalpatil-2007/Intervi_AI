import { motion } from "framer-motion";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  HelpCircle,
  Play,
  Target,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useInterview } from "../../hooks/queries/useInterview";
import { useStartInterview } from "../../hooks/mutations/useStartInterview";

import Loader from "../../components/ui/Loader";

function InterviewDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useInterview(id);

  const { mutate: startInterview, isPending: isStarting } = useStartInterview();

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-100 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <BrainCircuit size={22} />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Unable to load interview
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error?.response?.data?.message ||
              "Something went wrong while loading this interview."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const interviewData = data?.data;
  const interview = interviewData?.interview;
  const questions = interviewData?.questions || [];

  if (!interview) {
    return (
      <div className="flex min-h-100 items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Interview not found
          </h2>

          <Link
            to="/dashboard"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const status = interview.status;

  const isPending = status === "pending";
  const isInProgress = status === "in_progress";
  const isCompleted = status === "completed";
  const isCancelled = status === "cancelled";

  const handleStart = () => {
    if (!id || !isPending || isStarting) {
      return;
    }

    startInterview(id, {
      onSuccess: () => {
        navigate(`/interview/${id}/session`);
      },
    });
  };

  return (
    <div className="min-h-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-linear-to-br from-blue-50 via-white to-purple-50 p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                    <BrainCircuit size={27} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        {interview.targetRole}
                      </h1>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isPending
                            ? "bg-amber-100 text-amber-700"
                            : isInProgress
                              ? "bg-blue-100 text-blue-700"
                              : isCompleted
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Personalized AI mock interview
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <InfoCard
                  icon={Target}
                  label="Difficulty"
                  value={interview.difficulty}
                />

                <InfoCard
                  icon={Clock3}
                  label="Duration"
                  value={`${interview.duration} minutes`}
                />

                <InfoCard
                  icon={HelpCircle}
                  label="Questions"
                  value={`${interview.totalQuestions || questions.length}`}
                />
              </div>

              <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="font-semibold text-slate-900">
                  Before you begin
                </h2>

                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    Answer each question as clearly as possible.
                  </li>

                  <li className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    Your answers are saved as you progress.
                  </li>

                  <li className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    Complete the interview before requesting AI evaluation.
                  </li>
                </ul>
              </div>

              {isPending && (
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={isStarting}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isStarting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Starting Interview...
                    </>
                  ) : (
                    <>
                      <Play size={19} />
                      Start Interview
                    </>
                  )}
                </button>
              )}

              {isInProgress && (
                <button
                  type="button"
                  onClick={() => navigate(`/interview/${id}/session`)}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Play size={19} />
                  Continue Interview
                </button>
              )}

              {isCompleted && (
                <button
                  type="button"
                  onClick={() => navigate(`/interview/${id}/result`)}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <CheckCircle2 size={19} />
                  View Result
                </button>
              )}

              {isCancelled && (
                <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
                  This interview has been cancelled and cannot be started.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={17} />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default InterviewDetailsPage;
