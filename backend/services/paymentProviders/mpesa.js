/**
 * M-Pesa Daraja STK Push integration helpers
 *
 * All secrets and URLs are expected from environment variables:
 *   MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET
 *   MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL
 *   MPESA_ENV (sandbox | production)
 *
 * To finish integration: fill in the TODO sections with real API calls and
 * signature generation. This skeleton keeps interfaces consistent across
 * payment providers so the rest of the application stays provider-agnostic.
 */

const axios = require('axios');


const DARAKA_BASE_URL = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

// Helper – obtain OAuth token
async function getAccessToken() {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;
  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    throw new Error('Missing M-Pesa consumer key/secret');
  }
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const resp = await axios.get(`${DARAKA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  return resp.data.access_token;
}

// Build password (base64 of shortcode+passkey+timestamp)
function buildPassword(shortcode, passkey, timestamp) {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

exports.createPayment = async ({ amount, phoneNumber, description, metadata = {} }) => {
  // TODO – implement real STK push request
  const { MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL } = process.env;
  if (!MPESA_SHORTCODE || !MPESA_PASSKEY || !MPESA_CALLBACK_URL) {
    throw new Error('Missing M-Pesa environment variables');
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14);
  const password = buildPassword(MPESA_SHORTCODE, MPESA_PASSKEY, timestamp);

  const payload = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: MPESA_SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: MPESA_CALLBACK_URL,
    AccountReference: metadata.planId || 'TradeGenius',
    TransactionDesc: description,
  };

  // Simplified – replace with live call when credentials are set
  // const token = await getAccessToken();
  // const resp = await axios.post(`${DARAKA_BASE_URL}/mpesa/stkpush/v1/processrequest`, payload, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // const { CheckoutRequestID } = resp.data;
  const CheckoutRequestID = `SIMULATED_${Date.now()}`;

  return {
    success: true,
    provider: 'mpesa',
    transactionId: CheckoutRequestID,
    customerMessage: 'M-PESA payment initiated. You should receive an STK Push prompt shortly.',
  };
};

exports.verifyPayment = async (transactionId) => {
  // TODO – implement real transaction status query and interpret response
  return {
    success: false,
    pending: true,
    provider: 'mpesa',
    transactionId,
  };
};
