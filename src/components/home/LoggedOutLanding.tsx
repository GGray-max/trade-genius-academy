import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import TrendingBots from "@/components/bots/TrendingBots";

/**
 * LoggedOutLanding
 * ----------------------------------------------------------------------------
 * The existing marketing / landing experience extracted into its own component
 * so that the home route can conditionally render based on auth status.
 *
 * This component is a pure layout wrapper around the existing public-facing
 * sections (Hero, Features, etc.) and should remain visually identical to the
 * prior implementation found directly in `src/pages/Index.tsx`.
 */
const LoggedOutLanding = () => {
  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 py-10">
        <TrendingBots />
      </div>
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default LoggedOutLanding;
