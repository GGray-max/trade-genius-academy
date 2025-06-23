import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { api } from '@/lib/api';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ChartLine, Users, Clock } from "lucide-react";

// Mock data for charts
const performanceData = [
  { name: "Jan", profit: 12, transactions: 120 },
  { name: "Feb", profit: 19, transactions: 145 },
  { name: "Mar", profit: 3, transactions: 98 },
  { name: "Apr", profit: 5, transactions: 110 },
  { name: "May", profit: 2, transactions: 85 },
  { name: "Jun", profit: 3, transactions: 90 },
  { name: "Jul", profit: 15, transactions: 180 },
  { name: "Aug", profit: 21, transactions: 200 },
  { name: "Sep", profit: 25, transactions: 210 },
  { name: "Oct", profit: 17, transactions: 170 },
  { name: "Nov", profit: 24, transactions: 220 },
  { name: "Dec", profit: 28, transactions: 240 },
];

const botPerformanceData = [
  { name: "TrendTracker AI", roi: 12.5, users: 250 },
  { name: "DayTrader Pro", roi: 9.8, users: 180 },
  { name: "CryptoMaster", roi: 15.2, users: 320 },
  { name: "ForexWizard", roi: 7.5, users: 150 },
  { name: "StockSage", roi: 11.3, users: 220 },
];

const assetAllocationData = [
  { name: "Stocks", value: 45 },
  { name: "Crypto", value: 30 },
  { name: "Forex", value: 15 },
  { name: "Commodities", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const tradingActivityData = Array.from({ length: 24 }, (_, i) => ({
  hour: i.toString(),
  trades: Math.floor(Math.random() * 50) + 10,
}));

const Analytics = () => {
  const { handleApiError } = useErrorHandler();

  // Fetch analytics data
  const { data: analyticsData, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    },
    onError: handleApiError,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  });

  // Fetch performance data
  const { data: performanceData = [] } = useQuery({
    queryKey: ['analytics', 'performance'],
    queryFn: async () => {
      const response = await api.get('/analytics/performance');
      return response.data.hourlyTrades || [
        { hour: '00:00', trades: 12 },
        { hour: '04:00', trades: 18 },
        { hour: '08:00', trades: 25 },
        { hour: '12:00', trades: 31 },
        { hour: '16:00', trades: 22 },
        { hour: '20:00', trades: 19 },
      ];
    },
    onError: handleApiError,
  });
  const [activeTab, setActiveTab] = useState("performance");

  useEffect(() => {
    document.title = "Analytics | TradeWizard";
    // Simulate loading data
    const timer = setTimeout(() => {
    }, 800);
    return () => clearTimeout(timer);
  }, []);

if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load analytics data. Please try again.
              <button 
                onClick={() => refetch()} 
                className="ml-2 underline hover:no-underline"
              >
                Retry
              </button>
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  // Use real data or fallback to mock data
  const stats = analyticsData?.stats || {
    totalROI: 28.5,
    totalTrades: 1247,
    winRate: 68.3,
    avgProfit: 145.20
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <ChartLine className="mr-2 h-6 w-6 text-tw-blue" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor your trading performance and bot metrics
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,485.25</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+15.3%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Out of 8 subscribed bots
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">
                <Clock className="inline mr-1 h-3 w-3" />
                Last trade 5 minutes ago
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68.5%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+2.3%</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <Tabs
          defaultValue="performance"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="bots">Bot Analytics</TabsTrigger>
            <TabsTrigger value="assets">Asset Allocation</TabsTrigger>
            <TabsTrigger value="activity">Trading Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>
                  View your profit and transaction volume over the past year
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="profit"
                        stroke="#0088FE"
                        activeDot={{ r: 8 }}
                        name="Profit (%)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="transactions"
                        stroke="#00C49F"
                        name="Transactions"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bots" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bot Performance</CardTitle>
                <CardDescription>
                  Compare ROI and user count across your trading bots
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={botPerformanceData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="roi"
                        fill="#0088FE"
                        name="ROI (%)"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="users"
                        fill="#00C49F"
                        name="Users"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>
                  View the distribution of your trading assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetAllocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {assetAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>24-Hour Trading Activity</CardTitle>
                <CardDescription>
                  Number of trades executed in each hour
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={tradingActivityData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="trades"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="Number of Trades"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;