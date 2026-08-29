import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  Code2,
  FileText,
  GraduationCap,
  Loader2,
  Sparkles,
  Trash2,
  Trophy,
  Upload,
} from "lucide-react";

import { useMyResume } from "../../hooks/queries/useMyResume";
import { useDeleteResume } from "../../hooks/mutations/useDeleteResume";

function ResumeDetailsPage() {
  const { data, isLoading, isError, refetch } = useMyResume();
  const deleteResumeMutation = useDeleteResume();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /*
   * Supports both common response structures:
   *
   * {
   *   data: {
   *     resume: {...}
   *   }
   * }
   *
   * and:
   *
   * {
   *   data: {...resume}
   * }
   */
  const resume = data?.data?.resume || data?.data;

  const aiAnalysis = resume?.aiAnalysis;

  const skills = Array.isArray(aiAnalysis?.skills) ? aiAnalysis.skills : [];

  const strengths = Array.isArray(aiAnalysis?.strengths)
    ? aiAnalysis.strengths
    : [];

  const weaknesses = Array.isArray(aiAnalysis?.weaknesses)
    ? aiAnalysis.weaknesses
    : [];

  const experience = Array.isArray(aiAnalysis?.experience)
    ? aiAnalysis.experience
    : [];

  const education = Array.isArray(aiAnalysis?.education)
    ? aiAnalysis.education
    : [];

  const handleDelete = async () => {
    try {
      await deleteResumeMutation.mutateAsync();

      setShowDeleteConfirm(false);
    } catch {
      // Error toast is handled by useDeleteResume.
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={22} className="animate-spin" />

          <span>Loading your resume...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertTriangle size={36} className="mx-auto text-red-500" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load resume
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't load your resume details.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <FileText size={42} className="mx-auto text-slate-400" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            No Resume Found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Upload your resume to get AI-powered analysis and interview
            recommendations.
          </p>

          <Link
            to="/resume/upload"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Upload size={17} />
            Upload Resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              My Resume
            </Link>

            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Resume Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review your uploaded resume and AI analysis.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/resume/upload"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Upload size={16} />
              Upload New
            </Link>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteResumeMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete Resume
            </button>
          </div>
        </div>

        {/* Resume Overview */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileText size={28} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {resume.fileName || "Uploaded Resume"}
                </h2>

                {resume.createdAt && (
                  <p className="mt-1 text-sm text-slate-500">
                    Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={14} />
              Resume Uploaded
            </span>
          </div>
        </section>

        <div className="mt-6 space-y-6">
          {/* AI Summary */}

          {aiAnalysis?.summary && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <BrainCircuit size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    AI Resume Summary
                  </h2>

                  <p className="text-xs text-slate-500">
                    AI-generated overview of your resume
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {aiAnalysis.summary}
              </p>
            </section>
          )}

          {/* Skills */}

          {skills.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Code2 size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">Skills</h2>

                  <p className="text-xs text-slate-500">
                    Skills identified from your resume
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Strengths / Weaknesses */}

          {(strengths.length > 0 || weaknesses.length > 0) && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {strengths.length > 0 && (
                <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={20} />
                    </div>

                    <h2 className="font-bold text-slate-900">Strengths</h2>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {strengths.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex gap-3 text-sm leading-6 text-slate-600"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-1 shrink-0 text-emerald-500"
                        />

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {weaknesses.length > 0 && (
                <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <AlertTriangle size={20} />
                    </div>

                    <h2 className="font-bold text-slate-900">
                      Areas to Improve
                    </h2>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {weaknesses.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex gap-3 text-sm leading-6 text-slate-600"
                      >
                        <AlertTriangle
                          size={16}
                          className="mt-1 shrink-0 text-amber-500"
                        />

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {/* Experience */}

          {experience.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Briefcase size={20} />
                </div>

                <h2 className="text-lg font-bold text-slate-900">Experience</h2>
              </div>

              <div className="mt-5 space-y-4">
                {experience.map((item, index) => (
                  <div key={index} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm leading-6 text-slate-700">
                      {typeof item === "string"
                        ? item
                        : item?.description ||
                          item?.role ||
                          JSON.stringify(item)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}

          {education.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <GraduationCap size={20} />
                </div>

                <h2 className="text-lg font-bold text-slate-900">Education</h2>
              </div>

              <div className="mt-5 space-y-4">
                {education.map((item, index) => (
                  <div key={index} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm leading-6 text-slate-700">
                      {typeof item === "string"
                        ? item
                        : item?.degree ||
                          item?.institution ||
                          JSON.stringify(item)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* No AI Analysis */}

          {!aiAnalysis && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex gap-3">
                <Sparkles
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <div>
                  <h2 className="font-semibold text-slate-900">
                    AI Analysis Not Available
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Your resume was uploaded successfully, but AI analysis is
                    not currently available.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Extracted Text */}

          {resume.extractedText && (
            <details className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <summary className="cursor-pointer p-6 text-sm font-semibold text-slate-700">
                View Extracted Resume Text
              </summary>

              <div className="border-t border-slate-200 p-6">
                <pre className="max-h-96 overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {resume.extractedText}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Delete Resume?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will permanently remove your uploaded resume and its stored
              data. This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteResumeMutation.isPending}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteResumeMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteResumeMutation.isPending && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Delete Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeDetailsPage;