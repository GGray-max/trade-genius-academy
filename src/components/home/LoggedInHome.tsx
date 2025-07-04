import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
// New intelligent dashboard sections
import AiRecommendations from "@/components/home/AiRecommendations";
import BacktestWidget from "@/components/home/BacktestWidget";
import TopBotsLeaderboard from "@/components/home/TopBotsLeaderboard";
import LiveMarketAlerts from "@/components/home/LiveMarketAlerts";
import QuickActionsPanel from "@/components/home/QuickActionsPanel";
import NewsSentimentFeed from "@/components/home/NewsSentimentFeed";
import InteractiveHelp from "@/components/home/InteractiveHelp";

interface LoggedInHomeProps {
  user: User;
}

type KPI = {
  label: string;
  value: string;
  change?: string; // e.g. "+5.4%"
};

// Mock performance data (replace with live API call)
const mockPerformanceData = [
  { name: "Jan", roi: 5 },
  { name: "Feb", roi: 8 },
  { name: "Mar", roi: 12 },
  { name: "Apr", roi: 10 },
  { name: "May", roi: 15 },
  { name: "Jun", roi: 18 },
];

// Mock KPI values (replace with live API call)
const defaultKpis: KPI[] = [
  { label: "ROI", value: "+127.4%", change: "+5.2%" },
  { label: "Win Rate", value: "78.5%", change: "+1.1%" },
  { label: "Total Trades", value: "2,345" },
];

const LoggedInHome = ({ user }: LoggedInHomeProps) => {
  const [kpis, setKpis] = useState<KPI[]>(defaultKpis);
  const [performance, setPerformance] = useState(mockPerformanceData);

  useEffect(() => {
    // TODO: Fetch real KPI and performance data for the authenticated user
    // and update state via setKpis and setPerformance
  }, [user]);

  const roiValue = kpis.find((k) => k.label === "ROI")?.value ?? "0%";
  const roiNumeric = parseFloat(roiValue.replace(/[^0-9.-]/g, ""));
  const isTopPerformer = roiNumeric > 100; // TODO: Replace with server-side metric

  return (
    <div className="bg-gradient-to-br from-tw-blue-dark via-tw-blue to-tw-purple/80 min-h-[calc(100vh-4rem)] text-white">
      <div className="container mx-auto px-4 py-16 space-y-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-3xl md:text-4xl font-semibold">
            Welcome back, {user.user_metadata?.username || user.email} 👋
          </h1>
          <p className="text-gray-200 max-w-prose">
            Here's a quick overview of your trading performance. Keep up the
            great work!
          </p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {kpis.map((kpi) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20"
            >
              <p className="text-sm uppercase tracking-wide text-gray-300">
                {kpi.label}
              </p>
              <p className="text-3xl font-bold">{kpi.value}</p>
              {kpi.change && (
                <span
                  className={cn(
                    "absolute top-4 right-4 text-xs font-medium px-2 py-0.5 rounded",
                    kpi.change.startsWith("+")
                      ? "bg-tw-green/20 text-tw-green"
                      : "bg-tw-red/20 text-tw-red"
                  )}
                >
                  {kpi.change}
                </span>
              )}
              {kpi.label === "ROI" && (
                <span className="absolute -top-3 left-6 bg-tw-green/90 text-tw-blue-dark text-xs px-2 py-0.5 rounded-full shadow">
                  LIVE
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20"
        >
          <h3 className="font-semibold text-lg mb-4">Performance Overview</h3>
          <div className="h-64 w-full">
            {/* TODO: Replace mock chart with dynamic data */}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performance} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#d1d5db" fontSize={12} />
                <YAxis stroke="#d1d5db" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none" }} />
                <Area type="monotone" dataKey="roi" stroke="#34d399" fill="url(#roiGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Smart AI Recommendations */}
        <AiRecommendations />

        {/* Backtest Simulator */}
        <BacktestWidget />

        {/* Top Performing Bots */}
        <TopBotsLeaderboard />

        {/* Live Market Alerts */}
        <LiveMarketAlerts />

        {/* Quick Actions */}
        <QuickActionsPanel />

        {/* News & Sentiment Feed */}
        <NewsSentimentFeed />

        {/* Interactive Help */}
        <InteractiveHelp />

        {/* Top Performer Badge */}
        {isTopPerformer && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-flex items-center gap-2 bg-tw-gold text-tw-blue-dark px-4 py-2 rounded-full shadow-md"
          >
            🏆 Top Performer
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoggedInHome;
