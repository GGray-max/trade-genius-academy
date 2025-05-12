
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create or Select a Bot",
      description:
        "Either build your own trading bot using our AI-powered wizard or select a high-performing bot from our marketplace.",
      image: "https://placehold.co/600x400/2D46B9/FFFFFF?text=Bot+Creation&font=montserrat",
    },
    {
      number: "02",
      title: "Test in Sandbox Mode",
      description:
        "Validate performance using our sandbox environment with virtual funds and historical market data for 7 days.",
      image: "https://placehold.co/600x400/34D399/FFFFFF?text=Sandbox+Testing&font=montserrat",
    },
    {
      number: "03",
      title: "Subscribe to Trading Signals",
      description:
        "Get real-time signals delivered directly to the app, email, or SMS. Easy integration with multiple brokers.",
      image: "https://placehold.co/600x400/F7CB45/000000?text=Live+Trading&font=montserrat",
    },
    {
      number: "04",
      title: "Monitor and Optimize",
      description:
        "Track performance metrics, earn badges, and fine-tune your strategies based on detailed analytics.",
      image: "https://placehold.co/600x400/1A2B6D/FFFFFF?text=Performance+Tracking&font=montserrat",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How TradeWizard Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform simplifies the process of creating, testing, and deploying automated trading strategies.
          </p>
        </div>

        <div className="space-y-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="bg-gray-100 p-2 rounded-md inline-block mb-4">
                  <span className="text-tw-blue-dark font-bold">{step.number}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-6">{step.description}</p>
                {index === 0 && (
                  <div className="space-x-4">
                    <Link to="/builder">
                      <Button variant="default" className="bg-tw-blue hover:bg-tw-blue-dark">
                        Start Building
                      </Button>
                    </Link>
                    <Link to="/marketplace">
                      <Button variant="outline">Explore Marketplace</Button>
                    </Link>
                  </div>
                )}
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <img
                  src={step.image}
                  alt={step.title}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
