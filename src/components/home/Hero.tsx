
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="hero-gradient text-white">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              AI-Powered Trading Assistant Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Build, test, and deploy automated trading strategies with ease. Join thousands of traders using TradeWizard to amplify their trading results.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-tw-blue-dark hover:bg-gray-100">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                ))}
              </div>
              <p>Join 5,000+ traders already using TradeWizard</p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">Market Performance</h3>
                <span className="text-tw-green px-2 py-1 rounded text-sm bg-tw-green/20">Live</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-gray-300 text-sm">Total ROI</p>
                    <p className="text-2xl font-bold">+127.4%</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-gray-300 text-sm">Win Rate</p>
                    <p className="text-2xl font-bold">78.5%</p>
                  </div>
                </div>
                <div className="h-40 bg-white/10 rounded-lg p-3 flex items-end">
                  {[32, 42, 51, 49, 63, 58, 70, 96, 88, 103, 98, 110].map((height, i) => (
                    <div key={i} className="flex-grow h-full flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-tw-green to-tw-green-light rounded-sm mx-0.5" 
                        style={{ height: `${height}%` }} 
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-gray-300 text-sm">Trades</p>
                    <p className="text-xl font-bold">2,345</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-gray-300 text-sm">Avg. Profit</p>
                    <p className="text-xl font-bold">$124</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-gray-300 text-sm">Drawdown</p>
                    <p className="text-xl font-bold">7.2%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-8 -right-8 bg-tw-gold/90 text-tw-blue-dark p-3 rounded-lg shadow-lg rotate-3">
              <p className="font-semibold">Top Performer 🏆</p>
              <p className="text-sm">ROI: +215% last month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
