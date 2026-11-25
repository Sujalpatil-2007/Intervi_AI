import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Moon,
  Sun,
  Target,
  Mic,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

function HomePage() {
  const { theme, toggleTheme } = useTheme();

  const steps = [
    {
      number: "01",
      title: "Upload your resume",
      description:
        "Upload your resume so InterviAI can understand your skills, projects, and experience.",
    },
    {
      number: "02",
      title: "Answer AI questions",
      description:
        "Practice realistic technical and role-specific interview questions generated for you.",
    },
    {
      number: "03",
      title: "Get detailed feedback",
      description:
        "Understand your strengths, improve weak answers, and track your interview performance.",
    },
  ];

  const benefits = [
    {
      icon: BrainCircuit,
      title: "AI-powered questions",
      description:
        "Practice relevant questions based on your selected role and experience.",
    },
    {
      icon: Target,
      title: "Improve your answers",
      description:
        "Understand where you need to improve with structured interview feedback.",
    },
    {
      icon: Mic,
      title: "Practice with confidence",
      description:
        "Prepare for real interviews by practising whenever and wherever you want.",
    },
    {
      icon: TrendingUp,
      title: "Track your progress",
      description:
        "Review your previous interviews, scores, and performance over time.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F6F8FB] text-slate-900 transition-colors duration-200 dark:bg-[#0B1120] dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Navbar */}
        <header className="flex items-center justify-between py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <BrainCircuit size={23} />
            </div>

            <span className="text-xl font-extrabold tracking-tight">
              Intervi<span className="text-blue-600">AI</span>
            </span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-5">
            <a
              href="#how"
              className="hidden text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300 sm:block"
            >
              How it works
            </a>

            <a
              href="#benefits"
              className="hidden text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300 sm:block"
            >
              Benefits
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-400 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200"
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <Link
              to="/login"
              className="hidden text-sm font-semibold text-slate-700 transition hover:text-blue-600 dark:text-slate-200 sm:block"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="py-16 text-center sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-[#16233F] dark:text-blue-300">
              <Sparkles size={16} />
              AI-Powered Interview Preparation
            </div>

            <h1 className="mx-auto mt-7 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Practice job interviews with an{" "}
              <span className="text-blue-600">AI coach.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
              Answer realistic interview questions, get AI-powered feedback, and
              discover where you can improve. Build confidence before your next
              big opportunity.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto"
              >
                Start Free
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-bold text-slate-700 transition hover:border-blue-400 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200 sm:w-auto"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
              Start practising and prepare for your next interview.
            </p>
          </motion.div>

          {/* Product preview */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-16 max-w-3xl"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-2xl shadow-slate-300/30 sm:p-8 dark:border-slate-700 dark:bg-[#111A2E] dark:shadow-black/20">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-[#16233F] dark:text-blue-400">
                    <BrainCircuit size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold">AI Mock Interview</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Full Stack Developer
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                  ● In Progress
                </span>
              </div>

              <div className="py-7">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Interview Question
                  </p>
                  <span className="text-sm font-semibold text-blue-600">
                    04 / 10
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold leading-8 sm:text-xl">
                  Explain how React's Virtual DOM improves application
                  performance.
                </h3>

                <div className="mt-7">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div className="h-full w-[40%] rounded-full bg-blue-600" />
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Interview progress</span>
                    <span>40% completed</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  AI-generated questions
                </span>

                <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check size={16} />
                  Answer saved
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <section
          id="how"
          className="scroll-mt-8 border-t border-slate-200 py-16 dark:border-slate-800 sm:py-20"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-blue-600">HOW IT WORKS</p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Three simple steps to interview success.
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              A simple and structured way to prepare for your next job
              interview.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <motion.div
                key={step.number}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition dark:border-slate-700 dark:bg-[#111A2E]"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-extrabold text-blue-600 dark:bg-[#16233F] dark:text-blue-400">
                  {step.number}
                </div>

                <h3 className="text-lg font-bold">{step.title}</h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section
          id="benefits"
          className="scroll-mt-8 border-t border-slate-200 py-16 dark:border-slate-800 sm:py-20"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-blue-600">WHY INTERVIAI</p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you need to perform better.
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Make interview preparation easier, smarter, and more effective.
            </p>
          </div>

          <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div key={benefit.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-[#16233F] dark:text-blue-400">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-3xl bg-[#EAF1FF] px-6 py-14 text-center dark:bg-[#16233F] sm:mb-20 sm:px-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready for your first practice question?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
            Start your AI-powered mock interview journey today. Practise,
            improve, and get one step closer to your dream job.
          </p>

          <Link
            to="/register"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Get Started Free
            <ArrowRight size={18} />
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-8 text-center dark:border-slate-800">
          <Link to="/" className="text-lg font-extrabold">
            Intervi<span className="text-blue-600">AI</span>
          </Link>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Practice smarter. Interview better.
          </p>

          <p className="mt-5 text-xs text-slate-400">
            © {new Date().getFullYear()} InterviAI. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}

export default HomePage;
