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
  const { data, isLoading, isError } = useMyResume();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load resume"
        description="Please try again later."
      />
    );
  }

  const resume = data?.resume;

  if (!resume) {
    return (
      <EmptyState
        title="No Resume Found"
        description="Upload your resume to unlock AI-powered interview generation."
        action={
          <Link
            to="/resume/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            <FilePlus size={18} />
            Upload Resume
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
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
