
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { userActivity } from "@/data/userActivity";
import BotGrid from "@/components/bots/BotGrid";
import { Bot } from "@/types";
import { mockBots } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Marketplace = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with a delay
    const fetchBots = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setBots(mockBots);
        setLoading(false);
      }, 500);
    };

    fetchBots();
  }, []);

  // --- Recommendation Logic ---
const recommendedBots = bots.filter((bot) => {
  // Exclude bots user already subscribed to
  if (userActivity.subscribedBotIds.includes(bot.id)) return false;
  // Recommend if shares at least one favorite tag
  return bot.tags.some((tag) => userActivity.favoriteTags.includes(tag));
});
const recommendedIds = recommendedBots.map((b) => b.id);

const allOrderedBots = [...recommendedBots, ...bots.filter((b) => !recommendedIds.includes(b.id))];

const trendingBots = [...bots].sort((a, b) => b.subscriptions - a.subscriptions);
  const topPerformingBots = [...bots].sort((a, b) => b.performance.roi - a.performance.roi);
  const newestBots = [...bots].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const auditedBots = bots.filter((bot) => bot.isAudited);

  return (
    <MainLayout>
      <div className="bg-tw-blue-dark text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Bot Marketplace</h1>
          <p className="text-lg text-gray-200 max-w-3xl">
            Discover and subscribe to high-performing trading bots created by our community of expert developers.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tw-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading bots...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="recommended">
            <TabsList className="mb-8">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="all">All Bots</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="top">Top Performing</TabsTrigger>
              <TabsTrigger value="new">Newest</TabsTrigger>
              <TabsTrigger value="audited">Audited</TabsTrigger>
            </TabsList>
            <TabsContent value="recommended">
               <BotGrid bots={recommendedBots} recommendedIds={recommendedIds} />
             </TabsContent>

             <TabsContent value="all">
              <BotGrid bots={allOrderedBots} recommendedIds={recommendedIds} />
            </TabsContent>
            <TabsContent value="trending">
              <BotGrid bots={trendingBots} recommendedIds={recommendedIds} />
            </TabsContent>
            <TabsContent value="top">
              <BotGrid bots={topPerformingBots} recommendedIds={recommendedIds} />
            </TabsContent>
            <TabsContent value="new">
              <BotGrid bots={newestBots} recommendedIds={recommendedIds} />
            </TabsContent>
            <TabsContent value="audited">
              <BotGrid bots={auditedBots} recommendedIds={recommendedIds} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default Marketplace;
