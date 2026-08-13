import { MessageSquareText } from "lucide-react";
import { motion } from "framer-motion";

function FeedbackCard({ feedback }) {
  if (!feedback) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <MessageSquareText size={20} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">Overall Feedback</h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">{feedback}</p>
        </div>
      </div>
    </motion.section>
  );
}

export default FeedbackCard;
