
import { useEffect, useState } from "react";
import { botApi } from "@/lib/api";
import { Bot } from "@/types";
import BotGrid from "@/components/bots/BotGrid";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TrendingBots = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trendingBots"],
    queryFn: () => botApi.getAllBots(),
  });

  // Sort bots by popularity (we'd use a real metric in production)
  const trendingBots = data?.bots
    ? [...data.bots].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 6)
    : [];

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">Error loading trending bots</h2>
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
          <h1 className="text-3xl font-bold">Trending Bots</h1>
          <p className="text-gray-600 mt-2">
            The most popular trading bots this week
          </p>
        </div>
        
        {trendingBots.length > 0 ? (
          <BotGrid bots={trendingBots} />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">No trending bots available</h3>
            <p className="mt-2 text-gray-600">Check back soon for new trending bots</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TrendingBots;
