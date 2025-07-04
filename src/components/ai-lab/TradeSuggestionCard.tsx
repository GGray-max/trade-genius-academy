import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TradeSuggestion {
  id: string;
  symbol: string;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  confidence: number; // 0-1
  risk: "Low" | "Medium" | "High";
}

interface TradeSuggestionCardProps {
  suggestion: TradeSuggestion;
  onConfirm: (id: string) => void;
  onDecline: (id: string) => void;
}

const TradeSuggestionCard = ({ suggestion, onConfirm, onDecline }: TradeSuggestionCardProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 space-y-3 border border-white/10 ring-1 ring-white/5 shadow-xl transition transform hover:scale-105">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">{suggestion.symbol}</h4>
        <span
          className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            suggestion.risk === "Low" && "bg-tw-green/20 text-tw-green",
            suggestion.risk === "Medium" && "bg-tw-yellow/20 text-tw-yellow-500",
            suggestion.risk === "High" && "bg-tw-red/20 text-tw-red"
          )}
        >
          {suggestion.risk}
        </span>
      </div>
      <div className="text-xs grid grid-cols-3 gap-1">
        <span className="text-gray-300">Entry</span>
        <span className="text-gray-300">SL</span>
        <span className="text-gray-300">TP</span>
        <span>{suggestion.entry}</span>
        <span>{suggestion.stopLoss}</span>
        <span>{suggestion.takeProfit}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Confidence</span>
        <span>{(suggestion.confidence * 100).toFixed(0)}%</span>
      </div>
      {/* Confidence bar */}
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className={cn(
            "h-2 rounded-full",
            suggestion.confidence > 0.75
              ? "bg-tw-green"
              : suggestion.confidence > 0.5
              ? "bg-tw-yellow-500"
              : "bg-tw-red"
          )}
          style={{ width: `${suggestion.confidence * 100}%` }}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button className="flex-1" size="sm" onClick={() => onConfirm(suggestion.id)}>
          Confirm
        </Button>
        <Button className="flex-1" variant="outline" size="sm" onClick={() => onDecline(suggestion.id)}>
          Decline
        </Button>
      </div>
    </div>
  );
};

export default TradeSuggestionCard;
