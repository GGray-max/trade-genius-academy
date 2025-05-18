import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bot } from "@/types";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Bot as BotIcon, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const MyBots = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  // Fetch user's bots
  const { data: bots, isLoading, error } = useQuery({
    queryKey: ['userBots', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_bots')
        .select(`
          *,
          bot:bot_id (*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Filter bots based on search query
  const filteredBots = bots?.filter(botSubscription => 
    botSubscription.bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    botSubscription.bot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate bots by status
  const activeBots = filteredBots?.filter(b => b.status === 'active') || [];
  const pausedBots = filteredBots?.filter(b => b.status === 'paused') || [];
  const expiredBots = filteredBots?.filter(b => b.status === 'expired') || [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-tw-blue" />
            <p className="text-sm text-muted-foreground">Loading your bots...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Trading Bots</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor your trading bots
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={() => window.location.href = '/marketplace'}>
            Browse Marketplace
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBots.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$1,234.56</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active ({activeBots.length})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({pausedBots.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({expiredBots.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBots.map((subscription) => (
                <BotCard 
                  key={subscription.id} 
                  subscription={subscription}
                  onStatusChange={() => {/* Handle status change */}}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paused" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pausedBots.map((subscription) => (
                <BotCard 
                  key={subscription.id} 
                  subscription={subscription}
                  onStatusChange={() => {/* Handle status change */}}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="expired" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiredBots.map((subscription) => (
                <BotCard 
                  key={subscription.id} 
                  subscription={subscription}
                  onStatusChange={() => {/* Handle status change */}}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

interface BotCardProps {
  subscription: any;
  onStatusChange: (status: string) => void;
}

const BotCard = ({ subscription, onStatusChange }: BotCardProps) => {
  const bot = subscription.bot;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BotIcon className="h-5 w-5 text-tw-blue" />
            <CardTitle>{bot.name}</CardTitle>
          </div>
          <Badge variant={subscription.status === 'active' ? 'success' : 'secondary'}>
            {subscription.status}
          </Badge>
        </div>
        <CardDescription>{bot.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Profit</p>
            <p className="text-lg font-semibold text-green-600">+$123.45</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-lg font-semibold">65%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Since</p>
            <p className="text-sm">{new Date(subscription.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Billing</p>
            <p className="text-sm">{new Date(subscription.next_billing_date).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.href = `/bots/${bot.id}`}>
          View Details
        </Button>
        <Button 
          variant={subscription.status === 'active' ? 'destructive' : 'default'}
          onClick={() => onStatusChange(subscription.status === 'active' ? 'paused' : 'active')}
        >
          {subscription.status === 'active' ? 'Pause Bot' : 'Activate Bot'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MyBots; 