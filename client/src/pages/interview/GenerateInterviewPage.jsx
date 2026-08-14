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
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="mt-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Sparkles size={27} />
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              Generate AI Interview
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
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