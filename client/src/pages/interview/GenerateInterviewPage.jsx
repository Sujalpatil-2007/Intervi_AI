import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import GenerateInterviewForm from "../../components/interview/GenerateInterviewForm";
import { useGenerateInterview } from "../../hooks/mutations/useGenerateInterview";

function GenerateInterviewPage() {
  const navigate = useNavigate();

  const generateMutation = useGenerateInterview();

  const handleGenerateInterview = async (formData) => {
    try {
      const response = await generateMutation.mutateAsync(formData);

      const interviewId = response?.data?.interviewId;

      if (!interviewId) {
        throw new Error(
          "Interview was generated but no interview ID was returned.",
        );
      }

      navigate(`/interview/${interviewId}`);
    } catch {
      // Error toast is already handled by the mutation hook.
    }
  };

  return (
    <div className="min-h-full dark:bg-slate-900 bg-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Sparkles size={27} />
            </div>

            <h1 className="text-3xl dark:text-white font-bold tracking-tight text-slate-900">
              Generate AI Interview
            </h1>

            <p className="mx-auto mt- max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-50/50 sm:text-base">
              Create a personalized mock interview using your resume, target
              role, and selected difficulty.
            </p>
          </div>
        </motion.div>

        <div className="mt-8">
          <GenerateInterviewForm
            onSubmit={handleGenerateInterview}
            isSubmitting={generateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}

export default GenerateInterviewPage;
