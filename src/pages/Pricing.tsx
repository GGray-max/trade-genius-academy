
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = (tier: string) => {
    if (!user) {
      navigate("/signup");
    } else {
      navigate("/dashboard");
    }
  };

  const tiers = [
    {
      name: "Starter",
      description: "Perfect for beginners and casual traders",
      price: billingPeriod === "monthly" ? 29 : 290,
      features: [
        "Access to 3 basic trading bots",
        "Paper trading mode",
        "Basic market data",
        "Email support",
        "Daily performance reports",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      description: "For serious traders who want more power",
      price: billingPeriod === "monthly" ? 79 : 790,
      features: [
        "Access to 10 advanced trading bots",
        "Live trading capability",
        "Advanced technical indicators",
        "Priority email support",
        "Hourly performance reports",
        "Custom risk parameters",
        "API access",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      description: "For institutional traders and firms",
      price: billingPeriod === "monthly" ? 299 : 2990,
      features: [
        "Access to all trading bots",
        "Custom bot development",
        "Premium market data feeds",
        "24/7 dedicated support",
        "Real-time performance analytics",
        "Custom integrations",
        "White-label options",
        "Dedicated account manager",
      ],
      highlighted: false,
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Choose the perfect plan for your trading needs.
            No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-4">
            <span className={billingPeriod === "monthly" ? "font-semibold text-tw-blue" : "text-gray-500"}>
              Monthly
            </span>
            <Switch 
              checked={billingPeriod === "annually"}
              onCheckedChange={() => setBillingPeriod(billingPeriod === "monthly" ? "annually" : "monthly")}
            />
            <span className={billingPeriod === "annually" ? "font-semibold text-tw-blue" : "text-gray-500"}>
              Annually <span className="text-green-600">(Save 15%)</span>
            </span>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {tiers.map((tier, index) => (
            <Card 
              key={index} 
              className={tier.highlighted ? "border-tw-blue shadow-lg shadow-tw-blue/20 relative" : ""}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="px-4 py-1 bg-tw-blue text-white rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-gray-500">/{billingPeriod === "monthly" ? "month" : "year"}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={tier.highlighted ? "w-full bg-tw-blue hover:bg-tw-blue-dark" : "w-full"}
                  onClick={() => handleGetStarted(tier.name)}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-24 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg">Can I cancel my subscription?</h3>
              <p className="mt-2 text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access to the features until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Do you offer refunds?</h3>
              <p className="mt-2 text-gray-600">We offer a 14-day money-back guarantee if you're not satisfied with our service.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Can I switch between plans?</h3>
              <p className="mt-2 text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your billing cycle.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">What payment methods do you accept?</h3>
              <p className="mt-2 text-gray-600">We accept all major credit cards, PayPal, and cryptocurrency payments.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing;
