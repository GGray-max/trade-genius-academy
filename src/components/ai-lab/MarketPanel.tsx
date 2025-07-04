import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Maximize2, Minimize2 } from "lucide-react";

/**
 * MarketPanel renders trading chart, symbol & broker selectors and a mock portfolio summary.
 * TODO: Replace iframe with dynamic TradingView widget and hook real portfolio data.
 */
const symbols = ["BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT"];
const symbolToTv: Record<string, string> = {
  "BTC/USDT": "BINANCE:BTCUSDT",
  "ETH/USDT": "BINANCE:ETHUSDT",
  "BNB/USDT": "BINANCE:BNBUSDT",
  "SOL/USDT": "BINANCE:SOLUSDT",
};
const brokers = ["Binance", "Deriv", "Bybit", "Kraken"];

const MarketPanel = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const [symbol, setSymbol] = useState(symbols[0]);
  const [broker, setBroker] = useState(brokers[0]);

  const portfolio = {
    balance: "10,000 USDT",
    openTrades: 3,
    pnl: "+5.4%",
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden gap-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Symbol Selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Symbol</label>
          <Select value={symbol} onValueChange={setSymbol}>
            <SelectTrigger className="w-40 bg-white/10 backdrop-blur border border-white/20 text-sm">
              <SelectValue placeholder="Symbol" />
            </SelectTrigger>
            <SelectContent className="bg-white/5 backdrop-blur border border-white/10 text-sm">
              {symbols.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Broker Selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Broker</label>
          <Select value={broker} onValueChange={setBroker}>
            <SelectTrigger className="w-36 bg-white/10 backdrop-blur border border-white/20 text-sm">
              <SelectValue placeholder="Broker" />
            </SelectTrigger>
            <SelectContent className="bg-white/5 backdrop-blur border border-white/10 text-sm">
              {brokers.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart Heading & Fullscreen toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <span className="text-white/90">{symbol}</span>
          <span className="text-sm bg-white/10 px-2 py-0.5 rounded backdrop-blur border border-white/10">
            {broker}
          </span>
        </h2>
        <button
          className="p-1 rounded bg-white/10 hover:bg-white/20 transition backdrop-blur border border-white/20"
          onClick={() => setFullScreen(!fullScreen)}
        >
          {fullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

            {/* Trading Chart */}
      <div className="flex-grow min-h-0 bg-white/5 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 overflow-hidden ring-1 ring-white/5">
        <iframe
          title="Trading Chart"
          src={`https://s.tradingview.com/widgetembed/?symbol=${symbolToTv[symbol]}&interval=60&hidetoptoolbar=1&symboledit=1&saveimage=1&toolbarbg=20222B&studies=[]&theme=dark`}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
        />
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-3 gap-4 pb-4">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-300">Balance</p>
          <p className="text-xl font-semibold">{portfolio.balance}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-300">Open Trades</p>
          <p className="text-xl font-semibold">{portfolio.openTrades}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-300">P&L</p>
          <p className="text-xl font-semibold text-tw-green">{portfolio.pnl}</p>
        </div>
      </div>
    </div>
  );
};

export default MarketPanel;
