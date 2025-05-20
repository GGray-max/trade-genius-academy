import { useEffect, useState } from "react";
import { ChartLine, TrendingUp, TrendingDown, Bot, Bell, Users, Loader2 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const { profile } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    activeSubscriptions: 0,
    activeSignals: 0,
    totalProfit: "$0",
    winRate: "0%"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!mounted) return;

        setDashboardData({
          activeSubscriptions: 2,
          activeSignals: 5,
          totalProfit: "$1,245.78",
          winRate: "68%"
        });
      } catch (err) {
        if (!mounted) return;
        setError("Failed to load dashboard data. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, [toast]);

  // The ProtectedRoute component will handle authentication checks
  // We don't need to check for user/profile here - if we're rendering this component,
  // we're already authenticated thanks to ProtectedRoute

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{greeting}, {profile?.username || 'User'}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your trading bots today.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Subscriptions"
            value={dashboardData.activeSubscriptions}
            icon={<TrendingUp />}
            trend="up"
            trendValue="+1 from last week"
          />
          <StatCard
            title="Active Signals"
            value={dashboardData.activeSignals}
            icon={<Bell />}
            trend="neutral"
          />
          <StatCard
            title="Total Profit"
            value={dashboardData.totalProfit}
            icon={<ChartLine />}
            trend="up"
            trendValue="+15.3% this month"
          />
          <StatCard
            title="Win Rate"
            value={dashboardData.winRate}
            icon={<TrendingUp />}
            trend="down"
            trendValue="-2.8% this week"
          />
        </div>

        {/* Request a Custom Bot Card */}
        <Card className="bg-gradient-to-r from-tw-blue-light to-tw-blue p-1">
          <div className="bg-white rounded-sm p-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold">Need a Custom Trading Bot?</h3>
                <p className="text-gray-600 mt-1">
                  Request our team of experts to build a custom trading bot tailored to your needs.
                </p>
              </div>
              <Link to="/dashboard/request-bot">
                <Button className="bg-tw-blue hover:bg-tw-blue-dark whitespace-nowrap">
                  Request a Custom Bot
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-5 mt-8 lg:grid-cols-2">
          {/* Active Bots */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Your Active Bots</CardTitle>
              <CardDescription>Currently running trading bots</CardDescription>
            </CardHeader>
            <CardContent>
              {Array(2).fill(0).map((_, i) => (
                <div key={i} className="mb-4 last:mb-0 p-4 border rounded-lg flex items-center justify-between bg-white">
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-tw-blue-light rounded-full">
                      <Bot className="h-5 w-5 text-tw-blue" />
                    </div>
                    <div>
                      <p className="font-medium">{i === 0 ? "Trend Master Pro" : "Scalper 5000"}</p>
                      <p className="text-sm text-gray-500">{i === 0 ? "Trend Following" : "Scalping"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-tw-green">{i === 0 ? "+8.3%" : "+5.7%"}</p>
                    <p className="text-xs text-gray-500">ROI this week</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Bots</Button>
            </CardFooter>
          </Card>

          {/* Recent Signals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Signals</CardTitle>
              <CardDescription>Trading signals from your bots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg flex items-center justify-between bg-white">
                    <div className="flex items-center">
                      <div className={`mr-4 p-2 ${i % 2 === 0 ? "bg-green-100" : "bg-red-100"} rounded-full`}>
                        {i % 2 === 0 ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{i % 2 === 0 ? "Buy" : "Sell"} {i === 0 ? "BTC/USD" : i === 1 ? "ETH/USD" : "XRP/USD"}</p>
                        <p className="text-sm text-gray-500">
                          {new Date().toLocaleTimeString()} • {i === 0 ? "Trend Master Pro" : i === 1 ? "Scalper 5000" : "Trend Master Pro"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${i % 2 === 0 ? "text-green-600" : "text-red-600"}`}>
                        {i % 2 === 0 ? "+$235.50" : "-$124.75"}
                      </p>
                      <p className="text-xs text-gray-500">{i % 2 === 0 ? "Entry: $24,567" : "Entry: $1,650"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Signals</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recommended Bots Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recommended Bots</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{i === 0 ? "Market Wizard" : i === 1 ? "Crypto Harvester" : "Forex Master"}</CardTitle>
                    <div className={`px-2 py-1 rounded text-xs ${i === 0 ? "bg-green-100 text-green-800" : i === 1 ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
                      {i === 0 ? "Low Risk" : i === 1 ? "Medium Risk" : "High Risk"}
                    </div>
                  </div>
                  <CardDescription>
                    {i === 0 ? "Trend Following" : i === 1 ? "Scalping Strategy" : "Breakout Strategy"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-sm">
                      <p className="text-gray-500">ROI</p>
                      <p className="font-semibold">{i === 0 ? "32%" : i === 1 ? "68%" : "87%"}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Win Rate</p>
                      <p className="font-semibold">{i === 0 ? "78%" : i === 1 ? "65%" : "58%"}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Subscribers</p>
                      <p className="font-semibold">{i === 0 ? "152" : i === 1 ? "89" : "64"}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Price</p>
                      <p className="font-semibold">{i === 0 ? "$49/mo" : i === 1 ? "$79/mo" : "$129/mo"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">By {i === 0 ? "TradingMaster" : i === 1 ? "CryptoGuru" : "ForexKing"}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-tw-blue hover:bg-tw-blue-dark">View Bot Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
