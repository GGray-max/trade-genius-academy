import { Button } from "@/components/ui/button";
import { Bot, BarChart2, Activity, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Action {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const actions: Action[] = [
  { label: "Build New Bot", icon: <Bot className="w-5 h-5" />, href: "/builder" },
  { label: "Open Analytics", icon: <BarChart2 className="w-5 h-5" />, href: "/analytics" },
  { label: "View Signals", icon: <Activity className="w-5 h-5" />, href: "/signals" },
  { label: "Request Strategy", icon: <HelpCircle className="w-5 h-5" />, href: "/request" },
];

const QuickActionsPanel = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">🧭 Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action) => (
          <motion.a
            key={action.label}
            href={action.href}
            whileHover={{ scale: 1.03 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20 flex flex-col items-center gap-2 text-center hover:bg-white/20 transition-colors"
          >
            {action.icon}
            <span className="text-sm font-medium">{action.label}</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default QuickActionsPanel;
