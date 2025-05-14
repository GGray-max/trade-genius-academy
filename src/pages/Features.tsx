
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Check } from "lucide-react";

const Features = () => {
  const featuresList = [
    {
      title: "Algorithmic Trading",
      description:
        "Use sophisticated algorithms to execute trades at optimal prices and times.",
      benefits: [
        "Reduced emotional trading decisions",
        "24/7 market monitoring",
        "Consistent strategy execution",
        "Backtesting capabilities"
      ]
    },
    {
      title: "Risk Management",
      description:
        "Built-in risk management tools to protect your investments.",
      benefits: [
        "Stop-loss automation",
        "Position sizing controls",
        "Risk/reward ratio analysis",
        "Portfolio diversification tools"
      ]
    },
    {
      title: "Market Analysis",
      description:
        "Comprehensive market analysis tools to inform your trading strategies.",
      benefits: [
        "Technical indicators library",
        "Real-time market data",
        "Pattern recognition",
        "Sentiment analysis integration"
      ]
    },
    {
      title: "Performance Tracking",
      description:
        "Track and analyze your trading performance over time.",
      benefits: [
        "Performance dashboards",
        "Trade journals",
        "Profit/loss reporting",
        "Strategy performance metrics"
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Trading Bot</span>
            <span className="block text-tw-blue">Features & Capabilities</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover the powerful features that make TradeWizard the premier platform for automated trading strategies.
          </p>
        </div>

        <div className="mt-24 space-y-24">
          {featuresList.map((feature, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}>
              <div className="flex-1">
                <div className={`p-8 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  <h2 className="text-3xl font-bold text-gray-900">{feature.title}</h2>
                  <p className="mt-4 text-lg text-gray-500">
                    {feature.description}
                  </p>
                  <ul className={`mt-8 space-y-4 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center">
                        {index % 2 === 1 && <div className="flex-1"></div>}
                        <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span className="ml-3 text-gray-700">{benefit}</span>
                        {index % 2 === 0 && <div className="flex-1"></div>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex-1 p-8">
                <div className={`bg-gradient-to-r from-tw-blue to-tw-green h-64 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-xl ${index % 2 === 0 ? 'transform rotate-3' : 'transform -rotate-3'}`}>
                  Feature Visualization
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Ready to experience these features?
          </h2>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Button className="bg-tw-blue hover:bg-tw-blue-dark text-white px-8">
                Get Started
              </Button>
            </div>
            <div className="ml-3 inline-flex">
              <Button variant="outline" className="text-tw-blue border-tw-blue hover:bg-tw-blue-light px-8">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Features;
