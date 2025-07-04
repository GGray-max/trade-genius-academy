export interface BotLog {
  date: string; // ISO date string (YYYY-MM)
  roi: number; // Monthly ROI in %
  drawdown: number; // Max drawdown in % (negative)
}

// Mock historical bot performance (last 12 months)
export const botLogs: BotLog[] = [
  { date: "2024-01", roi: 2.5, drawdown: -1.2 },
  { date: "2024-02", roi: 3.1, drawdown: -1.5 },
  { date: "2024-03", roi: -0.8, drawdown: -4.2 },
  { date: "2024-04", roi: 1.9, drawdown: -2.0 },
  { date: "2024-05", roi: 4.2, drawdown: -1.0 },
  { date: "2024-06", roi: 5.3, drawdown: -0.9 },
  { date: "2024-07", roi: 6.0, drawdown: -0.8 },
  { date: "2024-08", roi: 4.8, drawdown: -1.3 },
  { date: "2024-09", roi: 3.7, drawdown: -1.1 },
  { date: "2024-10", roi: 2.2, drawdown: -2.5 },
  { date: "2024-11", roi: 1.5, drawdown: -3.0 },
  { date: "2024-12", roi: 3.9, drawdown: -1.4 },
];
