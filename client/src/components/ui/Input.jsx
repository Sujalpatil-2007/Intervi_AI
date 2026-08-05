import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        ref={ref}
        className={clsx(
          "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition",
          "focus:border-blue-600 focus:ring-2 focus:ring-blue-200",
          error && "border-red-500 focus:ring-red-200",
          className,
        )}
        {...props}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
