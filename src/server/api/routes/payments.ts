import { Router } from 'express';
import { PaymentService } from '../../services/payments/PaymentService';
import { MPESAProvider } from '../../services/payments/providers/mpesa.provider';
import { validatePaymentRequest } from '../middlewares/validatePayment';
import { requireAuth } from '../middlewares/auth';

const router = Router();
const paymentService = new PaymentService();

// Initialize payment providers
const mpesaProvider = new MPESAProvider({
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  businessShortCode: process.env.MPESA_SHORTCODE!,
  passKey: process.env.MPESA_PASS_KEY!,
  callbackUrl: `${process.env.API_BASE_URL}/api/payments/mpesa/callback`,
  environment: (process.env.NODE_ENV === 'production') ? 'production' : 'sandbox'
});

paymentService.registerProvider('mpesa', mpesaProvider);
// Register other providers here...

// Initialize payment
router.post('/initialize', requireAuth, validatePaymentRequest, async (req, res) => {
  try {
    const paymentRequest = {
      amount: req.body.amount,
      currency: req.body.currency,
      customerId: req.user.id,
      paymentMethod: req.body.paymentMethod,
      description: req.body.description,
      metadata: req.body.metadata
    };

    const result = await paymentService.processPayment(paymentRequest);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process payment'
    });
  }
});

// Verify payment status
router.get('/verify/:transactionId', requireAuth, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { provider } = req.query;

    if (!provider || typeof provider !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Provider is required'
      });
    }

    const result = await paymentService.verifyPayment(transactionId, provider);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment'
    });
  }
});

// M-PESA callback URL
router.post('/mpesa/callback', async (req, res) => {
  // Handle M-PESA callback
  // Update payment status in database
  // Trigger webhook to update frontend
  res.json({ success: true });
});

export default router; 