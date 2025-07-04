const express = require('express');
const router = express.Router();

// OpenAI client
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @route   POST /api/ai-strategy
// @desc    Generate an optimized trading strategy based on a plain-language goal
// @access  Public (authentication/authorization can be added later)
// If OPENAI_API_KEY is set, we'll call OpenAI to generate a strategy.
// Otherwise we fall back to a mock response.
router.post('/', async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({ error: 'Goal is required' });
    }

    let strategy = null;

    if (process.env.OPENAI_API_KEY) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a trading strategy generator.' },
          { role: 'user', content: `Create a strategy for: ${goal}` }
        ]
      });
      strategy = JSON.parse(response.choices[0].message.content);
    } else {
      // Mock fallback strategy
      strategy = {
        goal,
        entry: 'Buy when 50-SMA crosses above 200-SMA on the 1H timeframe',
        exit: 'Sell when 50-SMA crosses below 200-SMA or RSI > 70',
        stopLoss: '2%',
        takeProfit: '5%',
        riskManagement: 'Risk 1% of account equity per trade',
      };
    }

    return res.json({ strategy });
  } catch (err) {
    console.error('AI strategy generation failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
