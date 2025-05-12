
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot } from "@/types";

interface BotCardProps {
  bot: Bot;
}

const BotCard = ({ bot }: BotCardProps) => {
  // Helper function to format currency
  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      KES: 'KSh',
    };
    
    return `${symbols[currency] || ''}${amount.toFixed(2)}`;
  };

  // Get appropriate badge color based on performance
  const getBadgeColor = (roi: number) => {
    if (roi >= 50) return "bg-tw-green text-white hover:bg-tw-green-dark";
    if (roi >= 20) return "bg-tw-blue text-white hover:bg-tw-blue-dark";
    return "bg-gray-500 text-white hover:bg-gray-600";
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
      <CardHeader className="p-4 pb-0 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg truncate">{bot.name}</h3>
          <p className="text-gray-500 text-sm">by {bot.createdBy.username}</p>
        </div>
        <div className="flex items-center space-x-1">
          <Badge variant="outline" className="flex items-center space-x-1">
            <span>⭐</span>
            <span>{bot.performance.rating.toFixed(1)}</span>
          </Badge>
          {bot.isAudited && (
            <Badge className="bg-tw-gold text-tw-blue-dark hover:bg-tw-gold/90">
              Audited
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">{bot.description}</p>
          
          {/* Performance stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">ROI</p>
              <p className={`text-sm font-bold ${bot.performance.roi > 0 ? 'text-tw-green-dark' : 'text-tw-red'}`}>
                {bot.performance.roi > 0 ? '+' : ''}{bot.performance.roi}%
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">Win Rate</p>
              <p className="text-sm font-bold">{bot.performance.winRate}%</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">Trades</p>
              <p className="text-sm font-bold">{bot.performance.totalTrades}</p>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {bot.tags.slice(0, 3).map((tag, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
            {bot.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{bot.tags.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t mt-auto">
        <div className="w-full flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Monthly</p>
            <p className="font-bold">{formatCurrency(bot.price.monthly, bot.price.currency)}</p>
          </div>
          <Link to={`/bots/${bot.id}`}>
            <button className="btn-primary px-4 py-2 text-sm">
              View Details
            </button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BotCard;
