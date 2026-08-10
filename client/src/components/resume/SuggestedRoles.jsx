import { motion } from "framer-motion";
import { BriefcaseBusiness, Sparkles } from "lucide-react";

function SuggestedRoles({ roles }) {
  const suggestedRoles = Array.isArray(roles)
    ? roles.filter((role) => typeof role === "string" && role.trim().length > 0)
    : [];

  if (suggestedRoles.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <BriefcaseBusiness size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Suggested Roles
            </h2>

            <p className="text-sm text-slate-500">
              No suitable roles were identified yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-labelledby="suggested-roles-heading"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <BriefcaseBusiness size={22} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="suggested-roles-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Suggested Roles
            </h2>

            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
              <Sparkles size={13} />
              AI Suggested
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Roles that align with the skills and information found in your
            resume.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {suggestedRoles.map((role, index) => (
          <motion.div
            key={`${role}-${index}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.25,
              delay: index * 0.07,
            }}
            className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                <BriefcaseBusiness size={18} />
              </div>

              <div className="min-w-0">
                <p className="font-medium leading-5 text-slate-800">{role}</p>

                <p className="mt-1 text-xs text-slate-500">
                  Recommended for your profile
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default SuggestedRoles;
