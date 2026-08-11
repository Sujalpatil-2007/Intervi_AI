import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useInterview } from "../../hooks/queries/useInterview";
import { useSubmitAnswer } from "../../hooks/mutations/useSubmitAnswer";
import { useFinishInterview } from "../../hooks/mutations/useFinishInterview";

import Loader from "../../components/ui/Loader";
import QuestionCard from "../../components/interview/QuestionCard";
import InterviewProgress from "../../components/interview/InterviewProgress";
import InterviewTimer from "../../components/interview/InterviewTimer";
import FinishInterviewDialog from "../../components/interview/FinishInterviewDialog";

function InterviewSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useInterview(id);

  const { mutateAsync: submitAnswer, isPending: isSubmitting } =
    useSubmitAnswer();

  const { mutate: finishInterview, isPending: isFinishing } =
    useFinishInterview();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [submittedQuestionIds, setSubmittedQuestionIds] = useState(new Set());

  const interview = data?.data?.interview;
  const questions = useMemo(() => data?.data?.questions || [], [data]);

  const currentQuestion = questions[currentIndex];

  const answeredQuestions = useMemo(
    () =>
      questions.filter((question) => Boolean(answers[question._id]?.trim()))
        .length,
    [answers, questions],
  );

  const initializeTimer = useCallback(() => {
    if (!interview?.startedAt || !interview?.duration) {
      return;
    }

    const startTime = new Date(interview.startedAt).getTime();
    const durationSeconds = Number(interview.duration) * 60;
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

    setRemainingSeconds(Math.max(0, durationSeconds - elapsedSeconds));
  }, [interview]);

  useEffect(() => {
    initializeTimer();

    const interval = window.setInterval(() => {
      initializeTimer();
    }, 1000);

    return () => window.clearInterval(interval);
  }, [initializeTimer]);

  useEffect(() => {
    setQuestionStartedAt(Date.now());
  }, [currentIndex]);

  useEffect(() => {
    if (
      remainingSeconds !== 0 ||
      !interview ||
      interview.status !== "in_progress"
    ) {
      return;
    }

    toast.error("Your interview time has expired. Finishing the interview.");

    finishInterview(id, {
      onSuccess: () => {
        navigate(`/interview/${id}/result`);
      },
    });
  }, [remainingSeconds, interview, finishInterview, id, navigate]);

  useEffect(() => {
    if (interview?.status === "completed") {
      navigate(`/interview/${id}/result`, {
        replace: true,
      });
    }
  }, [interview?.status, id, navigate]);

  const updateAnswer = (value) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion._id]: value,
    }));
  };

  const saveCurrentAnswer = async () => {
    if (!currentQuestion) {
      return true;
    }

    const answer = answers[currentQuestion._id] || "";
    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) {
      toast.error("Please provide an answer before continuing.");
      return false;
    }

    if (submittedQuestionIds.has(currentQuestion._id)) {
      return true;
    }

    const timeTaken = Math.max(
      0,
      Math.floor((Date.now() - questionStartedAt) / 1000),
    );

    try {
      await submitAnswer({
        interviewId: id,
        questionId: currentQuestion._id,
        answer: trimmedAnswer,
        timeTaken,
      });

      setSubmittedQuestionIds((previous) => {
        const next = new Set(previous);
        next.add(currentQuestion._id);
        return next;
      });

      return true;
    } catch {
      return false;
    }
  };

  const handleNext = async () => {
    if (isSubmitting || !currentQuestion) {
      return;
    }

    const saved = await saveCurrentAnswer();

    if (!saved) {
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
      return;
    }

    setShowFinishDialog(true);
  };

  const handlePrevious = () => {
    if (currentIndex === 0 || isSubmitting) {
      return;
    }

    setCurrentIndex((previous) => previous - 1);
  };

  const handleFinish = async () => {
    setShowFinishDialog(false);

    const saved = await saveCurrentAnswer();

    if (!saved) {
      return;
    }

    finishInterview(id, {
      onSuccess: () => {
        navigate(`/interview/${id}/result`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-125 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load interview
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error?.response?.data?.message ||
              "Something went wrong while loading the interview."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!interview || questions.length === 0) {
    return (
      <div className="flex min-h-125 items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">
            No interview questions found
          </h2>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (interview.status !== "in_progress") {
    return (
      <div className="flex min-h-125 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Interview is not active
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This interview is currently{" "}
            <strong>{interview.status.replace("_", " ")}</strong>.
          </p>

          <button
            type="button"
            onClick={() => navigate(`/interview/${id}`)}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Interview
          </button>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(`/interview/${id}`)}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Interview Overview
            </button>

            <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              {interview.targetRole}
            </h1>
          </div>

          <InterviewTimer remainingSeconds={remainingSeconds} />
        </div>

        <InterviewProgress
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          answeredQuestions={answeredQuestions}
        />

        <motion.div
          key={currentQuestion._id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5"
        >
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            answer={answers[currentQuestion._id] || ""}
            onAnswerChange={updateAnswer}
            disabled={isSubmitting || isFinishing}
          />
        </motion.div>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={17} />
            Previous
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            {isLastQuestion ? (
              <button
                type="button"
                onClick={() => setShowFinishDialog(true)}
                disabled={isSubmitting || isFinishing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={17} />
                Finish Interview
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting || isFinishing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save & Next"}
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </div>
      </div>

      <FinishInterviewDialog
        open={showFinishDialog}
        answeredQuestions={answeredQuestions}
        totalQuestions={questions.length}
        isLoading={isSubmitting || isFinishing}
        onConfirm={handleFinish}
        onCancel={() => setShowFinishDialog(false)}
      />
    </div>
  );
}

export default InterviewSessionPage;
