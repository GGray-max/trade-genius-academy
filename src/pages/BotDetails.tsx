import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Shield,
  Users,
  LineChart,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentModal } from "@/components/payments/PaymentModal";

const BotDetails = () => {
  const { botId } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Fetch bot details
  const { data: bot, isLoading, error } = useQuery({
    queryKey: ['bot', botId],
    queryFn: async () => {
      if (!botId) throw new Error('Bot ID is required');
      
      const { data, error } = await supabase
        .from('bots')
        .select(`
          *,
          developer:created_by (
            username,
            avatar_url
          ),
          performance:bot_performance (
            roi,
            win_rate,
            total_trades,
            trades_per_day
          )
        `)
        .eq('id', botId)
        .single();
      
      if (error) {
        console.error('Error fetching bot:', error);
        throw new Error(error.message);
      }
      
      if (!data) {
        throw new Error('Bot not found');
      }
      
      return data;
    },
    retry: 2,
    staleTime: 300000, // 5 minutes
    enabled: !!botId
  });

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Error Loading Bot</h2>
            <p className="mt-2">{error instanceof Error ? error.message : 'Failed to load bot details'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-tw-blue" />
            <p className="text-sm text-muted-foreground">Loading bot details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!bot) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Bot not found</h2>
            <p className="mt-2">The bot you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-tw-blue/10 rounded-full">
                      <Bot className="h-6 w-6 text-tw-blue" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{bot.name}</CardTitle>
                      <CardDescription>by {bot.developer.username}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={bot.is_audited ? "success" : "secondary"}>
                    {bot.is_audited ? "Audited" : "Pending Audit"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{bot.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-2xl font-bold text-green-600">+{bot.performance_roi}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold">{bot.performance_win_rate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trades/Day</p>
                    <p className="text-2xl font-bold">{bot.performance_trades_per_day}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Users</p>
                    <p className="text-2xl font-bold">{bot.subscriptions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Strategy Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Strategy Type</h4>
                      <p className="text-muted-foreground">{bot.strategy_type}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{bot.strategy_description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Market</h4>
                      <Badge>{bot.market}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Time Frame</h4>
                      <Badge>{bot.time_frame}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Risk Level</h4>
                      <Badge variant={
                        bot.risk_level === 'Low' ? 'success' :
                        bot.risk_level === 'Medium' ? 'secondary' : 'destructive'
                      }>
                        {bot.risk_level}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-4">Key Statistics</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Trades</span>
                            <span className="font-medium">{bot.performance_total_trades}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Win Rate</span>
                            <span className="font-medium text-green-600">{bot.performance_win_rate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Avg. Profit/Trade</span>
                            <span className="font-medium">${bot.performance_avg_profit_per_trade}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Max Drawdown</span>
                            <span className="font-medium text-red-600">{bot.performance_drawdown}%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">Monthly Performance</h4>
                        {/* Add a chart component here */}
                        <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">Performance chart coming soon</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Reviews coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Monthly</h4>
                    <Badge variant="secondary">${bot.price_monthly}/mo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Perfect for trying out the bot</p>
                </div>
                <div className="p-4 border rounded-lg bg-accent/50">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium">Yearly</h4>
                      <Badge variant="success" className="mt-1">Save 20%</Badge>
                    </div>
                    <Badge variant="secondary">${bot.price_yearly}/yr</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Best value for long-term usage</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  className="w-full" 
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  Subscribe Now
                </Button>
                <Button variant="outline" className="w-full">
                  Contact Developer
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Supported Platforms</p>
                    <p className="text-sm text-muted-foreground">MT4, MT5, deriv.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Minimum Deposit</p>
                    <p className="text-sm text-muted-foreground">${bot.min_deposit || 100}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Risk Warning</p>
                    <p className="text-sm text-muted-foreground">
                      Trading involves substantial risk. Past performance does not guarantee future results.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={bot.price_monthly}
        currency="USD"
        planType="monthly"
        botId={bot.id}
      />
    </MainLayout>
  );
};

export default BotDetails; 