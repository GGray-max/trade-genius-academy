import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Recommendation {
  title: string;
  description: string;
  cta: string;
}

// Mock recommendations data – replace with live AI endpoint
const recommendations: Recommendation[] = [
  {
    title: "Trend Strategy Upgrade",
    description: "Boost your trend-following bot with dynamic ATR stops.",
    cta: "Preview",
  },
  {
    title: "Mean-Reversion Twist",
    description: "Add RSI divergence filters to reduce whipsaws.",
    cta: "Apply",
  },
  {
    title: "Volatility Breakout",
    description: "Leverage multi-timeframe Bollinger bands for entries.",
    cta: "Preview",
  },
];

const AiRecommendations = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">🔮 AI Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <motion.div
            key={rec.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{rec.title}</h3>
              <p className="text-gray-200 text-sm">{rec.description}</p>
            </div>
            <div className="pt-4">
              <Button size="sm" variant="secondary" className="w-full">
                {rec.cta}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AiRecommendations;
