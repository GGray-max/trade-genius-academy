import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface AgentSelectorProps {
  selectedAgent: string;
  onAgentChange: Dispatch<SetStateAction<string>>;
}

const agents = ["Scalper AI", "Swing AI", "Risk-Off AI"];

/**
 * Simple agent selector dropdown.
 * TODO: Replace with gorgeous custom component & dynamic agents list.
 */
const AgentSelector = ({ selectedAgent, onAgentChange }: AgentSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Agent</label>
      <Select value={selectedAgent} onValueChange={onAgentChange}>
        <SelectTrigger className="bg-white/10 backdrop-blur border border-white/20 text-sm">
          <SelectValue placeholder="Select agent" />
        </SelectTrigger>
        <SelectContent className="bg-white/5 backdrop-blur border border-white/10 text-sm">
          {agents.map((agent) => (
            <SelectItem key={agent} value={agent}>
              {agent}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AgentSelector;
