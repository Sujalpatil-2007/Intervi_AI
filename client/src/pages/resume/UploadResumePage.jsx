import { motion } from "framer-motion";

import ResumeUploadCard from "../../components/resume/ResumeUploadCard";

function UploadResumePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        <h1 className="text-3xl font-bold text-slate-900">Upload Resume</h1>

        <p className="mt-2 text-slate-500">
          Upload your latest resume to receive AI-powered analysis, personalized
          interview questions, and performance insights.
        </p>
      </motion.div>

      <ResumeUploadCard />
    </div>
  );
}

export default UploadResumePage;
