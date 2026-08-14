import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  Send,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useInterview } from "../../hooks/queries/useInterview";
import { useSubmitAnswer } from "../../hooks/mutations/useSubmitAnswer";
import { useFinishInterview } from "../../hooks/mutations/useFinishInterview";

import InterviewProgress from "../../components/interview/InterviewProgress";
import QuestionCard from "../../components/interview/QuestionCard";
import Button from "../../components/ui/Button";

function InterviewSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useInterview(id);

  const submitAnswerMutation = useSubmitAnswer(id);
  const finishInterviewMutation = useFinishInterview(id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const questionStartedAtRef = useRef(Date.now());

  const interview = data?.data?.interview;
  const questions = useMemo(() => data?.data?.questions || [], [data]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    questionStartedAtRef.current = Date.now();
  }, [currentIndex]);

  const answeredQuestions = useMemo(() => {
    return questions.filter(
      (question) =>
        typeof answers[question._id] === "string" &&
        answers[question._id].trim().length > 0,
    ).length;
  }, [answers, questions]);

  const currentAnswer = currentQuestion
    ? answers[currentQuestion._id] || ""
    : "";

  const isSubmitting = submitAnswerMutation.isPending;
  const isFinishing = finishInterviewMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={22} />
          <span>Loading interview session...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertTriangle size={30} className="mx-auto text-red-500" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load interview
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't load your interview session.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  if (interview.status === "completed") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 size={42} className="mx-auto text-emerald-500" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Interview Already Completed
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This interview has already been submitted.
          </p>

          <div className="mt-6">
            <Button
              type="button"
              onClick={() => navigate(`/interview/${id}/result`)}
            >
              View Result
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertTriangle size={32} className="mx-auto text-amber-500" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            No Questions Available
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This interview does not contain any questions.
          </p>
        </div>
      </div>
    );
  }

  const updateAnswer = (value) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion._id]: value,
    }));
  };

  const handleSubmitCurrentAnswer = async () => {
    const answer = currentAnswer.trim();

    if (!answer) {
      return;
    }

    const timeTaken = Math.max(
      0,
      Math.round((Date.now() - questionStartedAtRef.current) / 1000),
    );

    try {
      await submitAnswerMutation.mutateAsync({
        questionId: currentQuestion._id,
        answer,
        timeTaken,
      });

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((previous) => previous + 1);
      }
    } catch {
      // Error toast is handled by the mutation.
    }
  };

  const handlePrevious = () => {
    if (currentIndex === 0 || isSubmitting || isFinishing) {
      return;
    }

    setCurrentIndex((previous) => previous - 1);
  };

  const handleFinish = async () => {
    const answer = currentAnswer.trim();

    /*
     * Save the current answer first when the candidate has
     * entered one. This prevents the final answer from being
     * skipped when Finish is clicked directly.
     */
    if (answer) {
      const timeTaken = Math.max(
        0,
        Math.round((Date.now() - questionStartedAtRef.current) / 1000),
      );

      try {
        await submitAnswerMutation.mutateAsync({
          questionId: currentQuestion._id,
          answer,
          timeTaken,
        });
      } catch {
        return;
      }
    }

    try {
      await finishInterviewMutation.mutateAsync();

      navigate(`/interview/${id}/result`);
    } catch {
      // Error toast is handled by the mutation.
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  const hasCurrentAnswer = currentAnswer.trim().length > 0;

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate(`/interview/${id}`)}
            disabled={isSubmitting || isFinishing}
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={16} />
            Exit Interview
          </button>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Clock3 size={17} />
            {interview.duration} minutes
          </div>
        </div>

        {/* Progress */}

        <InterviewProgress
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          answeredQuestions={answeredQuestions}
        />

        {/* Question */}

        <div className="mt-6">
          <QuestionCard
            question={currentQuestion}
            answer={currentAnswer}
            onAnswerChange={updateAnswer}
            disabled={isSubmitting || isFinishing}
          />
        </div>

        {/* Navigation */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isSubmitting || isFinishing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={17} />
            Previous
          </button>

          {!isLastQuestion ? (
            <Button
              type="button"
              onClick={handleSubmitCurrentAnswer}
              loading={isSubmitting}
              disabled={!hasCurrentAnswer}
              className="sm:w-auto"
            >
              Save & Next
              <ArrowRight size={17} className="ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinish}
              loading={isSubmitting || isFinishing}
              disabled={!hasCurrentAnswer}
              className="sm:w-auto"
            >
              {isFinishing ? (
                "Finishing..."
              ) : (
                <>
                  Finish Interview
                  <Send size={17} className="ml-2" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Answer status */}

        <div className="mt-5 flex justify-center">
          <p className="inline-flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 size={14} />
            Your answers are saved as you progress.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InterviewSessionPage;
