
import { useState, useEffect } from 'react';
import BotCard from './BotCard';
import { Bot } from '@/types';
import { mockBots } from '@/data/mockData';

const TrendingBots = () => {
  const [trendingBots, setTrendingBots] = useState<Bot[]>([]);
  
  useEffect(() => {
    // In a real application, we would fetch trending bots from an API
    // For now, we'll use mock data and filter for top 3 bots by performance rating
    const topBots = [...mockBots]
      .sort((a, b) => b.performance.rating - a.performance.rating)
      .slice(0, 3);
      
    setTrendingBots(topBots);
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trending Bots</h2>
        <a href="/marketplace" className="text-tw-blue hover:text-tw-blue-dark text-sm font-medium">
          View All →
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingBots.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>
    </div>
  );
};

export default TrendingBots;
