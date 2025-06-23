
import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Building, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  planName: string;
  planId: string;
  userEmail: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  currencies: string[];
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  planName,
  planId,
  userEmail,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadPaymentMethods();
    }
  }, [isOpen]);

  const loadPaymentMethods = async () => {
    try {
      const response = await api.get('/payments/methods');
      if (response.data.success) {
        setPaymentMethods(response.data.methods);
        if (response.data.methods.length > 0) {
          setSelectedMethod(response.data.methods[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as Kenyan phone number
    if (digits.length <= 10) {
      return digits.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1 $2 $3').trim();
    }
    return digits.slice(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    return digits;
  };

  const validateForm = (): string | null => {
    if (selectedMethod === 'mpesa') {
      if (!formData.phoneNumber) {
        return 'Phone number is required for M-PESA';
      }
      const digits = formData.phoneNumber.replace(/\D/g, '');
      if (digits.length < 9 || digits.length > 10) {
        return 'Please enter a valid phone number';
      }
    }

    if (selectedMethod === 'card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
        return 'All card fields are required';
      }
      if (formData.cardNumber.replace(/\D/g, '').length < 16) {
        return 'Please enter a valid card number';
      }
      if (formData.cvv.length < 3) {
        return 'Please enter a valid CVV';
      }
    }

    return null;
  };

  const processPayment = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const paymentData: any = {
        method: selectedMethod,
        amount,
        currency: 'USD',
        customerEmail: userEmail,
        description: `Payment for ${planName} plan`,
        metadata: {
          planId,
          userId: localStorage.getItem('user-id'),
        },
      };

      // Add method-specific data
      if (selectedMethod === 'mpesa') {
        paymentData.phoneNumber = formData.phoneNumber.replace(/\D/g, '');
      } else if (selectedMethod === 'card') {
        // In a real implementation, you would tokenize the card with Stripe
        // For now, we'll simulate this
        paymentData.cardToken = 'simulated_card_token_' + Date.now();
      }

      const response = await api.post('/payments/process', paymentData);

      if (response.data.success) {
        if (selectedMethod === 'mpesa') {
          toast.success(
            response.data.customerMessage || 
            'M-PESA payment initiated. Please check your phone for the STK push prompt.'
          );
          
          // Poll for payment status
          pollPaymentStatus(selectedMethod, response.data.transactionId);
        } else if (selectedMethod === 'card') {
          toast.success('Payment processed successfully!');
          onClose();
        }
      } else {
        toast.error(response.data.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(
        error.response?.data?.error || 
        'Payment failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pollPaymentStatus = async (method: string, transactionId: string) => {
    let attempts = 0;
    const maxAttempts = 12; // Poll for 2 minutes (10s interval)

    const checkStatus = async () => {
      try {
        const response = await api.get(`/payments/verify/${method}/${transactionId}`);
        
        if (response.data.success) {
          toast.success('Payment completed successfully!');
          onClose();
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 10000); // Check every 10 seconds
        } else {
          toast.error('Payment status check timed out. Please contact support if payment was deducted.');
        }
      } catch (error) {
        console.error('Payment status check failed:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 10000);
        }
      }
    };

    setTimeout(checkStatus, 5000); // Start checking after 5 seconds
  };

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'mpesa': return <Smartphone className="h-5 w-5" />;
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'bank_transfer': return <Building className="h-5 w-5" />;
      case 'crypto': return <Coins className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'mpesa':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="0712 345 678"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', formatPhoneNumber(e.target.value))}
                maxLength={12}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter your M-PESA registered phone number
              </p>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                type="text"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              This payment method is coming soon.
            </p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Complete Payment</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="flex justify-between">
              <span>{planName} Plan</span>
              <span className="font-medium">${amount}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <Label className="text-base font-medium">Payment Method</Label>
            <div className="grid gap-3 mt-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={`flex items-center p-3 border rounded-lg text-left transition-colors ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  {getMethodIcon(method.id)}
                  <div className="ml-3">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {method.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          {renderPaymentForm()}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={processPayment} 
              disabled={isLoading || !selectedMethod}
              className="flex-1"
            >
              {isLoading ? 'Processing...' : `Pay $${amount}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
