import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface AlertItem {
  message: string;
  timestamp: string; // e.g., "2m ago" – replace with real date
}

// Mock live alerts – will come from WebSocket/real-time feed
const alerts: AlertItem[] = [
  { message: "BTC broke above $62K", timestamp: "Just now" },
  { message: "ETH bullish divergence detected", timestamp: "1m ago" },
  { message: "SOL crossing 200-MA", timestamp: "3m ago" },
  { message: "APE volume spike 120%", timestamp: "5m ago" },
];

const LiveMarketAlerts = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        🚨 Live Market Alerts
      </h2>
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20 max-h-56 overflow-y-auto space-y-3">
        {alerts.map((alert, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="flex items-start gap-3"
          >
            <AlertTriangle className="text-tw-gold w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm leading-snug">{alert.message}</p>
              <span className="text-xs text-gray-400">{alert.timestamp}</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-tw-green/20 text-tw-green">LIVE</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LiveMarketAlerts;
