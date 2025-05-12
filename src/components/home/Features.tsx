
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "AI-Powered Bot Builder",
      description: "Create trading bots by answering simple questions about your strategy and risk tolerance. Our AI builds the perfect bot for you.",
      icon: "✨",
    },
    {
      title: "Marketplace Leaderboard",
      description: "Discover top-performing bots on our dynamic leaderboard based on real performance metrics, user ratings, and sales volume.",
      icon: "🏆",
    },
    {
      title: "Bot Sandbox Testing",
      description: "Test any bot for 7 days with virtual funds before committing. See real-time simulated performance in a safe environment.",
      icon: "🧪",
    },
    {
      title: "Transparent Trading History",
      description: "View complete signal and trade history for every bot. We value transparency and help you make informed decisions.",
      icon: "📊",
    },
    {
      title: "Community Reviews & Q&A",
      description: "Read honest reviews from real users and get your questions answered directly by bot developers.",
      icon: "💬",
    },
    {
      title: "Custom Signal Filters",
      description: "Create personalized alerts using technical indicators and receive notifications via app, email, or SMS when conditions are met.",
      icon: "🔔",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Traders</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            TradeWizard combines cutting-edge AI technology with a supportive community to help you build and deploy successful trading strategies.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-gradient-hover border border-gray-200 h-full">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
