import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

// ----------------------
// Mock Market Data (BTC & ETH daily closes last 10 days)
// ----------------------
const marketData = {
  BTC: [42000, 43000, 41000, 43500, 44000, 45000, 44500, 46000, 47000, 46500],
  ETH: [2000, 2050, 1900, 2100, 2200, 2250, 2300, 2400, 2450, 2500],
};

// ----------------------
// Mock Headlines
// ----------------------
const headlines = [
  { symbol: "BTC", text: "Bitcoin rallies as ETF demand surges" },
  { symbol: "BTC", text: "Regulatory fears loom over crypto market" },
  { symbol: "ETH", text: "Ethereum upgrade boosts investor confidence" },
  { symbol: "ETH", text: "Gas fees spike causing user frustration" },
];

// ----------------------
// Simple Sentiment Analysis
// ----------------------
const positiveWords = ["rallies", "surges", "boosts", "confidence", "soars", "record"];
const negativeWords = ["fears", "loom", "crash", "frustration", "drop", "decline"];

function sentimentScore(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;
  positiveWords.forEach((w) => {
    if (lower.includes(w)) score += 1;
  });
  negativeWords.forEach((w) => {
    if (lower.includes(w)) score -= 1;
  });
  return score;
}

// ----------------------
// Technical Pattern Detection (simple SMA crossover)
// ----------------------
function sma(data: number[], period: number): number[] {
  return data.map((_, idx) => {
    if (idx < period - 1) return NaN;
    const slice = data.slice(idx - period + 1, idx + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

function detectSignals(prices: number[]): { type: string; idx: number }[] {
  const smaShort = sma(prices, 3);
  const smaLong = sma(prices, 5);
  const signals: { type: string; idx: number }[] = [];
  prices.forEach((_, i) => {
    if (i === 0 || isNaN(smaShort[i]) || isNaN(smaLong[i])) return;
    if (smaShort[i] > smaLong[i] && smaShort[i - 1] <= smaLong[i - 1]) {
      signals.push({ type: "bullish", idx: i });
    }
    if (smaShort[i] < smaLong[i] && smaShort[i - 1] >= smaLong[i - 1]) {
      signals.push({ type: "bearish", idx: i });
    }
  });
  return signals;
}

interface CombinedSignal {
  symbol: string;
  dateIdx: number;
  pattern: string;
  sentiment: number;
  action: "Buy" | "Sell" | "Hold";
}

function generateCombinedSignals(): CombinedSignal[] {
  const result: CombinedSignal[] = [];
  (Object.keys(marketData) as (keyof typeof marketData)[]).forEach((sym) => {
    const prices = marketData[sym];
    const patterns = detectSignals(prices);
    const sentiment = headlines
      .filter((h) => h.symbol === sym)
      .reduce((acc, h) => acc + sentimentScore(h.text), 0);
    patterns.forEach((p) => {
      let action: "Buy" | "Sell" | "Hold" = "Hold";
      if (p.type === "bullish" && sentiment >= 0) action = "Buy";
      if (p.type === "bearish" && sentiment <= 0) action = "Sell";
      result.push({ symbol: sym, dateIdx: p.idx, pattern: p.type, sentiment, action });
    });
  });
  return result;
}

const combinedSignals = generateCombinedSignals();

const Signals = () => {
  return (
  <DashboardLayout>
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Intelligent Signals</h1>
      <p className="text-sm text-muted-foreground">Market pattern detection combined with headline sentiment.</p>
    <Tabs defaultValue="signals" className="mt-6">
          <TabsList>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="charts">Price Charts</TabsTrigger>
          </TabsList>

          {/* Signals Table */}
          <TabsContent value="signals">
            <Card>
              <CardHeader>
                <CardTitle>Combined Signals</CardTitle>
                <CardDescription>Buy/Sell recommendations based on technical + sentiment.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="py-2 px-2">Symbol</th>
                        <th className="py-2 px-2">Pattern</th>
                        <th className="py-2 px-2">Sentiment</th>
                        <th className="py-2 px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {combinedSignals.map((s, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="py-2 px-2 font-medium">{s.symbol}</td>
                          <td className="py-2 px-2">
                            <Badge variant={s.pattern === "bullish" ? "default" : "secondary"}>{s.pattern}</Badge>
                          </td>
                          <td className="py-2 px-2">{s.sentiment}</td>
                          <td className="py-2 px-2 font-bold">
                            {s.action === "Buy" ? (
                              <span className="text-green-600">Buy</span>
                            ) : s.action === "Sell" ? (
                              <span className="text-red-600">Sell</span>
                            ) : (
                              <span>Hold</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {combinedSignals.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-muted-foreground">
                            No signals detected.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sentiment Breakdown */}
          <TabsContent value="sentiment">
            <Card>
              <CardHeader>
                <CardTitle>Headline Sentiment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {headlines.map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between border p-2 rounded-md">
                    <span>{h.text}</span>
                    <Badge variant={sentimentScore(h.text) >= 0 ? "default" : "secondary"}>
                      {sentimentScore(h.text) >= 0 ? "Positive" : "Negative"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Price Charts */}
          <TabsContent value="charts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(marketData) as (keyof typeof marketData)[]).map((sym) => {
                const prices = marketData[sym];
                const chartData = prices.map((p, i) => ({ idx: i, price: p }));
                return (
                  <Card key={sym}>
                    <CardHeader>
                      <CardTitle>{sym} Price</CardTitle>
                    </CardHeader>
                    <CardContent style={{ height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="idx" hide />
                          <YAxis domain={[Math.min(...prices) * 0.95, Math.max(...prices) * 1.05]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Signals;