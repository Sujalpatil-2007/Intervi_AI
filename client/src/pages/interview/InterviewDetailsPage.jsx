import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Play, RefreshCw } from "lucide-react";

import { useInterview } from "../../hooks/queries/useInterview";
import { useStartInterview } from "../../hooks/mutations/useStartInterview";

import InterviewDetailsCard from "../../components/interview/InterviewDetailsCard";
import Button from "../../components/ui/Button";

function InterviewDetailsPage() {
  console.log("InterviewDetailsPage RENDERED");
  const { id } = useParams();
  console.log("Interview ID:", id);
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useInterview(id);

  const startMutation = useStartInterview();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={22} />
          <span>Loading interview...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load interview
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't retrieve this interview. Please try again.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const interview = data?.data?.interview;

  console.log("FULL INTERVIEW API RESPONSE:", data);
  console.log("INTERVIEW:", interview);
  console.log("STATUS:", interview?.status);

  if (!interview) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Interview Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            This interview could not be found.
          </p>

          <Link
            to="/dashboard"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleStart = async () => {
    try {
      await startMutation.mutateAsync(id);

      navigate(`/interview/${id}/session`);
    } catch {
      // Error toast is handled by the mutation hook.
    }
  };

  const isPending = interview.status === "pending";
  const isInProgress = interview.status === "in_progress";
  const isCompleted = interview.status === "completed";
  const isCancelled = interview.status === "cancelled";

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mt-6">
          <InterviewDetailsCard interview={interview} />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {isPending && (
            <>
              <h2 className="text-lg font-bold text-slate-900">
                Ready when you are
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Once you start, the interview session will begin and you'll
                answer the generated questions.
              </p>

              <div className="mt-6 sm:max-w-xs">
                <Button
                  type="button"
                  loading={startMutation.isPending}
                  onClick={handleStart}
                >
                  <Play size={18} className="mr-2" />
                  Start Interview
                </Button>
              </div>
            </>
          )}

          {isInProgress && (
            <>
              <h2 className="text-lg font-bold text-slate-900">
                Interview in progress
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                You already started this interview. Continue your session to
                submit your answers.
              </p>

              <div className="mt-6 sm:max-w-xs">
                <Button
                  type="button"
                  onClick={() => navigate(`/interview/${id}/session`)}
                >
                  <Play size={18} className="mr-2" />
                  Continue Interview
                </Button>
              </div>
            </>
          )}

          {isCompleted && (
            <>
              <h2 className="text-lg font-bold text-slate-900">
                Interview Completed
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This interview has already been completed.
              </p>

              <div className="mt-6 sm:max-w-xs">
                <Button
                  type="button"
                  onClick={() => navigate(`/interview/${id}/result`)}
                >
                  View Result
                </Button>
              </div>
            </>
          )}

          {isCancelled && (
            <>
              <h2 className="text-lg font-bold text-slate-900">
                Interview Cancelled
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This interview is no longer available.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewDetailsPage;
