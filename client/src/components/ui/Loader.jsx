import { Loader2 } from "lucide-react";

function Loader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="flex items-center gap-3 text-slate-500">
        <Loader2 size={22} className="animate-spin text-blue-600" />

        <span className="text-sm font-medium">{text}</span>
      </div>
    </div>
  );
}

export default Loader;
