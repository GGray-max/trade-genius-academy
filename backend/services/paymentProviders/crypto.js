/**
 * Cryptocurrency payments via Coinbase Commerce (default)
 *
 * Environment variables expected:
 *   COINBASE_API_KEY
 *   COINBASE_WEBHOOK_SECRET
 *   COINBASE_CALLBACK_URL
 *
 * You can swap this provider with NOWPayments / BitPay by replacing the
 * API endpoints in the TODO sections. Interface must stay the same.
 */

const axios = require('axios');

const API_BASE = 'https://api.commerce.coinbase.com';

exports.createPayment = async ({ amount, currency = 'USD', description, metadata = {} }) => {
  const { COINBASE_API_KEY, COINBASE_CALLBACK_URL } = process.env;
  if (!COINBASE_API_KEY) {
    throw new Error('Missing Coinbase Commerce API key');
  }

  const payload = {
    name: 'Trade Genius Payment',
    description,
    local_price: { amount: amount.toString(), currency },
    pricing_type: 'fixed_price',
    metadata,
    redirect_url: COINBASE_CALLBACK_URL || 'https://example.com/crypto/success',
    cancel_url: COINBASE_CALLBACK_URL || 'https://example.com/crypto/cancel',
  };

  const resp = await axios.post(`${API_BASE}/charges`, payload, {
    headers: {
      'X-CC-Api-Key': COINBASE_API_KEY,
      'X-CC-Version': '2018-03-22',
      'Content-Type': 'application/json',
    },
  });

  const { id: chargeCode, hosted_url: paymentUrl } = resp.data.data;

  return {
    success: true,
    provider: 'crypto',
    transactionId: chargeCode,
    paymentUrl,
  };
};

exports.verifyPayment = async (chargeCode) => {
  const { COINBASE_API_KEY } = process.env;
  if (!COINBASE_API_KEY) {
    throw new Error('Missing Coinbase Commerce API key');
  }

  const resp = await axios.get(`${API_BASE}/charges/${chargeCode}`, {
    headers: {
      'X-CC-Api-Key': COINBASE_API_KEY,
      'X-CC-Version': '2018-03-22',
    },
  });

  const { timeline } = resp.data.data;
  const completed = timeline.some((t) => t.status === 'COMPLETED' || t.status === 'CONFIRMED');
  const pending = !completed;

  return {
    success: completed,
    pending,
    provider: 'crypto',
    transactionId: chargeCode,
  };
};
