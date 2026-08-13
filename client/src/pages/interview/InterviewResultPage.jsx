import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LayoutDashboard, RotateCcw } from "lucide-react";

import { useInterviewEvaluation } from "../../hooks/queries/useInterviewEvaluation";

import Loader from "../../components/ui/Loader";
import ScoreCard from "../../components/interview/ScoreCard";
import FeedbackCard from "../../components/interview/FeedbackCard";
import StrengthsCard from "../../components/interview/StrengthsCard";
import QuestionEvaluationList from "../../components/interview/QuestionEvaluationList";

function InterviewResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } =
    useInterviewEvaluation(id);

  const result = data?.data;
  const interview = result?.interview;
  const evaluation = result?.evaluation;

  useEffect(() => {
    if (interview?.status && interview.status !== "completed") {
      navigate(`/interview/${id}`, { replace: true });
    }
  }, [interview?.status, id, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load your result
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error?.response?.data?.message ||
              "Something went wrong while loading the evaluation."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!interview || !evaluation) {
    return (
      <div className="flex min-h-[500px] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Evaluation not available
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The interview evaluation could not be found.
          </p>

          <Link
            to="/dashboard"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <LayoutDashboard size={17} />
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const score = evaluation.overallScore ?? interview.score;

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to={`/interview/${id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Interview Details
            </Link>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Interview Results
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {interview.targetRole} · {interview.difficulty}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <Link
              to="/interview/generate"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <RotateCcw size={16} />
              New Interview
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <ScoreCard
            score={score}
            targetRole={interview.targetRole}
            difficulty={interview.difficulty}
          />

          <FeedbackCard feedback={evaluation.overallFeedback} />

          <StrengthsCard
            strengths={evaluation.strengths}
            weaknesses={evaluation.weaknesses}
          />

          <QuestionEvaluationList
            questionEvaluations={evaluation.questionEvaluations}
          />
        </div>
      </div>
    </div>
  );
}

export default InterviewResultPage;
