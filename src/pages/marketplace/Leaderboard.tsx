
import { useQuery } from "@tanstack/react-query";
import { botApi } from "@/lib/api";
import MainLayout from "@/components/layout/MainLayout";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Award, BarChart } from "lucide-react";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["leaderboardBots"],
    queryFn: () => botApi.getAllBots(),
  });

  // This would use real performance metrics in production
  const leaderboardBots = data?.bots
    ? [...data.bots]
        .map(bot => ({
          ...bot,
          roi: Math.random() * 100, // Mock ROI between 0-100%
          winRate: Math.floor(Math.random() * 40) + 60, // Mock win rate between 60-100%
        }))
        .sort((a, b) => b.roi - a.roi)
    : [];

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">Error loading leaderboard</h2>
          <p className="mt-2">Please try again later</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/marketplace">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Bot Leaderboard</h1>
          <p className="text-gray-600 mt-2">
            The top performing trading bots ranked by ROI
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bot
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Strategy
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    ROI
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    Win Rate
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <BarChart className="h-4 w-4 mr-1" />
                    Risk Level
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardBots.map((bot, index) => (
                <tr key={bot.id} className={index < 3 ? "bg-yellow-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`flex items-center justify-center h-7 w-7 rounded-full ${
                        index === 0 ? "bg-yellow-400" :
                        index === 1 ? "bg-gray-300" :
                        index === 2 ? "bg-amber-600" : "bg-gray-100"
                      } text-sm font-semibold`}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {bot.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {bot.market}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bot.strategy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600 font-semibold">
                      +{bot.roi.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bot.winRate}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${bot.risk_level === 'low' ? 'bg-green-100 text-green-800' : 
                        bot.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {bot.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button size="sm" className="bg-tw-blue hover:bg-tw-blue-dark">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Leaderboard;
