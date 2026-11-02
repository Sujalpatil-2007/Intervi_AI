import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Sparkles size={16} />
                AI-Powered Interview Preparation
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Prepare smarter.
                <span className="block text-blue-600">Interview better.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Practice realistic mock interviews, answer AI-generated
                questions, and receive detailed feedback to improve your
                interview performance.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BrainCircuit size={23} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      AI Mock Interview
                    </p>
                    <p className="text-xs text-slate-500">
                      Full Stack Developer
                    </p>
                  </div>

                  <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    In Progress
                  </span>
                </div>

                <div className="py-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Question 4 of 10
                  </p>

                  <h2 className="mt-3 text-lg font-semibold leading-7 text-slate-900">
                    Explain how React's virtual DOM improves application
                    performance.
                  </h2>

                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-[40%] rounded-full bg-blue-600" />
                    </div>

                    <p className="mt-2 text-right text-xs text-slate-500">
                      40% completed
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-xs text-slate-400">
                    AI-generated questions
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <CheckCircle2 size={15} />
                    Answer saved
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-blue-600">
              Everything you need
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Build confidence before the real interview
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              InterviAI gives you a structured way to practice and understand
              where you can improve.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={FileText}
              title="Resume-Based Interviews"
              description="Upload your resume and practice interviews tailored to your skills and experience."
            />

            <FeatureCard
              icon={BrainCircuit}
              title="AI-Powered Questions"
              description="Get realistic technical and role-specific questions generated for your interview."
            />

            <FeatureCard
              icon={Target}
              title="Detailed Evaluation"
              description="Review your score, strengths, weaknesses, and question-by-question feedback."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">Ready to practice?</h2>

          <p className="mt-4 text-sm leading-6 text-slate-300">
            Start your first AI-powered mock interview and discover where you
            can improve.
          </p>

          <Link
            to="/dashboard"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Start Practicing
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={22} />
      </div>

      <h3 className="mt-5 font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </motion.div>
  );
}

export default HomePage;