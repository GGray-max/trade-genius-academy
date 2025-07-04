import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// ------------------------------
// MOCK DATA & TYPES
// ------------------------------

interface PricePoint {
  date: string; // ISO date string
  close: number;
}

interface Strategy {
  entry: string;
  exit: string;
  stopLoss: string;
  takeProfit: string;
  riskManagement: string;
}

// Two simple sample datasets: BTC & ETH daily closes (very small subset)
const btcSample: PricePoint[] = [
  { date: "2024-01-01", close: 42000 },
  { date: "2024-01-02", close: 43000 },
  { date: "2024-01-03", close: 41000 },
  { date: "2024-01-04", close: 43500 },
  { date: "2024-01-05", close: 44000 },
  { date: "2024-01-06", close: 45000 },
  { date: "2024-01-07", close: 44500 },
  { date: "2024-01-08", close: 46000 },
  { date: "2024-01-09", close: 47000 },
  { date: "2024-01-10", close: 46500 },
];
const ethSample: PricePoint[] = [
  { date: "2024-01-01", close: 2000 },
  { date: "2024-01-02", close: 2050 },
  { date: "2024-01-03", close: 1900 },
  { date: "2024-01-04", close: 2100 },
  { date: "2024-01-05", close: 2200 },
  { date: "2024-01-06", close: 2250 },
  { date: "2024-01-07", close: 2300 },
  { date: "2024-01-08", close: 2400 },
  { date: "2024-01-09", close: 2450 },
  { date: "2024-01-10", close: 2500 },
];

const datasets: Record<string, PricePoint[]> = {
  btc: btcSample,
  eth: ethSample,
};

// ------------------------------
// Utility functions
// ------------------------------

function sma(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / period;
      result.push(avg);
    }
  }
  return result;
}

interface EquityPoint {
  date: string;
  equity: number;
}

function simulateSimpleSMACrossStrategy(prices: PricePoint[], initialBalance = 10000): EquityPoint[] {
  const closes = prices.map((p) => p.close);
  const sma50 = sma(closes, 3); // short period shortened for tiny dataset
  const sma200 = sma(closes, 5);
  let position = 0; // 0: cash, 1: long
  let cash = initialBalance;
  let asset = 0;
  const equitySeries: EquityPoint[] = [];

  prices.forEach((p, idx) => {
    const short = sma50[idx];
    const long = sma200[idx];
    // Ignore NaN values until both SMAs valid
    if (!isNaN(short) && !isNaN(long)) {
      // Golden cross → go long
      if (short > long && position === 0) {
        position = 1;
        asset = cash / p.close;
        cash = 0;
      }
      // Death cross → exit
      if (short < long && position === 1) {
        cash = asset * p.close;
        asset = 0;
        position = 0;
      }
    }

    const equity = position === 1 ? asset * p.close : cash;
    equitySeries.push({ date: p.date, equity: Math.round(equity) });
  });

  return equitySeries;
}

// ------------------------------
// Component
// ------------------------------

const Backtest = () => {
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [equityCurve, setEquityCurve] = useState<EquityPoint[]>([]);
  const [strategy] = useState<Strategy | null>(() => {
    const stored = localStorage.getItem("latestStrategy");
    return stored ? JSON.parse(stored) : null;
  });

  const runBacktest = () => {
    if (!selectedDataset) {
      toast.error("Please select a dataset");
      return;
    }
    const data = datasets[selectedDataset];
    // TODO: Use strategy rules instead of hardcoded SMA cross when implemented
    const equity = simulateSimpleSMACrossStrategy(data);
    setEquityCurve(equity);
    toast.success("Backtest completed");
  };

  const finalEquity = equityCurve.length ? equityCurve[equityCurve.length - 1].equity : 0;
  const initialEquity = equityCurve.length ? equityCurve[0].equity : 0;
  const totalReturn = initialEquity ? ((finalEquity - initialEquity) / initialEquity) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Backtesting Engine</h1>
          <p className="mt-1 text-sm text-gray-500">Simulate your AI strategy on historical data.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Select dataset and run the simulation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Dataset</Label>
                  <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="btc">BTC Sample (10 days)</SelectItem>
                      <SelectItem value="eth">ETH Sample (10 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {strategy && (
                  <div className="text-sm text-muted-foreground bg-accent/20 p-3 rounded-md space-y-1">
                    <p className="font-medium">Using Latest Strategy:</p>
                    <p>Entry: {strategy.entry}</p>
                    <p>Exit: {strategy.exit}</p>
                  </div>
                )}

                <Button className="w-full" onClick={runBacktest}>
                  Run Backtest
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {equityCurve.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Equity Curve</CardTitle>
                  <CardDescription>Total Return: {totalReturn.toFixed(2)}%</CardDescription>
                </CardHeader>
                <CardContent style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={equityCurve} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="equity" stroke="#8884d8" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {equityCurve.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No results yet. Run a backtest to see the equity curve.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Backtest;
