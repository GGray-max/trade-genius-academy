import { PaymentProvider } from './index';
import { PaymentRequest, PaymentResponse } from '../PaymentService';

interface MPESAConfig {
  consumerKey: string;
  consumerSecret: string;
  businessShortCode: string;
  passKey: string;
  callbackUrl: string;
  environment: 'sandbox' | 'production';
}

export class MPESAProvider implements PaymentProvider {
  private config: MPESAConfig;
  private baseUrl: string;
  private accessToken?: string;
  private tokenExpiry?: Date;

  constructor(config: MPESAConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    const auth = Buffer.from(
      `${this.config.consumerKey}:${this.config.consumerSecret}`
    ).toString('base64');

    const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
    
    return this.accessToken;
  }

  public async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = Buffer.from(
        `${this.config.businessShortCode}${this.config.passKey}${timestamp}`
      ).toString('base64');

      const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: this.config.businessShortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: request.amount,
          PartyA: request.metadata.phoneNumber,
          PartyB: this.config.businessShortCode,
          PhoneNumber: request.metadata.phoneNumber,
          CallBackURL: this.config.callbackUrl,
          AccountReference: request.metadata.reference || 'TradeWizard',
          TransactionDesc: request.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const data = await response.json();
      
      return {
        success: true,
        transactionId: data.CheckoutRequestID,
        status: 'pending',
        providerResponse: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process payment',
        status: 'failed',
      };
    }
  }

  public async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = Buffer.from(
        `${this.config.businessShortCode}${this.config.passKey}${timestamp}`
      ).toString('base64');

      const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: this.config.businessShortCode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: transactionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      const data = await response.json();
      
      return {
        success: data.ResultCode === '0',
        transactionId,
        status: data.ResultCode === '0' ? 'completed' : 'failed',
        providerResponse: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify payment',
        status: 'failed',
      };
    }
  }
} 