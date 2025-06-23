
import express from 'express';
import { PaymentService, PaymentRequest } from '../../services/payments/PaymentService';

const router = express.Router();

// Initialize payment service with environment variables
const paymentService = new PaymentService({
  mpesa: {
    consumerKey: process.env.MPESA_CONSUMER_KEY || 'YOUR_MPESA_CONSUMER_KEY',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || 'YOUR_MPESA_CONSUMER_SECRET',
    environment: (process.env.MPESA_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE || '174379',
    passkey: process.env.MPESA_PASSKEY || 'YOUR_MPESA_PASSKEY',
    callbackUrl: process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/payments/mpesa/callback'
  },
  card: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY',
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY',
    environment: (process.env.STRIPE_ENVIRONMENT as 'test' | 'live') || 'test',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  }
});

// Process payment
router.post('/process', async (req, res) => {
  try {
    const paymentRequest: PaymentRequest = req.body;

    // Validate required fields
    if (!paymentRequest.method || !paymentRequest.amount || !paymentRequest.customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: method, amount, customerEmail'
      });
    }

    // Validate amount
    if (paymentRequest.amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    // Method-specific validations
    if (paymentRequest.method === 'mpesa' && !paymentRequest.phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number required for M-PESA payments'
      });
    }

    if (paymentRequest.method === 'card' && !paymentRequest.cardToken) {
      return res.status(400).json({
        success: false,
        error: 'Card token required for card payments'
      });
    }

    const result = await paymentService.processPayment(paymentRequest);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during payment processing'
    });
  }
});

// Verify payment status
router.get('/verify/:method/:transactionId', async (req, res) => {
  try {
    const { method, transactionId } = req.params;

    if (!method || !transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Method and transaction ID are required'
      });
    }

    const result = await paymentService.verifyPayment(method as any, transactionId);

    res.status(200).json(result);

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during payment verification'
    });
  }
});

// Process refund
router.post('/refund', async (req, res) => {
  try {
    const { method, transactionId, amount } = req.body;

    if (!method || !transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Method and transaction ID are required'
      });
    }

    const result = await paymentService.refundPayment(method, transactionId, amount);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Refund processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during refund processing'
    });
  }
});

// M-PESA callback endpoint
router.post('/mpesa/callback', async (req, res) => {
  try {
    const { Body } = req.body;
    
    if (Body && Body.stkCallback) {
      const callback = Body.stkCallback;
      
      // Log the callback for debugging
      console.log('M-PESA Callback:', JSON.stringify(callback, null, 2));
      
      // Process the callback
      // You can implement your callback logic here
      // Example: Update payment status in database
      
      res.status(200).json({
        ResultCode: 0,
        ResultDesc: 'Callback received successfully'
      });
    } else {
      res.status(400).json({
        ResultCode: 1,
        ResultDesc: 'Invalid callback format'
      });
    }

  } catch (error) {
    console.error('M-PESA callback error:', error);
    res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Internal server error'
    });
  }
});

// Stripe webhook endpoint
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return res.status(400).send('Webhook secret not configured');
    }

    // Here you would verify the webhook signature
    // and process the event
    console.log('Stripe webhook received');

    res.status(200).send('Webhook received');

  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).send('Webhook error');
  }
});

// Get supported payment methods
router.get('/methods', async (req, res) => {
  try {
    const methods = [
      {
        id: 'mpesa',
        name: 'M-PESA',
        description: 'Pay with M-PESA mobile money',
        enabled: !!process.env.MPESA_CONSUMER_KEY,
        currencies: ['KES']
      },
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Pay with Visa or MasterCard',
        enabled: !!process.env.STRIPE_SECRET_KEY,
        currencies: ['USD', 'EUR', 'KES']
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer',
        enabled: false,
        currencies: ['USD', 'KES']
      },
      {
        id: 'crypto',
        name: 'Cryptocurrency',
        description: 'Pay with Bitcoin, Ethereum, etc.',
        enabled: false,
        currencies: ['BTC', 'ETH', 'USDT']
      }
    ];

    res.status(200).json({
      success: true,
      methods: methods.filter(method => method.enabled)
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment methods'
    });
  }
});

export default router;
