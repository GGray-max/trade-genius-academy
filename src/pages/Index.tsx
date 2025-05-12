
import MainLayout from "@/components/layout/MainLayout";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import TrendingBots from "@/components/bots/TrendingBots";

const Index = () => {
  return (
    <MainLayout>
      <Hero />
      <div className="container mx-auto px-4 py-10">
        <TrendingBots />
      </div>
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
