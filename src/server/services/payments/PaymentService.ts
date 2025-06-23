
import { MpesaProvider, MpesaConfig, MpesaPaymentRequest } from './providers/mpesa.provider';
import { CardProvider, CardConfig, CardPaymentRequest } from './providers/card.provider';

export type PaymentMethod = 'mpesa' | 'card' | 'bank_transfer' | 'crypto';

export interface PaymentConfig {
  mpesa?: MpesaConfig;
  card?: CardConfig;
}

export interface PaymentRequest {
  method: PaymentMethod;
  amount: number;
  currency: string;
  customerEmail: string;
  description: string;
  metadata?: Record<string, any>;
  // Method-specific fields
  phoneNumber?: string; // For M-PESA
  cardToken?: string; // For card payments
  walletAddress?: string; // For crypto
  bankDetails?: any; // For bank transfers
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentIntentId?: string;
  checkoutRequestId?: string;
  clientSecret?: string;
  requiresAction?: boolean;
  error?: string;
  customerMessage?: string;
}

export class PaymentService {
  private mpesaProvider?: MpesaProvider;
  private cardProvider?: CardProvider;

  constructor(config: PaymentConfig) {
    if (config.mpesa) {
      this.mpesaProvider = new MpesaProvider(config.mpesa);
    }
    if (config.card) {
      this.cardProvider = new CardProvider(config.card);
    }
  }

  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    try {
      switch (paymentRequest.method) {
        case 'mpesa':
          return await this.processMpesaPayment(paymentRequest);
        
        case 'card':
          return await this.processCardPayment(paymentRequest);
        
        case 'bank_transfer':
          return await this.processBankTransfer(paymentRequest);
        
        case 'crypto':
          return await this.processCryptoPayment(paymentRequest);
        
        default:
          return {
            success: false,
            error: `Unsupported payment method: ${paymentRequest.method}`
          };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: 'Payment processing failed'
      };
    }
  }

  private async processMpesaPayment(request: PaymentRequest): Promise<PaymentResult> {
    if (!this.mpesaProvider) {
      return { success: false, error: 'M-PESA not configured' };
    }

    if (!request.phoneNumber) {
      return { success: false, error: 'Phone number required for M-PESA' };
    }

    const mpesaRequest: MpesaPaymentRequest = {
      amount: request.amount,
      phoneNumber: request.phoneNumber,
      accountReference: request.metadata?.userId || 'TRADEWIZARD',
      transactionDesc: request.description
    };

    const result = await this.mpesaProvider.initiateSTKPush(mpesaRequest);

    return {
      success: result.success,
      checkoutRequestId: result.checkoutRequestId,
      transactionId: result.checkoutRequestId,
      error: result.error,
      customerMessage: result.customerMessage
    };
  }

  private async processCardPayment(request: PaymentRequest): Promise<PaymentResult> {
    if (!this.cardProvider) {
      return { success: false, error: 'Card payments not configured' };
    }

    if (!request.cardToken) {
      return { success: false, error: 'Card token required' };
    }

    const cardRequest: CardPaymentRequest = {
      amount: request.amount,
      currency: request.currency,
      cardToken: request.cardToken,
      customerEmail: request.customerEmail,
      description: request.description,
      metadata: request.metadata
    };

    const result = await this.cardProvider.createPaymentIntent(cardRequest);

    return {
      success: result.success,
      paymentIntentId: result.paymentIntentId,
      clientSecret: result.clientSecret,
      transactionId: result.transactionId,
      error: result.error
    };
  }

  private async processBankTransfer(request: PaymentRequest): Promise<PaymentResult> {
    // Placeholder for bank transfer implementation
    // This would integrate with banking APIs or payment processors
    return {
      success: false,
      error: 'Bank transfer not yet implemented. Please use M-PESA or card payment.'
    };
  }

  private async processCryptoPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Placeholder for cryptocurrency payment implementation
    // This would integrate with blockchain networks or crypto payment processors
    return {
      success: false,
      error: 'Cryptocurrency payments not yet implemented. Please use M-PESA or card payment.'
    };
  }

  async verifyPayment(method: PaymentMethod, transactionId: string): Promise<PaymentResult> {
    try {
      switch (method) {
        case 'mpesa':
          if (!this.mpesaProvider) {
            return { success: false, error: 'M-PESA not configured' };
          }
          const mpesaResult = await this.mpesaProvider.queryPaymentStatus(transactionId);
          return {
            success: mpesaResult.ResponseCode === '0',
            transactionId,
            error: mpesaResult.ResponseCode !== '0' ? mpesaResult.ResponseDescription : undefined
          };

        case 'card':
          if (!this.cardProvider) {
            return { success: false, error: 'Card payments not configured' };
          }
          const cardResult = await this.cardProvider.retrievePayment(transactionId);
          return {
            success: cardResult.status === 'succeeded',
            transactionId,
            error: cardResult.status !== 'succeeded' ? 'Payment not completed' : undefined
          };

        default:
          return {
            success: false,
            error: 'Payment verification not supported for this method'
          };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: 'Payment verification failed'
      };
    }
  }

  async refundPayment(method: PaymentMethod, transactionId: string, amount?: number): Promise<PaymentResult> {
    try {
      switch (method) {
        case 'card':
          if (!this.cardProvider) {
            return { success: false, error: 'Card payments not configured' };
          }
          return await this.cardProvider.refundPayment(transactionId, amount);

        default:
          return {
            success: false,
            error: 'Refunds not supported for this payment method'
          };
      }
    } catch (error) {
      console.error('Refund error:', error);
      return {
        success: false,
        error: 'Refund processing failed'
      };
    }
  }
}
