function ResumeProjects({ projects = [] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Projects</h2>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="rounded-lg border border-slate-200 p-4">
            <p>{project}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeProjects;
