
export interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  environment: 'sandbox' | 'production';
  businessShortCode: string;
  passkey: string;
  callbackUrl: string;
}

export interface MpesaPaymentRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
}

export interface MpesaPaymentResponse {
  success: boolean;
  checkoutRequestId?: string;
  responseCode?: string;
  responseDescription?: string;
  customerMessage?: string;
  error?: string;
}

export class MpesaProvider {
  private config: MpesaConfig;
  private baseUrl: string;

  constructor(config: MpesaConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');
    
    try {
      const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_description || 'Failed to get access token');
      }

      return data.access_token;
    } catch (error) {
      console.error('M-PESA Token Error:', error);
      throw new Error('Failed to authenticate with M-PESA');
    }
  }

  private generatePassword(): string {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(this.config.businessShortCode + this.config.passkey + timestamp).toString('base64');
    return password;
  }

  private getTimestamp(): string {
    return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  }

  async initiateSTKPush(paymentData: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword();

      // Format phone number (remove + and ensure it starts with 254)
      let phoneNumber = paymentData.phoneNumber.replace(/\D/g, '');
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '254' + phoneNumber.slice(1);
      } else if (phoneNumber.startsWith('254')) {
        phoneNumber = phoneNumber;
      } else {
        phoneNumber = '254' + phoneNumber;
      }

      const stkPushData = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: paymentData.amount,
        PartyA: phoneNumber,
        PartyB: this.config.businessShortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: this.config.callbackUrl,
        AccountReference: paymentData.accountReference,
        TransactionDesc: paymentData.transactionDesc
      };

      const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stkPushData)
      });

      const data = await response.json();

      if (!response.ok || data.ResponseCode !== '0') {
        return {
          success: false,
          error: data.ResponseDescription || data.errorMessage || 'Payment initiation failed'
        };
      }

      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        customerMessage: data.CustomerMessage
      };

    } catch (error) {
      console.error('M-PESA STK Push Error:', error);
      return {
        success: false,
        error: 'Failed to initiate M-PESA payment'
      };
    }
  }

  async queryPaymentStatus(checkoutRequestId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword();

      const queryData = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryData)
      });

      return await response.json();
    } catch (error) {
      console.error('M-PESA Query Error:', error);
      throw error;
    }
  }
}
