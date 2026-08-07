import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

import Button from "../ui/Button";

function DeleteResumeDialog({ open, loading, onClose, onConfirm }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-resume-title"
          aria-describedby="delete-resume-description"
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            y: 20,
          }}
          transition={{
            duration: 0.2,
          }}
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={30} className="text-red-600" />
          </div>

          <h2
            id="delete-resume-title"
            className="mt-5 text-center text-2xl font-bold text-slate-900"
          >
            Delete Resume?
          </h2>

          <p
            id="delete-resume-description"
            className="mt-3 text-center text-slate-600"
          >
            This action will permanently remove your uploaded resume, extracted
            information, and AI analysis.
          </p>

          <p className="mt-2 text-center text-sm text-red-500">
            This action cannot be undone.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
            <Button
              loading={loading}
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Resume
            </Button>

            <Button variant="outline" disabled={loading} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DeleteResumeDialog;
