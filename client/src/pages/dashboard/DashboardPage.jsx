import { motion } from "framer-motion";

import { useAuth } from "../../hooks/useAuth";

import SummaryCards from "../../components/dashboard/summary/SummaryCards";
import ScoreTrendChart from "../../components/dashboard/charts/ScoreTrendChart";
import SkillsChart from "../../components/dashboard/charts/SkillsChart";
import RecentInterviews from "../../components/dashboard/recent/RecentInterviews";
import LeaderboardCard from "../../components/dashboard/leaderboard/LeaderboardCard";

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back,
          <span className="text-blue-600">
            {" "}
            {user?.fullName}
          </span>
          👋
        </h1>

        <p className="mt-2 text-slate-500">
          Here's an overview of your interview performance.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ScoreTrendChart />

        <SkillsChart />
      </section>

      {/* Bottom Widgets */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentInterviews />

        <LeaderboardCard />
      </section>
    </div>
  );
}

export default DashboardPage;