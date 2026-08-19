import { Inbox } from "lucide-react";

function EmptyState({
  title = "Nothing here yet",
  message = "There is nothing to display.",
  action = null,
}) {
  return (
    <div className="flex min-h-60 items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <Inbox size={24} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>

        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

export default EmptyState;
