import clsx from "clsx";

function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className={clsx(
        "flex w-full items-center justify-center rounded-lg px-4 py-3 font-medium transition",
        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",

          "border border-slate-300 bg-white hover:bg-slate-100":
            variant === "outline",

          "cursor-not-allowed opacity-60": loading,
        },
        className,
      )}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
