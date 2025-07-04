import { motion } from "framer-motion";
import { Globe } from "lucide-react";

interface NewsItem {
  headline: string;
  sentiment: string; // e.g., "62% bullish"
}

// Mock news feed – replace with live API/Twitter sentiment
const newsFeed: NewsItem[] = [
  { headline: "Bitcoin ETF inflows reach new high", sentiment: "BTC: 68% bullish" },
  { headline: "Ethereum devs schedule next Dencun upgrade testnet", sentiment: "ETH: 59% bullish" },
  { headline: "Solana surpasses $2B TVL milestone", sentiment: "SOL: 65% bullish" },
];

const NewsSentimentFeed = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        📰 News & Sentiment
      </h2>
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20 space-y-3 max-h-64 overflow-y-auto">
        {newsFeed.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="flex items-start gap-3"
          >
            <Globe className="w-5 h-5 text-tw-blue-light flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm leading-snug">{item.headline}</p>
              <span className="text-xs text-gray-400">{item.sentiment}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default NewsSentimentFeed;
