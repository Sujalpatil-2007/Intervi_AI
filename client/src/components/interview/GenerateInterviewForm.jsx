import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { BrainCircuit, Clock3, Layers3, Sparkles } from "lucide-react";

import Button from "../ui/Button";

const difficultyOptions = [
  {
    value: "Easy",
    label: "Easy",
    description: "Fundamental concepts and straightforward questions.",
  },
  {
    value: "Medium",
    label: "Medium",
    description: "Practical concepts with moderate technical depth.",
  },
  {
    value: "Hard",
    label: "Hard",
    description: "Advanced concepts and deeper problem solving.",
  },
];

const durationOptions = [15, 20, 30, 45, 60];

const questionOptions = [3, 5, 7, 10, 15];

function GenerateInterviewForm({ onSubmit, isSubmitting = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      targetRole: "",
      difficulty: "Medium",
      duration: 30,
      questionCount: 5,
    },
  });

  const submitHandler = (values) => {
    onSubmit({
      targetRole: values.targetRole.trim(),
      difficulty: values.difficulty,
      duration: Number(values.duration),
      questionCount: Number(values.questionCount),
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BrainCircuit size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Configure Your Interview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              AI will generate questions based on your uploaded resume.
            </p>
          </div>
        </div>
      </div>

      {/* Target Role */}

      <div>
        <label
          htmlFor="targetRole"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Target Role
        </label>

        <input
          id="targetRole"
          type="text"
          placeholder="e.g. Frontend Developer"
          disabled={isSubmitting}
          {...register("targetRole", {
            required: "Target role is required.",
            minLength: {
              value: 2,
              message: "Target role must be at least 2 characters.",
            },
            maxLength: {
              value: 100,
              message: "Target role must not exceed 100 characters.",
            },
          })}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />

        {errors.targetRole && (
          <p className="mt-2 text-sm text-red-600">
            {errors.targetRole.message}
          </p>
        )}
      </div>

      {/* Difficulty */}

      <div>
        <div className="mb-3">
          <label className="block text-sm font-semibold text-slate-700">
            Difficulty
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Choose the technical difficulty of your interview.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {difficultyOptions.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                value={option.value}
                disabled={isSubmitting}
                {...register("difficulty", {
                  required: "Difficulty is required.",
                })}
                className="peer sr-only"
              />

              <div className="h-full rounded-xl border border-slate-200 p-4 transition peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-slate-300">
                <p className="font-semibold text-slate-900">{option.label}</p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {option.description}
                </p>
              </div>
            </label>
          ))}
        </div>

        {errors.difficulty && (
          <p className="mt-2 text-sm text-red-600">
            {errors.difficulty.message}
          </p>
        )}
      </div>

      {/* Duration */}

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Clock3 size={17} className="text-slate-500" />

          <label
            htmlFor="duration"
            className="text-sm font-semibold text-slate-700"
          >
            Interview Duration
          </label>
        </div>

        <select
          id="duration"
          disabled={isSubmitting}
          {...register("duration", {
            required: "Duration is required.",
          })}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          {durationOptions.map((duration) => (
            <option key={duration} value={duration}>
              {duration} minutes
            </option>
          ))}
        </select>

        {errors.duration && (
          <p className="mt-2 text-sm text-red-600">{errors.duration.message}</p>
        )}
      </div>

      {/* Questions */}

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Layers3 size={17} className="text-slate-500" />

          <label
            htmlFor="questionCount"
            className="text-sm font-semibold text-slate-700"
          >
            Number of Questions
          </label>
        </div>

        <select
          id="questionCount"
          disabled={isSubmitting}
          {...register("questionCount", {
            required: "Question count is required.",
          })}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          {questionOptions.map((count) => (
            <option key={count} value={count}>
              {count} questions
            </option>
          ))}
        </select>

        {errors.questionCount && (
          <p className="mt-2 text-sm text-red-600">
            {errors.questionCount.message}
          </p>
        )}
      </div>

      {/* Info */}

      <div className="flex gap-3 rounded-xl bg-blue-50 p-4">
        <Sparkles size={18} className="mt-0.5 shrink-0 text-blue-600" />

        <p className="text-sm leading-6 text-blue-800">
          Your latest analyzed resume will automatically be used to personalize
          the interview questions.
        </p>
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        {isSubmitting ? "Generating Interview..." : "Generate Interview"}
      </Button>
    </motion.form>
  );
}

export default GenerateInterviewForm;
