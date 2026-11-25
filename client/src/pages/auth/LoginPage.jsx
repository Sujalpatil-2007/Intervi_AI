import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BrainCircuit, Moon, Sun } from "lucide-react";

import LoginForm from "../../components/auth/LoginForm";
import { useTheme } from "../../context/ThemeContext";

function LoginPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen bg-[#F6F8FB] px-5 py-6 text-slate-900 transition-colors duration-200 dark:bg-[#0B1120] dark:text-slate-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <BrainCircuit size={23} />
            </div>

            <span className="text-xl font-extrabold tracking-tight">
              Intervi<span className="text-blue-600">AI</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-400 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200"
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </header>

        {/* Login */}
        <div className="flex min-h-[calc(100vh-110px)] items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-300/20 sm:p-9 dark:border-slate-700 dark:bg-[#111A2E] dark:shadow-black/20">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-[#16233F] dark:text-blue-400">
                  <BrainCircuit size={28} />
                </div>

                <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
                  Welcome back
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Sign in to continue your interview preparation journey.
                </p>
              </div>

              <div className="mt-8">
                <LoginForm />
              </div>

              <div className="my-7 border-t border-slate-100 dark:border-slate-700" />

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <Link
              to="/"
              className="mx-auto mt-6 flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              <ArrowLeft size={16} />
              Back to homepage
            </Link>
          </motion.div>
        </div>

        <footer className="pb-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} InterviAI. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

export default LoginPage;
