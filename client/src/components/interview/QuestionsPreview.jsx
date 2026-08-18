function QuestionsPreview({ questions }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Questions Preview</h2>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question._id} className="rounded-lg border p-4">
            <p className="font-medium">
              Q{question.order}. {question.question}
            </p>

            <div className="mt-2 flex gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                {question.type}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                {question.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionsPreview;
