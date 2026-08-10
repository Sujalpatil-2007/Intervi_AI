import { useState } from "react";
import { BadgeCheck, Calendar, Download, FileText, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import Button from "../ui/Button";
import DeleteResumeDialog from "./DeleteResumeDialog";
import { useDeleteResume } from "../../hooks/mutations/useDeleteResume";

function ResumeCard({ resume }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteResumeMutation = useDeleteResume();

  const handleDeleteClick = () => {
    if (deleteResumeMutation.isPending) {
      return;
    }

    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (deleteResumeMutation.isPending) {
      return;
    }

    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteResumeMutation.mutate(undefined, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const formattedDate = resume?.createdAt
    ? new Date(resume.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={24} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-slate-900">
                {resume?.title || "My Resume"}
              </h2>

              <p
                className="mt-1 truncate text-sm text-slate-500"
                title={resume?.originalFileName}
              >
                {resume?.originalFileName || "Resume file"}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {formattedDate}
                </span>

                <span className="flex items-center gap-2 capitalize">
                  <BadgeCheck size={16} />
                  {resume?.status || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-44">
            {resume?.fileUrl && (
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Download size={18} />
                View Resume
              </a>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleDeleteClick}
              disabled={deleteResumeMutation.isPending}
              className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
            >
              <Trash2 size={18} />
              Delete Resume
            </Button>
          </div>
        </div>
      </motion.div>

      <DeleteResumeDialog
        open={isDeleteDialogOpen}
        loading={deleteResumeMutation.isPending}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default ResumeCard;
