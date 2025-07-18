
import { Bot, User, Badge } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    avatar: 'https://placehold.co/100/1A2B6D/FFFFFF?text=JD&font=montserrat',
    role: 'user',
    joinedAt: '2023-01-15T12:00:00Z',
    badges: [
      {
        id: 'b1',
        name: 'Early Adopter',
        description: 'Joined during beta phase',
        icon: '🌟',
        earnedAt: '2023-01-15T12:30:00Z',
      },
      {
        id: 'b2',
        name: 'First Bot',
        description: 'Purchased your first bot',
        icon: '🤖',
        earnedAt: '2023-01-20T14:45:00Z',
      },
    ],
    currency: 'USD',
  },
  {
    id: '2',
    username: 'sarahdev',
    email: 'sarah@example.com',
    avatar: 'https://placehold.co/100/34D399/FFFFFF?text=SD&font=montserrat',
    role: 'developer',
    joinedAt: '2022-11-05T09:30:00Z',
    badges: [
      {
        id: 'b3',
        name: 'Bot Creator',
        description: 'Created your first bot',
        icon: '👨‍💻',
        earnedAt: '2022-11-08T16:20:00Z',
      },
      {
        id: 'b4',
        name: 'Rising Star',
        description: 'Bot in top 10 for a week',
        icon: '⭐',
        earnedAt: '2022-12-15T10:00:00Z',
      },
    ],
    currency: 'USD',
  },
  {
    id: '3',
    username: 'adminuser',
    email: 'admin@tradewizard.com',
    avatar: 'https://placehold.co/100/F7CB45/000000?text=AU&font=montserrat',
    role: 'admin',
    joinedAt: '2022-08-01T08:00:00Z',
    badges: [],
    currency: 'USD',
  },
];

// Mock Bots
export const mockBots: Bot[] = [
  {
    id: '1',
    name: 'TrendMaster Pro',
    description: 'Advanced trend following bot with multiple timeframe analysis. Optimized for forex and major crypto pairs.',
    createdBy: mockUsers[1],
    createdAt: '2023-02-10T15:30:00Z',
    updatedAt: '2023-04-15T11:45:00Z',
    strategy: {
      type: 'trend_following',
      description: 'Uses moving averages, RSI, and volume analysis to identify strong trends',
      market: 'forex',
      timeFrame: '1h',
    },
    riskLevel: 'medium',
    performance: {
      roi: 87.5,
      winRate: 68.2,
      drawdown: 12.3,
      tradesPerDay: 3.5,
      totalTrades: 645,
      avgProfitPerTrade: 1.2,
      monthlyStats: [
        { month: '2023-01', roi: 7.2, trades: 95 },
        { month: '2023-02', roi: 8.5, trades: 103 },
        { month: '2023-03', roi: 6.1, trades: 87 },
        { month: '2023-04', roi: 9.3, trades: 112 },
      ],
      rating: 4.7,
      badges: ['Top Performer', 'Consistent', 'Popular'],
    },
    price: {
      monthly: 59.99,
      yearly: 599.99,
      currency: 'USD',
    },
    isAudited: true,
    auditReport: 'https://example.com/audit/trendmaster-pro',
    tags: ['Trend Following', 'Forex', 'Crypto', 'Moving Averages', 'RSI'],
    signals: [],
    reviews: [],
    subscriptions: 342,
    isActive: true,
  },
  {
    id: '2',
    name: 'ScalpKing',
    description: 'High-frequency scalping bot designed for crypto markets. Captures small price movements with tight stop losses.',
    createdBy: mockUsers[1],
    createdAt: '2023-01-05T09:15:00Z',
    updatedAt: '2023-04-20T14:30:00Z',
    strategy: {
      type: 'scalping',
      description: 'Uses order book analysis and short-term price action to capture small movements',
      market: 'crypto',
      timeFrame: '5m',
    },
    riskLevel: 'high',
    performance: {
      roi: 124.7,
      winRate: 54.8,
      drawdown: 21.5,
      tradesPerDay: 12.3,
      totalTrades: 3250,
      avgProfitPerTrade: 0.6,
      monthlyStats: [
        { month: '2023-01', roi: 18.2, trades: 785 },
        { month: '2023-02', roi: 15.6, trades: 692 },
        { month: '2023-03', roi: 22.4, trades: 841 },
        { month: '2023-04', roi: 19.3, trades: 932 },
      ],
      rating: 4.2,
      badges: ['High Volume', 'Aggressive'],
    },
    price: {
      monthly: 79.99,
      yearly: 799.99,
      currency: 'USD',
    },
    isAudited: false,
    tags: ['Scalping', 'Crypto', 'High Frequency', 'Short-term'],
    signals: [],
    reviews: [],
    subscriptions: 187,
    isActive: true,
  },
  {
    id: '3',
    name: 'SwingMaster',
    description: 'Swing trading bot optimized for stock markets. Holds positions for days to weeks to capture larger market movements.',
    createdBy: mockUsers[1],
    createdAt: '2022-11-20T11:45:00Z',
    updatedAt: '2023-03-12T16:20:00Z',
    strategy: {
      type: 'mean_reversion',
      description: 'Combines technical indicators and sentiment analysis to identify swing trading opportunities',
      market: 'stocks',
      timeFrame: '1d',
    },
    riskLevel: 'low',
    performance: {
      roi: 42.8,
      winRate: 76.5,
      drawdown: 8.7,
      tradesPerDay: 0.4,
      totalTrades: 132,
      avgProfitPerTrade: 3.2,
      monthlyStats: [
        { month: '2022-12', roi: 3.5, trades: 10 },
        { month: '2023-01', roi: 4.2, trades: 12 },
        { month: '2023-02', roi: 3.8, trades: 11 },
        { month: '2023-03', roi: 4.7, trades: 14 },
      ],
      rating: 4.8,
      badges: ['Stable', 'Low Risk', 'Consistent'],
    },
    price: {
      monthly: 49.99,
      yearly: 499.99,
      currency: 'USD',
    },
    isAudited: true,
    auditReport: 'https://example.com/audit/swingmaster',
    tags: ['Swing Trading', 'Stocks', 'Low Risk', 'Long-term'],
    signals: [],
    reviews: [],
    subscriptions: 275,
    isActive: true,
  },
  {
    id: '4',
    name: 'AI Predictor',
    description: 'Cutting-edge bot using machine learning to predict market movements. Works across multiple markets and timeframes.',
    createdBy: mockUsers[1],
    createdAt: '2023-03-01T13:20:00Z',
    updatedAt: '2023-04-25T17:10:00Z',
    strategy: {
      type: 'ai_driven',
      description: 'Uses deep learning algorithms and historical data analysis to predict price movements',
      market: 'multiple',
      timeFrame: '4h',
    },
    riskLevel: 'medium',
    performance: {
      roi: 65.3,
      winRate: 63.7,
      drawdown: 17.2,
      tradesPerDay: 2.1,
      totalTrades: 285,
      avgProfitPerTrade: 2.3,
      monthlyStats: [
        { month: '2023-03', roi: 12.4, trades: 135 },
        { month: '2023-04', roi: 15.2, trades: 150 },
      ],
      rating: 4.5,
      badges: ['Innovative', 'AI-Powered'],
    },
    price: {
      monthly: 99.99,
      yearly: 999.99,
      currency: 'USD',
    },
    isAudited: false,
    tags: ['AI', 'Machine Learning', 'Multi-Market', 'Predictive'],
    signals: [],
    reviews: [],
    subscriptions: 128,
    isActive: true,
  },
  {
    id: '5',
    name: 'BreakoutHunter',
    description: 'Specializes in detecting and capitalizing on breakout patterns in all markets. Great for volatile market conditions.',
    createdBy: mockUsers[1],
    createdAt: '2022-12-10T10:30:00Z',
    updatedAt: '2023-04-05T09:45:00Z',
    strategy: {
      type: 'breakout',
      description: 'Identifies key support and resistance levels to detect breakout patterns',
      market: 'multiple',
      timeFrame: '15m',
    },
    riskLevel: 'medium',
    performance: {
      roi: 58.9,
      winRate: 59.2,
      drawdown: 15.8,
      tradesPerDay: 5.2,
      totalTrades: 780,
      avgProfitPerTrade: 1.5,
      monthlyStats: [
        { month: '2022-12', roi: 5.7, trades: 156 },
        { month: '2023-01', roi: 7.8, trades: 182 },
        { month: '2023-02', roi: 6.3, trades: 170 },
        { month: '2023-03', roi: 8.1, trades: 188 },
        { month: '2023-04', roi: 5.9, trades: 84 },
      ],
      rating: 4.3,
      badges: ['Volatility Expert'],
    },
    price: {
      monthly: 69.99,
      yearly: 699.99,
      currency: 'USD',
    },
    isAudited: true,
    auditReport: 'https://example.com/audit/breakouthunter',
    tags: ['Breakout', 'Pattern Recognition', 'Multi-Market', 'Volatility'],
    signals: [],
    reviews: [],
    subscriptions: 210,
    isActive: true,
  },
  {
    id: '6',
    name: 'CryptoMomentum',
    description: 'Specialized momentum trading bot for cryptocurrency markets. Catches big moves early and rides the trend.',
    createdBy: mockUsers[1],
    createdAt: '2023-01-25T16:40:00Z',
    updatedAt: '2023-04-18T13:25:00Z',
    strategy: {
      type: 'trend_following',
      description: 'Uses volume and momentum indicators to identify and follow strong crypto trends',
      market: 'crypto',
      timeFrame: '1h',
    },
    riskLevel: 'high',
    performance: {
      roi: 112.3,
      winRate: 52.4,
      drawdown: 24.5,
      tradesPerDay: 4.8,
      totalTrades: 520,
      avgProfitPerTrade: 2.1,
      monthlyStats: [
        { month: '2023-01', roi: 9.7, trades: 48 },
        { month: '2023-02', roi: 27.8, trades: 156 },
        { month: '2023-03', roi: 24.3, trades: 170 },
        { month: '2023-04', roi: 18.5, trades: 146 },
      ],
      rating: 4.1,
      badges: ['Crypto Specialist', 'High Return'],
    },
    price: {
      monthly: 89.99,
      yearly: 899.99,
      currency: 'USD',
    },
    isAudited: false,
    tags: ['Crypto', 'Momentum', 'Trend Following', 'High Return'],
    signals: [],
    reviews: [],
    subscriptions: 165,
    isActive: true,
  },
];
