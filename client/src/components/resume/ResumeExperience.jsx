function ResumeExperience({ experience = [] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold text-slate-900">
        Experience
      </h2>

      {experience.length === 0 ? (
        <p className="text-sm text-slate-500">
          No experience information available.
        </p>
      ) : (
        <div className="space-y-4">
          {experience.map((item, index) => (
            <div
              key={item?._id || index}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-medium text-slate-900">
                {item?.company || "Company not specified"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResumeExperience;