function ResumeProjects({ projects = [] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Projects</h2>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 p-4"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {project.title}
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {project.description}
            </p>

            {project.technologies?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((technology, techIndex) => (
                  <span
                    key={techIndex}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeProjects;