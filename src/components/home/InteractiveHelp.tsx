import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const InteractiveHelp = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        🤖 Interactive Help
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20 flex flex-col sm:flex-row items-center gap-6"
      >
        {/* TODO: Replace icon with Lottie animation */}
        <HelpCircle className="w-16 h-16 text-tw-blue-light" />
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <p className="text-lg font-medium">Need help using TradeWizard?</p>
          <p className="text-gray-300 text-sm">
            Ask our AI assistant for guidance, tips, and best practices.
          </p>
        </div>
        <Button size="lg" className="w-full sm:w-auto">
          Ask the AI Assistant
        </Button>
      </motion.div>
    </section>
  );
};

export default InteractiveHelp;
