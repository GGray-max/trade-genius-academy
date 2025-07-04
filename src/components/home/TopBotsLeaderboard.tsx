import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface Bot {
  id: string;
  name: string;
  roi: string;
  strategy: string;
  trend: number[]; // sparkline data
}

// Mock top bots data – replace with server response
const topBots: Bot[] = [
  {
    id: "1",
    name: "Alpha Trend",
    roi: "+212%",
    strategy: "Trend Following",
    trend: [5, 8, 12, 15, 20, 24, 29],
  },
  {
    id: "2",
    name: "Gamma Revert",
    roi: "+168%",
    strategy: "Mean Reversion",
    trend: [3, 5, 9, 11, 14, 16, 18],
  },
  {
    id: "3",
    name: "Delta Breakout",
    roi: "+143%",
    strategy: "Breakout",
    trend: [2, 4, 6, 9, 11, 15, 17],
  },
];

const Sparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const points = data
    .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / max) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-6">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        points={points}
        className="text-tw-green"
      />
    </svg>
  );
};

const TopBotsLeaderboard = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        🏆 Top Performing Bots
      </h2>
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {topBots.map((bot) => (
            <CarouselItem key={bot.id} className="basis-full sm:basis-1/2 lg:basis-1/3 px-2">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20 space-y-2 h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{bot.name}</h3>
                  <span className="text-sm text-tw-green flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> {bot.roi}
                  </span>
                </div>
                <p className="text-gray-300 text-xs">{bot.strategy}</p>
                <div>
                  <Sparkline data={bot.trend} />
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-6" />
        <CarouselNext className="-right-6" />
      </Carousel>
    </section>
  );
};

export default TopBotsLeaderboard;
