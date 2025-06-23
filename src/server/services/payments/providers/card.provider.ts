
export interface CardConfig {
  publishableKey: string;
  secretKey: string;
  environment: 'test' | 'live';
  webhookSecret?: string;
}

export interface CardPaymentRequest {
  amount: number;
  currency: string;
  cardToken: string;
  customerEmail: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface CardPaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
  requiresAction?: boolean;
}

export class CardProvider {
  private config: CardConfig;
  private baseUrl: string;

  constructor(config: CardConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'live' 
      ? 'https://api.stripe.com' 
      : 'https://api.stripe.com'; // Stripe uses same URL for test/live
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  }

  async createPaymentIntent(paymentData: CardPaymentRequest): Promise<CardPaymentResponse> {
    try {
      const params = new URLSearchParams({
        amount: (paymentData.amount * 100).toString(), // Convert to cents
        currency: paymentData.currency.toLowerCase(),
        payment_method_types: 'card',
        receipt_email: paymentData.customerEmail,
        description: paymentData.description,
        ...(paymentData.metadata && { 
          'metadata[userId]': paymentData.metadata.userId || '',
          'metadata[planId]': paymentData.metadata.planId || ''
        })
      });

      const response = await fetch(`${this.baseUrl}/v1/payment_intents`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: params
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || 'Payment intent creation failed'
        };
      }

      return {
        success: true,
        paymentIntentId: data.id,
        clientSecret: data.client_secret,
        transactionId: data.id
      };

    } catch (error) {
      console.error('Card Payment Error:', error);
      return {
        success: false,
        error: 'Failed to create payment intent'
      };
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<CardPaymentResponse> {
    try {
      const params = new URLSearchParams({
        payment_method: paymentMethodId
      });

      const response = await fetch(`${this.baseUrl}/v1/payment_intents/${paymentIntentId}/confirm`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: params
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || 'Payment confirmation failed'
        };
      }

      const requiresAction = data.status === 'requires_action' || data.status === 'requires_source_action';

      return {
        success: data.status === 'succeeded',
        paymentIntentId: data.id,
        transactionId: data.id,
        requiresAction,
        clientSecret: data.client_secret
      };

    } catch (error) {
      console.error('Card Confirmation Error:', error);
      return {
        success: false,
        error: 'Failed to confirm payment'
      };
    }
  }

  async retrievePayment(paymentIntentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/payment_intents/${paymentIntentId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Card Retrieval Error:', error);
      throw error;
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<CardPaymentResponse> {
    try {
      const params = new URLSearchParams({
        payment_intent: paymentIntentId,
        ...(amount && { amount: (amount * 100).toString() })
      });

      const response = await fetch(`${this.baseUrl}/v1/refunds`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: params
      });

      const data = await response.json();

      return {
        success: response.ok && data.status === 'succeeded',
        transactionId: data.id,
        error: !response.ok ? data.error?.message : undefined
      };

    } catch (error) {
      console.error('Card Refund Error:', error);
      return {
        success: false,
        error: 'Failed to process refund'
      };
    }
  }
}
