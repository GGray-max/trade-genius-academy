import { PaymentProvider } from './providers';

export interface PaymentRequest {
  amount: number;
  currency: string;
  customerId: string;
  paymentMethod: string;
  description: string;
  metadata: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
  status: 'pending' | 'completed' | 'failed';
  providerResponse?: any;
}

export class PaymentService {
  private providers: Record<string, PaymentProvider>;

  constructor() {
    this.providers = {};
  }

  public registerProvider(name: string, provider: PaymentProvider) {
    this.providers[name] = provider;
  }

  public async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const provider = this.providers[request.paymentMethod];
    
    if (!provider) {
      return {
        success: false,
        error: `Payment method ${request.paymentMethod} not supported`,
        status: 'failed'
      };
    }

    try {
      return await provider.processPayment(request);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'failed'
      };
    }
  }

  public async verifyPayment(transactionId: string, provider: string): Promise<PaymentResponse> {
    const paymentProvider = this.providers[provider];
    
    if (!paymentProvider) {
      return {
        success: false,
        error: `Provider ${provider} not found`,
        status: 'failed'
      };
    }

    try {
      return await paymentProvider.verifyPayment(transactionId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'failed'
      };
    }
  }
} 