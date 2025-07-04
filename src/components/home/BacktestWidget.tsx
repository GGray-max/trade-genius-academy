import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";

interface MockResult {
  roi: string;
  drawdown: string;
}

// TODO: Replace with real bots list fetched for the user
const mockBots = [
  { id: "bot1", name: "Momentum Master" },
  { id: "bot2", name: "Mean Reverter" },
  { id: "bot3", name: "Breakout Hunter" },
];

const BacktestWidget = () => {
  const [selectedBot, setSelectedBot] = useState<string | undefined>();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [result, setResult] = useState<MockResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCsvFile(file);
  };

  const runBacktest = () => {
    if (!selectedBot || !csvFile) return;
    setLoading(true);
    // Simulate async backtest – replace with backend call
    setTimeout(() => {
      setResult({ roi: "+42.7%", drawdown: "-6.3%" });
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">🧪 Backtest Simulator</h2>
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Bot selector */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Choose Bot</label>
            <Select value={selectedBot} onValueChange={setSelectedBot}>
              <SelectTrigger>
                <SelectValue placeholder="Select a bot" />
              </SelectTrigger>
              <SelectContent>
                {mockBots.map((bot) => (
                  <SelectItem key={bot.id} value={bot.id}>
                    {bot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* CSV upload */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Upload CSV</label>
            <Button asChild variant="outline" className="w-full">
              <label htmlFor="csv-upload" className="cursor-pointer inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {csvFile ? csvFile.name : "Choose File"}
              </label>
            </Button>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {/* Run button */}
          <div className="flex items-end">
            <Button
              variant="success"
              className="w-full"
              disabled={!selectedBot || !csvFile || loading}
              onClick={runBacktest}
            >
              {loading ? "Running..." : "Run Backtest"}
            </Button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-300">ROI</p>
              <p className="text-2xl font-bold text-tw-green">{result.roi}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-300">Max Drawdown</p>
              <p className="text-2xl font-bold text-tw-red">{result.drawdown}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BacktestWidget;
