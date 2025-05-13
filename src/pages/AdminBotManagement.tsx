
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PlusCircle, Loader2 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

const botFormSchema = z.object({
  name: z.string().min(3, {
    message: "Bot name must be at least 3 characters.",
  }).max(100, {
    message: "Bot name must not exceed 100 characters."
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(2000, {
    message: "Description must not exceed 2000 characters."
  }),
  strategyType: z.string().min(1, {
    message: "Please select a strategy type.",
  }),
  strategyDescription: z.string().min(10, {
    message: "Strategy description must be at least 10 characters.",
  }),
  market: z.string().min(1, {
    message: "Please select a market.",
  }),
  timeFrame: z.string().min(1, {
    message: "Please select a time frame.",
  }),
  riskLevel: z.string().min(1, {
    message: "Please select a risk level.",
  }),
  priceMonthly: z.string().min(1, {
    message: "Please enter a monthly price.",
  }),
  priceYearly: z.string().min(1, {
    message: "Please enter a yearly price.",
  }),
  isAudited: z.boolean().default(false),
  tags: z.string().min(1, {
    message: "Please enter at least one tag (comma separated).",
  }),
});

interface Bot {
  id: string;
  name: string;
  description: string;
  created_by: string;
  risk_level: string;
  strategy_type: string;
  market: string;
  price_monthly: number;
  price_yearly: number;
  is_active: boolean;
  created_at: string;
}

const AdminBotManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Query to fetch bots created by the admin
  const { data: bots, isLoading: botsLoading, refetch } = useQuery({
    queryKey: ['adminBots', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('created_by', user.id);
      
      if (error) throw error;
      
      return data as Bot[];
    },
    enabled: !!user,
  });

  const form = useForm<z.infer<typeof botFormSchema>>({
    resolver: zodResolver(botFormSchema),
    defaultValues: {
      name: "",
      description: "",
      strategyType: "",
      strategyDescription: "",
      market: "",
      timeFrame: "",
      riskLevel: "",
      priceMonthly: "",
      priceYearly: "",
      isAudited: false,
      tags: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof botFormSchema>) => {
    if (!user) {
      toast.error("You must be logged in to create a bot");
      return;
    }

    setIsLoading(true);
    try {
      // Parse the tags string into an array
      const tags = values.tags.split(',').map(tag => tag.trim());
      
      // Insert the bot into the bots table
      const { data, error } = await supabase
        .from('bots')
        .insert([
          {
            name: values.name,
            description: values.description,
            created_by: user.id,
            strategy_type: values.strategyType,
            strategy_description: values.strategyDescription,
            market: values.market,
            time_frame: values.timeFrame,
            risk_level: values.riskLevel,
            price_monthly: parseFloat(values.priceMonthly),
            price_yearly: parseFloat(values.priceYearly),
            is_audited: values.isAudited,
            tags: tags,
            is_active: true,
            performance_roi: 0,
            performance_win_rate: 0,
            performance_drawdown: 0,
            performance_trades_per_day: 0,
            performance_total_trades: 0,
            performance_avg_profit_per_trade: 0,
            performance_rating: 0,
            subscriptions: 0,
          }
        ])
        .select();

      if (error) throw error;

      toast.success("Bot created successfully!");
      form.reset();
      refetch(); // Refetch the bots list
    } catch (error: any) {
      console.error("Error creating bot:", error);
      toast.error(error.message || "Failed to create bot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBotStatus = async (botId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('bots')
        .update({ is_active: !isActive })
        .eq('id', botId);
      
      if (error) throw error;
      
      toast.success(`Bot ${isActive ? 'deactivated' : 'activated'} successfully`);
      refetch(); // Refetch the bots list
    } catch (error: any) {
      console.error("Error toggling bot status:", error);
      toast.error(error.message || "Failed to update bot status");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bot Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage trading bots on the platform
          </p>
        </div>

        <Tabs defaultValue="manage">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manage">Manage Bots</TabsTrigger>
            <TabsTrigger value="create">Create New Bot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Trading Bots</CardTitle>
                <CardDescription>
                  Manage bots you've created on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {botsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-tw-blue" />
                    <span className="ml-2">Loading bots...</span>
                  </div>
                ) : bots && bots.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Risk Level</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Market</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Monthly Price</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bots.map((bot) => (
                          <tr key={bot.id} className="border-b">
                            <td className="px-4 py-3 text-sm">{bot.name}</td>
                            <td className="px-4 py-3 text-sm capitalize">{bot.risk_level}</td>
                            <td className="px-4 py-3 text-sm capitalize">{bot.market}</td>
                            <td className="px-4 py-3 text-sm">${bot.price_monthly.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                bot.is_active 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {bot.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(bot.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-right space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toggleBotStatus(bot.id, bot.is_active)}
                              >
                                {bot.is_active ? "Deactivate" : "Activate"}
                              </Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">You haven't created any bots yet</p>
                    <Button 
                      onClick={() => document.querySelector('[data-value="create"]')?.click()}
                      className="bg-tw-blue hover:bg-tw-blue-dark"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Bot
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Trading Bot</CardTitle>
                <CardDescription>
                  Fill out the form to add a new trading bot to the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bot Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Trend Master Pro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., forex, trending, momentum" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter tags separated by commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bot Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what this bot does and its main features..."
                              className="h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="strategyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strategy Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a strategy" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="trend_following">Trend Following</SelectItem>
                                <SelectItem value="mean_reversion">Mean Reversion</SelectItem>
                                <SelectItem value="breakout">Breakout</SelectItem>
                                <SelectItem value="scalping">Scalping</SelectItem>
                                <SelectItem value="ai_driven">AI Driven</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="riskLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Risk Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select risk level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low Risk</SelectItem>
                                <SelectItem value="medium">Medium Risk</SelectItem>
                                <SelectItem value="high">High Risk</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="strategyDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strategy Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe how the trading strategy works..."
                              className="h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="market"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Market</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select market" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="forex">Forex</SelectItem>
                                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                                <SelectItem value="stocks">Stocks</SelectItem>
                                <SelectItem value="commodities">Commodities</SelectItem>
                                <SelectItem value="multiple">Multiple Markets</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeFrame"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Frame</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time frame" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1m">1 Minute</SelectItem>
                                <SelectItem value="5m">5 Minutes</SelectItem>
                                <SelectItem value="15m">15 Minutes</SelectItem>
                                <SelectItem value="30m">30 Minutes</SelectItem>
                                <SelectItem value="1h">1 Hour</SelectItem>
                                <SelectItem value="4h">4 Hours</SelectItem>
                                <SelectItem value="1d">Daily</SelectItem>
                                <SelectItem value="1w">Weekly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isAudited"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 text-tw-blue focus:ring-tw-blue border-gray-300 rounded"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Bot is Audited</FormLabel>
                              <FormDescription>
                                Check if this bot has been audited
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="priceMonthly"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.01" placeholder="e.g., 49.99" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priceYearly"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yearly Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.01" placeholder="e.g., 499.99" {...field} />
                            </FormControl>
                            <FormDescription>
                              Usually offered at a discount to monthly price
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-tw-blue hover:bg-tw-blue-dark"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Bot...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create Bot
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminBotManagement;
