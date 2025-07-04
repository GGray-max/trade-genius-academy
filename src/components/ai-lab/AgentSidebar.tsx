import React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Bot } from "lucide-react";
import AIChatPanel from "./AIChatPanel";
import TradeSuggestionCard, { TradeSuggestion } from "./TradeSuggestionCard";

interface AgentSidebarProps {
  collapsed: boolean;
}

const mockSuggestions: TradeSuggestion[] = [
  {
    id: "1",
    symbol: "BTC/USDT",
    entry: "43000",
    stopLoss: "42500",
    takeProfit: "44000",
    confidence: 0.78,
    risk: "Medium",
  },
  {
    id: "2",
    symbol: "ETH/USDT",
    entry: "3100",
    stopLoss: "3000",
    takeProfit: "3300",
    confidence: 0.64,
    risk: "Low",
  },
];

const AgentSidebar = ({ collapsed }: AgentSidebarProps) => {
  const agents = ["Scalper AI", "Swing AI", "Sentiment AI"];
  const [selectedAgent, setSelectedAgent] = React.useState(agents[0]);
  const [suggestions, setSuggestions] = React.useState<TradeSuggestion[]>(mockSuggestions);

  const confirmTrade = (id: string) => {
    // TODO: Trigger trade execution service
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  const declineTrade = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div
      className={cn(
        "h-full w-[380px] overflow-hidden relative transition-transform duration-300",
        collapsed ? "hidden" : "block"
      )}
    >
      {/* Sidebar Content */}
      <div className="h-full flex flex-col bg-[#1e2438]/70 backdrop-blur-lg p-4 text-white shadow-lg space-y-2 overflow-y-auto">
        <h3 className="text-lg font-semibold">AI Assistant</h3>

        {/* Agent selector dropdown */}
        <div>
          <label className="text-xs font-medium mb-1 block">Agent</label>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-full h-9 bg-[#2b3248]/60 text-sm text-white backdrop-blur border border-white/20">
              <SelectValue placeholder="Select agent" />
              <Bot className="ml-auto h-4 w-4 opacity-60" />
            </SelectTrigger>
            <SelectContent className="bg-[#2b3248]/80 backdrop-blur border border-white/20">
              {agents.map((agent) => (
                <SelectItem key={agent} value={agent}>
                  {agent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chat panel */}
        <div className="flex-1 overflow-hidden">
          <AIChatPanel />
        </div>

        {/* Trade Suggestions */}
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {suggestions.length === 0 && (
            <p className="text-xs text-center text-gray-400">No suggestions available.</p>
          )}
          {suggestions.map((s) => (
            <TradeSuggestionCard
              key={s.id}
              suggestion={s}
              onConfirm={confirmTrade}
              onDecline={declineTrade}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentSidebar;
