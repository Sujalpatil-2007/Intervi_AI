import clsx from "clsx";

function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}

      <input
        className={clsx(
          "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition",
          "focus:border-blue-500",
          error && "border-red-500",
          className,
        )}
        {...props}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

export default Input;
