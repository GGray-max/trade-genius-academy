
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'developer' | 'admin';
  joinedAt: string;
  badges: Badge[];
  currency: 'KES' | 'USD' | 'EUR';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Bot {
  id: string;
  name: string;
  description: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  strategy: BotStrategy;
  riskLevel: 'low' | 'medium' | 'high';
  performance: BotPerformance;
  price: {
    monthly: number;
    yearly: number;
    currency: 'KES' | 'USD' | 'EUR';
  };
  isAudited: boolean;
  auditReport?: string;
  tags: string[];
  signals: Signal[];
  reviews: Review[];
  subscriptions: number;
  isActive: boolean;
}

export interface BotStrategy {
  type: 'trend_following' | 'mean_reversion' | 'breakout' | 'scalping' | 'ai_driven';
  description: string;
  market: 'forex' | 'crypto' | 'stocks' | 'commodities' | 'multiple';
  timeFrame: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
}

export interface BotPerformance {
  roi: number;
  winRate: number;
  drawdown: number;
  tradesPerDay: number;
  totalTrades: number;
  avgProfitPerTrade: number;
  monthlyStats: MonthlyPerformance[];
  rating: number;
  badges: string[];
}

export interface MonthlyPerformance {
  month: string;
  roi: number;
  trades: number;
}

export interface Signal {
  id: string;
  botId: string;
  type: 'buy' | 'sell';
  asset: string;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timestamp: string;
  status: 'active' | 'closed' | 'cancelled';
  closedAt?: string;
  profit?: number;
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  timestamp: string;
  likes: number;
  replies: ReviewReply[];
}

export interface ReviewReply {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  comment: string;
  timestamp: string;
  isFromDeveloper: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  botId: string;
  startDate: string;
  endDate: string;
  plan: 'monthly' | 'yearly';
  isActive: boolean;
  price: number;
  currency: 'KES' | 'USD' | 'EUR';
}

export interface Question {
  id: string;
  question: string;
  options?: string[];
  type: 'text' | 'select' | 'radio' | 'checkbox' | 'slider';
  required: boolean;
  category: 'strategy' | 'risk' | 'capital' | 'market' | 'advanced';
}

export interface RoiForecast {
  minROI: number;
  maxROI: number;
  avgROI: number;
  confidenceLevel: number;
  conditions: {
    marketTrend: 'bullish' | 'bearish' | 'sideways';
    volatility: 'low' | 'medium' | 'high';
    timeframe: string;
  };
}
