import { Link } from "react-router-dom";
import { FilePlus } from "lucide-react";

import { useMyResume } from "../../hooks/queries/useMyResume";

import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

import ResumeCard from "../../components/resume/ResumeCard";
import ResumeSkills from "../../components/resume/ResumeSkills";
import ResumeProjects from "../../components/resume/ResumeProjects";
import ResumeExperience from "../../components/resume/ResumeExperience";
import ResumeEducation from "../../components/resume/ResumeEducation";

function MyResumePage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyResume();

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <h2 className="text-xl font-semibold text-slate-900">
            Unable to load your resume
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong while loading your resume."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const resume = data?.resume;

  if (!resume) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          title="No Resume Found"
          description="Upload your resume to unlock AI-powered interview generation."
          action={
            <Link
              to="/resume/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FilePlus size={18} />
              Upload Resume
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Resume
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Review your resume information and AI-powered insights.
        </p>
      </div>

      <ResumeCard resume={resume} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ResumeSkills skills={resume.parsedSkills} />

        <ResumeProjects projects={resume.parsedProjects} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ResumeExperience experience={resume.parsedExperience} />

        <ResumeEducation education={resume.parsedEducation} />
      </div>
    </div>
  );
}

export default MyResumePage;
