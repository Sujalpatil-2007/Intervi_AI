import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import ResumeDropzone from "./ResumeDropzone";
import UploadProgress from "./UploadProgress";

import { useUploadResume } from "../../hooks/mutations/useUploadResume";

function ResumeUploadCard() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [progress, setProgress] = useState(0);

  const { handleSubmit } = useForm();

  const uploadResumeMutation = useUploadResume();

  function handleFileChange(selectedFile, error) {
    setFile(selectedFile);
    setFileError(error || "");
  }

  async function onSubmit() {
    if (!file) {
      setFileError("Please select a resume.");

      return;
    }

    const formData = new FormData();

    formData.append("resume", file);

    uploadResumeMutation.mutate(
      {
        formData,

        onUploadProgress: (event) => {
          const percentage = Math.round((event.loaded * 100) / event.total);

          setProgress(percentage);
        },
      },
      {
        onSuccess: () => {
          navigate("/resume");
        },
      },
    );
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Upload Resume</h2>

        <p className="mt-2 text-slate-500">
          Upload your latest resume to generate AI-powered interviews.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ResumeDropzone
          value={file}
          error={fileError}
          onChange={handleFileChange}
        />

        {uploadResumeMutation.isPending && (
          <UploadProgress progress={progress} />
        )}

        <button
          type="submit"
          disabled={uploadResumeMutation.isPending}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {uploadResumeMutation.isPending ? "Uploading..." : "Upload Resume"}
        </button>
      </form>
    </div>
  );
}

export default ResumeUploadCard;
