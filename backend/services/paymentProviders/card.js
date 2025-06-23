/**
 * Placeholder provider for in-app simulated card payments (for demo only).
 * Replace with a real processor (Stripe, Flutterwave, etc.) when ready.
 */

exports.createPayment = async ({ amount, currency = 'USD', description, metadata = {} }) => {
  // Simulate immediate success
  return {
    success: true,
    provider: 'card',
    transactionId: `CARD_${Date.now()}`,
  };
};

exports.verifyPayment = async (txId) => {
  return {
    success: true,
    pending: false,
    provider: 'card',
    transactionId: txId,
  };
};
