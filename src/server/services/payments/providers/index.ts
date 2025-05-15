import { PaymentRequest, PaymentResponse } from '../PaymentService';

export interface PaymentProvider {
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  verifyPayment(transactionId: string): Promise<PaymentResponse>;
}

export * from './mpesa.provider';
export * from './stripe.provider';
export * from './paypal.provider';
export * from './bank.provider'; 