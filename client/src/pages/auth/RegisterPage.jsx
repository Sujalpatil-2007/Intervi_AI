import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Loader2,
  Moon,
  Sun,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      toast.success(response?.data?.message || "Account created successfully.");

      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-100 dark:placeholder:text-slate-500";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

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

        {/* Registration */}
        <div className="flex items-center justify-center py-10 sm:py-12">
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
                  Create your account
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Start preparing for your interviews with InterviAI.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="fullName" className={labelClass}>
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={loading}
                    autoComplete="name"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={loading}
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    disabled={loading}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className={inputClass}
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    Use at least 6 characters.
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    disabled={loading}
                    autoComplete="new-password"
                    required
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 border-t border-slate-100 dark:border-slate-700" />

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
                >
                  Sign in
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

export default RegisterPage;
