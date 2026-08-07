function ResumeExperience({ experience = [] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Experience</h2>

      <div className="space-y-4">
        {experience.map((item, index) => (
          <div key={index} className="rounded-lg border border-slate-200 p-4">
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeExperience;
