import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Clock3,
  HelpCircle,
  Sparkles,
  Target,
} from "lucide-react";

import { useGenerateInterview } from "../../hooks/mutations/useGenerateInterview";

function GenerateInterviewPage() {
  const navigate = useNavigate();

  const {
    mutate: generateInterview,
    isPending,
    isError,
    error,
  } = useGenerateInterview();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      targetRole: "",
      difficulty: "Medium",
      duration: 20,
      questionCount: 10,
    },
  });

  const duration = watch("duration");
  const questionCount = watch("questionCount");

  useEffect(() => {
    document.title = "Generate Interview | InterviAI";

    return () => {
      document.title = "InterviAI";
    };
  }, []);

  const onSubmit = (formData) => {
    const payload = {
      targetRole: formData.targetRole.trim(),
      difficulty: formData.difficulty,
      duration: Number(formData.duration),
      questionCount: Number(formData.questionCount),
    };

    generateInterview(payload, {
      onSuccess: (response) => {
        const interviewId = response?.data?.interviewId;

        if (interviewId) {
          navigate(`/interview/${interviewId}`);
        }
      },
    });
  };

  return (
    <div className="min-h-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
              <Sparkles size={16} />
              AI-Powered Interview
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Generate Mock Interview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Create a personalized mock interview based on your resume,
              target role, difficulty, and preferred interview length.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Target size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Interview Configuration
                    </h2>

                    <p className="text-sm text-slate-500">
                      Customize your interview before generating it.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <label
                      htmlFor="targetRole"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Target Role
                    </label>

                    <input
                      id="targetRole"
                      type="text"
                      placeholder="e.g. Frontend Developer Intern"
                      autoComplete="off"
                      {...register("targetRole", {
                        required: "Target role is required.",
                        validate: (value) =>
                          value.trim().length >= 2 ||
                          "Target role must contain at least 2 characters.",
                      })}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.targetRole
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    />

                    {errors.targetRole && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.targetRole.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="difficulty"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Difficulty
                    </label>

                    <select
                      id="difficulty"
                      {...register("difficulty", {
                        required: "Difficulty is required.",
                      })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="duration"
                        className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
                      >
                        <Clock3 size={16} />
                        Duration
                      </label>

                      <select
                        id="duration"
                        {...register("duration", {
                          required: "Duration is required.",
                          valueAsNumber: true,
                          validate: (value) =>
                            [10, 15, 20, 30, 45, 60].includes(value) ||
                            "Please select a valid duration.",
                        })}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={20}>20 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes</option>
                      </select>

                      {errors.duration && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.duration.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="questionCount"
                        className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
                      >
                        <HelpCircle size={16} />
                        Questions
                      </label>

                      <select
                        id="questionCount"
                        {...register("questionCount", {
                          required: "Question count is required.",
                          valueAsNumber: true,
                          validate: (value) =>
                            [5, 10, 15, 20].includes(value) ||
                            "Please select a valid question count.",
                        })}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value={5}>5 questions</option>
                        <option value={10}>10 questions</option>
                        <option value={15}>15 questions</option>
                        <option value={20}>20 questions</option>
                      </select>

                      {errors.questionCount && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.questionCount.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 sm:p-8">
                <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Role
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                      {watch("targetRole") || "Not selected"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Duration
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {duration} minutes
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Questions
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {questionCount}
                    </p>
                  </div>
                </div>

                {isError && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error?.response?.data?.message ||
                      "Unable to generate the interview. Please try again."}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating Interview...
                    </>
                  ) : (
                    <>
                      <BrainCircuit size={19} />
                      Generate Interview
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-slate-500">
                  Your interview will be generated using the information
                  available in your uploaded resume.
                </p>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default GenerateInterviewPage;