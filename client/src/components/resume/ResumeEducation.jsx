function ResumeEducation({ education = [] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Education</h2>

      <div className="space-y-4">
        {education.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 p-4"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {item.degree}
            </h3>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {item.institution}
            </p>

            {item.status && (
              <p className="mt-2 text-sm text-slate-600">
                {item.status}
              </p>
            )}

            {item.expectedGraduation && (
              <p className="mt-1 text-sm text-slate-500">
                Expected Graduation: {item.expectedGraduation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeEducation;