
const express = require('express');
const { supabase } = require('../config/supabase');
const router = express.Router();

// Mock data for development
const generateMockAnalytics = () => ({
  dashboard: {
    totalRevenue: Math.floor(Math.random() * 100000) + 50000,
    activeUsers: Math.floor(Math.random() * 5000) + 1000,
    totalTrades: Math.floor(Math.random() * 50000) + 10000,
    successRate: (Math.random() * 20 + 75).toFixed(1), // 75-95%
    profitLoss: {
      profit: Math.floor(Math.random() * 50000) + 20000,
      loss: Math.floor(Math.random() * 20000) + 5000
    },
    recentActivity: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      type: ['trade', 'deposit', 'withdrawal'][Math.floor(Math.random() * 3)],
      amount: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)]
    }))
  },
  performance: {
    chartData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 1000) + 500,
      trades: Math.floor(Math.random() * 100) + 20
    })),
    metrics: {
      winRate: (Math.random() * 15 + 70).toFixed(1),
      avgProfit: (Math.random() * 500 + 200).toFixed(2),
      sharpeRatio: (Math.random() * 1 + 1).toFixed(2),
      maxDrawdown: (Math.random() * 10 + 5).toFixed(1)
    }
  }
});

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID required'
      });
    }

    // In production, fetch real data from database
    // For now, return mock data
    const analytics = generateMockAnalytics();

    res.status(200).json({
      success: true,
      data: analytics.dashboard
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard analytics'
    });
  }
});

// Get performance analytics
router.get('/performance', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID required'
      });
    }

    const { timeframe = '30d' } = req.query;

    // In production, fetch real performance data based on timeframe
    const analytics = generateMockAnalytics();

    res.status(200).json({
      success: true,
      data: analytics.performance
    });

  } catch (error) {
    console.error('Performance analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance analytics'
    });
  }
});

// Get bot analytics
router.get('/bots/:botId', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { botId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID required'
      });
    }

    // Mock bot-specific analytics
    const botAnalytics = {
      performance: {
        totalTrades: Math.floor(Math.random() * 1000) + 100,
        successfulTrades: Math.floor(Math.random() * 800) + 70,
        totalProfit: (Math.random() * 10000 + 1000).toFixed(2),
        winRate: (Math.random() * 20 + 65).toFixed(1)
      },
      chartData: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
        profit: (Math.random() * 500 - 100).toFixed(2),
        trades: Math.floor(Math.random() * 20) + 5
      }))
    };

    res.status(200).json({
      success: true,
      data: botAnalytics
    });

  } catch (error) {
    console.error('Bot analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bot analytics'
    });
  }
});

// Get trading signals analytics
router.get('/signals', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID required'
      });
    }

    const signalsAnalytics = {
      totalSignals: Math.floor(Math.random() * 500) + 100,
      accurateSignals: Math.floor(Math.random() * 400) + 80,
      accuracy: (Math.random() * 15 + 75).toFixed(1),
      recentSignals: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        pair: ['BTC/USD', 'ETH/USD', 'EUR/USD', 'GBP/USD'][Math.floor(Math.random() * 4)],
        type: ['buy', 'sell'][Math.floor(Math.random() * 2)],
        accuracy: (Math.random() * 20 + 70).toFixed(1),
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
      }))
    };

    res.status(200).json({
      success: true,
      data: signalsAnalytics
    });

  } catch (error) {
    console.error('Signals analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch signals analytics'
    });
  }
});

module.exports = router;
