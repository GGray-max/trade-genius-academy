
import { useState } from 'react';
import BotCard from './BotCard';
import { Bot } from '@/types';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BotGridProps {
  bots: Bot[];
  recommendedIds?: string[];
  title?: string;
}

const BotGrid = ({ bots, title, recommendedIds = [] }: BotGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  // Filter bots based on search term
  const filteredBots = bots.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort bots based on selected sort option
  const sortedBots = [...filteredBots].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.performance.rating - a.performance.rating;
      case 'roi':
        return b.performance.roi - a.performance.roi;
      case 'price':
        return a.price.monthly - b.price.monthly;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="w-full md:w-1/2">
          <Input
            placeholder="Search bots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rating</SelectItem>
              <SelectItem value="roi">Best ROI</SelectItem>
              <SelectItem value="price">Lowest Price</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {sortedBots.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold">No bots found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBots.map((bot) => (
            <BotCard key={bot.id} bot={bot} recommended={recommendedIds.includes(bot.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BotGrid;
