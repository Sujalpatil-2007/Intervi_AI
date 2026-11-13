import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <SearchX size={40} strokeWidth={1.8} />
        </div>

        {/* 404 */}
        <p className="mt-8 text-7xl font-extrabold tracking-tight text-blue-600 sm:text-8xl">
          404
        </p>

        {/* Heading */}
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          The page you're looking for doesn't exist, has been moved, or is no
          longer available.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Home size={17} />
            Dashboard
          </Link>
        </div>

        {/* Branding */}
        <div className="mt-12">
          <p className="text-lg font-bold text-slate-900">InterviAI</p>
          <p className="mt-1 text-xs text-slate-400">
            AI-powered mock interviews
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
