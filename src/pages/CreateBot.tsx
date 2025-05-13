
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Bot, ChevronRight } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(3, { message: "Bot name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Please provide a more detailed description" }),
  strategyType: z.enum(["trend_following", "mean_reversion", "breakout", "scalping", "ai_driven"]),
  market: z.enum(["forex", "crypto", "stocks", "commodities", "multiple"]),
  timeFrame: z.enum(["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w"]),
  riskLevel: z.enum(["low", "medium", "high"]),
  monthlyPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Must be a valid price" }),
  yearlyPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Must be a valid price" }),
  tags: z.string(),
});

const CreateBot = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      strategyType: "trend_following",
      market: "forex",
      timeFrame: "1h",
      riskLevel: "medium",
      monthlyPrice: "",
      yearlyPrice: "",
      tags: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Here you would connect to your API/Supabase
      console.log("Bot creation data:", values);
      
      // Process the tags
      const tagArray = values.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const botData = {
        ...values,
        tags: tagArray,
        price: {
          monthly: parseFloat(values.monthlyPrice),
          yearly: parseFloat(values.yearlyPrice),
          currency: "USD" // Could be made selectable
        },
        createdAt: new Date().toISOString()
      };
      
      console.log("Processed bot data:", botData);
      
      toast.success("Bot created successfully!");
      // Navigate to the bot details page or bot list
      // navigate("/dashboard/bots");
    } catch (error: any) {
      console.error("Bot creation error:", error);
      toast.error(error.message || "Failed to create bot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepOne = () => (
    <>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bot Name</FormLabel>
              <FormControl>
                <Input placeholder="My Amazing Trading Bot" {...field} />
              </FormControl>
              <FormDescription>
                Choose a memorable and descriptive name for your bot
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
              <FormLabel>Bot Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your bot's strategy, performance expectations, and unique features..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description that helps users understand your bot's approach
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          type="button" 
          className="bg-tw-blue hover:bg-tw-blue-dark"
          onClick={() => setStep(2)}
        >
          Next Step
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormDescription>The core strategy your bot uses</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="market"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Market</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select markets" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="forex">Forex</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="stocks">Stocks</SelectItem>
                    <SelectItem value="commodities">Commodities</SelectItem>
                    <SelectItem value="multiple">Multiple Markets</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Markets your bot trades in</FormDescription>
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
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Primary trading time frame</FormDescription>
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
                <FormDescription>Risk profile of your trading bot</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="forex, trend, indicators" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated tags to help users find your bot
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6 flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setStep(1)}
        >
          Back
        </Button>
        <Button 
          type="button" 
          className="bg-tw-blue hover:bg-tw-blue-dark"
          onClick={() => setStep(3)}
        >
          Next Step
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </>
  );

  const renderStepThree = () => (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="monthlyPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Price (USD)</FormLabel>
                <FormControl>
                  <Input placeholder="29.99" {...field} />
                </FormControl>
                <FormDescription>Monthly subscription price</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearlyPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yearly Price (USD)</FormLabel>
                <FormControl>
                  <Input placeholder="299.99" {...field} />
                </FormControl>
                <FormDescription>Annual subscription price (usually discounted)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Important Information</CardTitle>
            <CardDescription>Please read before submitting your bot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>By submitting your bot, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Have your bot reviewed by our team before it becomes available</li>
              <li>Share performance statistics publicly on the marketplace</li>
              <li>Receive 70% of all subscription revenue from your bot</li>
              <li>Respond to user questions within 48 hours</li>
              <li>Maintain and update your bot as needed</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setStep(2)}
        >
          Back
        </Button>
        <Button 
          type="submit" 
          className="bg-tw-blue hover:bg-tw-blue-dark"
          disabled={isLoading}
        >
          <Bot className="mr-2 h-4 w-4" />
          {isLoading ? "Creating Bot..." : "Create Bot"}
        </Button>
      </div>
    </>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center">
          <div
            className={`rounded-full flex items-center justify-center w-10 h-10 ${
              step >= i
                ? "bg-tw-blue text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {i}
          </div>
          <span className="text-xs mt-1">
            {i === 1 ? "Basic Info" : i === 2 ? "Strategy Details" : "Pricing"}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Create New Bot</h1>
          <p className="mt-1 text-sm text-gray-500">
            Share your trading strategy with the world and earn revenue
          </p>
        </div>

        {renderStepIndicator()}

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? "Basic Information" : 
               step === 2 ? "Strategy Details" : 
               "Pricing and Submission"}
            </CardTitle>
            <CardDescription>
              {step === 1 ? "Provide general information about your bot" : 
               step === 2 ? "Define your bot's strategy and market approach" : 
               "Set subscription prices and finalize your submission"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {step === 1 && renderStepOne()}
                {step === 2 && renderStepTwo()}
                {step === 3 && renderStepThree()}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateBot;
