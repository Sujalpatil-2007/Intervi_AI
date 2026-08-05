import { motion } from "framer-motion";

function StatCard({ title, value, icon: Icon, color = "bg-blue-500" }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl bg-white p-6 shadow-sm border border-slate-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${color}`}
        >
          <Icon className="text-white" size={28} />
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;
