import { Briefcase, Clock, Target, CheckCircle } from "lucide-react";

function InterviewInfoCard({ interview }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Interview Information</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center gap-3">
          <Briefcase size={18} />
          <span>{interview.targetRole}</span>
        </div>

        <div className="flex items-center gap-3">
          <Target size={18} />
          <span>{interview.difficulty}</span>
        </div>

        <div className="flex items-center gap-3">
          <Clock size={18} />
          <span>{interview.duration} Minutes</span>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle size={18} />
          <span>{interview.status}</span>
        </div>
      </div>
    </div>
  );
}

export default InterviewInfoCard;
