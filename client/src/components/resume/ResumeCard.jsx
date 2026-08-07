import { FileText, Calendar, BadgeCheck, Download } from "lucide-react";

function ResumeCard({ resume }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-blue-100 p-3">
            <FileText className="text-blue-600" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">{resume.title}</h2>

            <p className="mt-1 text-slate-500">{resume.originalFileName}</p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Calendar size={16} />

                {new Date(resume.createdAt).toLocaleDateString()}
              </span>

              <span className="flex items-center gap-2">
                <BadgeCheck size={16} />

                {resume.status}
              </span>
            </div>
          </div>
        </div>

        <a
          href={resume.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          <Download size={18} />
          View Resume
        </a>
      </div>
    </div>
  );
}

export default ResumeCard;
