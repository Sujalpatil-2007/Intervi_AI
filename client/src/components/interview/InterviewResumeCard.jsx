function InterviewResumeCard({ resume }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Resume Used</h2>

      <h3 className="font-medium">{resume.title}</h3>

      <p className="mt-1 text-sm text-slate-500">{resume.originalFileName}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {resume.parsedSkills?.slice(0, 8).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default InterviewResumeCard;
