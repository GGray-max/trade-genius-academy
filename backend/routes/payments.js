const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

// Payment provider service modules
const mpesaProvider = require('../services/paymentProviders/mpesa');
const paypalProvider = require('../services/paymentProviders/paypal');
const cryptoProvider = require('../services/paymentProviders/crypto');

// In-memory registry – easily extendable
const PROVIDERS = {
  mpesa: mpesaProvider,
  paypal: paypalProvider,
  crypto: cryptoProvider,
};

// Available payment methods – fetched by frontend
const demoPaymentMethods = [
  {
    id: 'mpesa',
    name: 'M-Pesa (STK Push)',
    icon: 'mpesa',
    description: 'Pay via Safaricom M-Pesa',
    currencies: ['KES'],
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    icon: 'card',
    currencies: ['USD', 'EUR', 'GBP']
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'paypal',
    currencies: ['USD', 'EUR']
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: 'crypto',
    description: 'Pay with BTC, USDT and more via Coinbase',
    currencies: ['BTC', 'USDT', 'ETH'],
  },
];

/**
 * GET /api/payments/methods
 * Returns list of available payment methods.
 * Secured by verifyUser & rate limiter.
 */
router.get('/methods', paymentLimiter, verifyUser, async (req, res) => {
  try {
    // In production you would query a DB or external service
    res.status(200).json({ success: true, methods: demoPaymentMethods });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ success: false, error: 'Failed to load payment methods' });
  }
});

/**
 * POST /api/payments/process
 * Body: { method: 'mpesa' | 'paypal' | 'crypto', ... }
 */
router.post('/process', paymentLimiter, verifyUser, async (req, res) => {
  const { method, ...payload } = req.body;
  const provider = PROVIDERS[method];
  if (!provider) {
    return res.status(400).json({ success: false, error: 'Unsupported payment method' });
  }
  try {
    const result = await provider.createPayment(payload);
    res.status(200).json(result);
  } catch (error) {
    console.error('Payment process error:', error);
    res.status(500).json({ success: false, error: 'Payment processing failed' });
  }
});

/**
 * GET /api/payments/verify/:provider/:id
 */
router.get('/verify/:provider/:id', paymentLimiter, verifyUser, async (req, res) => {
  const { provider: providerName, id } = req.params;
  const provider = PROVIDERS[providerName];
  if (!provider) {
    return res.status(400).json({ success: false, error: 'Unsupported provider' });
  }
  try {
    const result = await provider.verifyPayment(id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

module.exports = router;
