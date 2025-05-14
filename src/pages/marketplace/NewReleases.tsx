
import { useQuery } from "@tanstack/react-query";
import { botApi } from "@/lib/api";
import MainLayout from "@/components/layout/MainLayout";
import BotGrid from "@/components/bots/BotGrid";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NewReleases = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["newBots"],
    queryFn: () => botApi.getAllBots(),
  });

  // Sort bots by created date (newest first)
  // In a real app, we'd use actual creation dates
  const newBots = data?.bots
    ? [...data.bots]
        .sort((a, b) => {
          const dateA = new Date(a.created_at || Date.now());
          const dateB = new Date(b.created_at || Date.now());
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 6)
    : [];

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">Error loading new bots</h2>
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
          <h1 className="text-3xl font-bold">New Releases</h1>
          <p className="text-gray-600 mt-2">
            The latest trading bots added to our marketplace
          </p>
        </div>
        
        {newBots.length > 0 ? (
          <div>
            <BotGrid bots={newBots} />
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                New bots are added regularly. Check back often for the latest releases.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">No new bots available</h3>
            <p className="mt-2 text-gray-600">Check back soon for new releases</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NewReleases;
