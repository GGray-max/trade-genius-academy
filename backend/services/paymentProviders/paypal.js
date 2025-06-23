/**
 * PayPal REST Orders / Subscriptions integration helpers
 *
 * Environment variables expected:
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_SECRET
 *   PAYPAL_ENV (sandbox | live)
 *   PAYPAL_WEBHOOK_ID (for later verification)
 *
 * NOTE: This is a lightweight skeleton. Replace TODO sections with real
 * API calls once you have credentials.
 */

const axios = require('axios');

const API_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error('Missing PayPal credentials');
  }
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const resp = await axios.post(`${API_BASE}/v1/oauth2/token`, 'grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return resp.data.access_token;
}

exports.createPayment = async ({ amount, currency = 'USD', description, metadata = {} }) => {
  // TODO: use PayPal Orders API for one-time payments; support subscriptions separately
  const accessToken = await getAccessToken();

  const orderPayload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toString(),
        },
        description,
        custom_id: metadata.planId || 'plan',
      },
    ],
    application_context: {
      brand_name: 'Trade Genius Academy',
      user_action: 'PAY_NOW',
      return_url: 'https://example.com/paypal/success', // TODO replace
      cancel_url: 'https://example.com/paypal/cancel', // TODO replace
    },
  };

  const resp = await axios.post(`${API_BASE}/v2/checkout/orders`, orderPayload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const { id: orderId, links } = resp.data;
  const approvalLink = links.find((l) => l.rel === 'approve');

  return {
    success: true,
    provider: 'paypal',
    transactionId: orderId,
    approvalUrl: approvalLink?.href,
  };
};

exports.verifyPayment = async (orderId) => {
  const accessToken = await getAccessToken();
  const resp = await axios.get(`${API_BASE}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const { status } = resp.data;
  return {
    success: status === 'COMPLETED',
    pending: status === 'CREATED' || status === 'APPROVED',
    provider: 'paypal',
    transactionId: orderId,
  };
};
