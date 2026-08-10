import {
  BrainCircuit,
  BriefcaseBusiness,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";

function AIAnalysisCard({ analysis }) {
  const skills = Array.isArray(analysis?.skills) ? analysis.skills : [];

  const projects = Array.isArray(analysis?.projects) ? analysis.projects : [];

  const experience = Array.isArray(analysis?.experience)
    ? analysis.experience
    : [];

  const education = Array.isArray(analysis?.education)
    ? analysis.education
    : [];

  const targetRoles = Array.isArray(analysis?.targetRoles)
    ? analysis.targetRoles
    : [];

  const hasAnalysis =
    skills.length > 0 ||
    projects.length > 0 ||
    experience.length > 0 ||
    education.length > 0 ||
    targetRoles.length > 0;

  if (!hasAnalysis) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <BrainCircuit size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              AI Resume Analysis
            </h2>

            <p className="text-sm text-slate-500">
              No AI analysis is available yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      aria-labelledby="ai-analysis-heading"
    >
      <div className="border-b border-slate-200 bg-linear-to-r from-blue-50 via-white to-purple-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <BrainCircuit size={25} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="ai-analysis-heading"
                className="text-xl font-bold text-slate-900"
              >
                AI Resume Analysis
              </h2>

              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                <Sparkles size={13} />
                AI Powered
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-600">
              A structured overview of the information extracted and analyzed
              from your resume.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl border border-slate-200 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Wrench size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Technical Skills
                </h3>

                <p className="text-xs text-slate-500">
                  {skills.length} skill{skills.length !== 1 ? "s" : ""} detected
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {targetRoles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-slate-200 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <BriefcaseBusiness size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Target Roles</h3>

                <p className="text-xs text-slate-500">
                  Roles matching your resume
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {targetRoles.map((role, index) => (
                <div
                  key={`${role}-${index}`}
                  className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3"
                >
                  <Lightbulb size={17} className="shrink-0 text-emerald-600" />

                  <span className="text-sm font-medium text-slate-700">
                    {role}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-slate-200 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <BriefcaseBusiness size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Projects</h3>

                <p className="text-xs text-slate-500">
                  {projects.length} project
                  {projects.length !== 1 ? "s" : ""} detected
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {projects.map((project, index) => (
                <div
                  key={project?._id || `${project?.title}-${index}`}
                  className="rounded-lg bg-slate-50 p-4"
                >
                  <h4 className="font-medium text-slate-900">
                    {project?.title || `Project ${index + 1}`}
                  </h4>

                  {project?.description && (
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {project.description}
                    </p>
                  )}

                  {Array.isArray(project?.technologies) &&
                    project.technologies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.technologies.map((technology, techIndex) => (
                          <span
                            key={`${technology}-${techIndex}`}
                            className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {education.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-slate-200 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <GraduationCap size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Education</h3>

                <p className="text-xs text-slate-500">
                  Education information detected
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {education.map((item, index) => (
                <div
                  key={item?._id || `${item?.institution}-${index}`}
                  className="rounded-lg bg-slate-50 p-4"
                >
                  <h4 className="font-medium text-slate-900">
                    {item?.degree || "Education"}
                  </h4>

                  {item?.institution && (
                    <p className="mt-1 text-sm text-slate-600">
                      {item.institution}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                    {item?.status && (
                      <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-slate-200">
                        {item.status}
                      </span>
                    )}

                    {item?.expectedGraduation && (
                      <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-slate-200">
                        Graduation: {item.expectedGraduation}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {experience.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-slate-200 p-5 lg:col-span-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                <BriefcaseBusiness size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Experience</h3>

                <p className="text-xs text-slate-500">
                  Professional experience detected
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {experience.map((item, index) => (
                <div
                  key={item?._id || `${item?.company}-${index}`}
                  className="rounded-lg bg-slate-50 p-4"
                >
                  <h4 className="font-medium text-slate-900">
                    {item?.role ||
                      item?.position ||
                      item?.title ||
                      "Experience"}
                  </h4>

                  {item?.company && (
                    <p className="mt-1 text-sm text-slate-600">
                      {item.company}
                    </p>
                  )}

                  {item?.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

export default AIAnalysisCard;
