
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-tw-blue to-tw-green-dark text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Trading Experience?
        </h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto">
          Join thousands of traders who are already using TradeWizard to enhance their trading strategies and increase their returns.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="bg-white text-tw-blue-dark hover:bg-gray-100 w-full sm:w-auto">
              Get Started Free
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
