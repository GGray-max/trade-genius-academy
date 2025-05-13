
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

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
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(2000, {
    message: "Description must not exceed 2000 characters."
  }),
  strategy: z.string().min(1, {
    message: "Please select a strategy.",
  }),
  riskLevel: z.string().min(1, {
    message: "Please select a risk level.",
  }),
  market: z.string().min(1, {
    message: "Please select a market.",
  }),
  budget: z.string().optional(),
  adminId: z.string().optional(),
});

const RequestBot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<{id: string, username: string}[]>([]);

  // Fetch admins when component mounts
  useState(() => {
    const fetchAdmins = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('role', 'admin');
      
      if (error) {
        console.error('Error fetching admins:', error);
        return;
      }
      
      if (data) {
        setAdmins(data);
      }
    };
    
    fetchAdmins();
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      strategy: "",
      riskLevel: "",
      market: "",
      budget: "",
      adminId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to request a bot");
      return;
    }

    setIsLoading(true);
    try {
      // Insert the bot request into the bot_requests table
      const { error } = await supabase
        .from('bot_requests')
        .insert([
          {
            user_id: user.id,
            title: values.title,
            description: values.description,
            strategy: values.strategy,
            risk_level: values.riskLevel,
            market: values.market,
            budget: values.budget || null,
            admin_id: values.adminId || null,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast.success("Bot request submitted successfully!");
      navigate("/dashboard/bot-requests");
    } catch (error: any) {
      console.error("Error submitting bot request:", error);
      toast.error(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Request a Custom Trading Bot</h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill out the form below to request our experts to build a custom trading bot for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Bot Request Form</CardTitle>
              <CardDescription>
                Provide details about the trading bot you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot Name / Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Trend Following Crypto Bot" {...field} />
                        </FormControl>
                        <FormDescription>
                          Give your bot request a descriptive name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what you want your bot to do, any specific features, and your trading goals..."
                            className="h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The more details you provide, the better we can meet your needs
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="strategy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trading Strategy</FormLabel>
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
                              <SelectItem value="custom">Custom (describe in description)</SelectItem>
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

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., $1000" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your approximate budget for this custom bot
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="adminId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign to Specific Admin (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an admin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {admins.map((admin) => (
                              <SelectItem key={admin.id} value={admin.id}>
                                {admin.username}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Leave blank to let our team assign an admin
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-tw-blue hover:bg-tw-blue-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 list-decimal list-inside text-sm">
                  <li>Submit your request with detailed requirements</li>
                  <li>Our admin team reviews your request</li>
                  <li>An expert developer is assigned to your project</li>
                  <li>You'll receive regular updates on development progress</li>
                  <li>Test and approve your custom bot before final delivery</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Not sure what to request? Our team is here to help you define your trading bot requirements.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RequestBot;
