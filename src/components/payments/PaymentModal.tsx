import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  planType: 'monthly' | 'yearly';
  botId?: string;
  onSuccess?: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: keyof typeof Icons;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "mpesa",
    name: "M-PESA",
    icon: "mpesa",
    description: "Pay directly with M-PESA"
  },
  {
    id: "card",
    name: "Card Payment",
    icon: "creditCard",
    description: "Pay with Visa, Mastercard, or American Express"
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: "bank",
    description: "Direct bank transfer"
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "paypal",
    description: "Pay with PayPal account"
  },
  {
    id: "applepay",
    name: "Apple Pay",
    icon: "apple",
    description: "Quick payment with Apple Pay"
  },
  {
    id: "googlepay",
    name: "Google Pay",
    icon: "google",
    description: "Quick payment with Google Pay"
  }
];

interface PaymentError {
  code: string;
  message: string;
}

const getErrorMessage = (error: PaymentError): string => {
  switch (error.code) {
    case 'insufficient_funds':
      return 'Your payment was declined due to insufficient funds. Please try a different payment method.';
    case 'card_declined':
      return 'Your card was declined. Please try a different card or payment method.';
    case 'expired_card':
      return 'Your card has expired. Please update your card information or try a different payment method.';
    case 'invalid_number':
      return 'The card number is invalid. Please check and try again.';
    case 'processing_error':
      return 'There was an error processing your payment. Please try again later.';
    case 'network_error':
      return 'Network connection error. Please check your internet connection and try again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again later.';
  }
};

export function PaymentModal({ isOpen, onClose, amount, currency, planType, botId, onSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);
  const { toast } = useToast();

  const resetState = () => {
    setSelectedMethod("");
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validatePaymentMethod = () => {
    if (!selectedMethod) {
      throw { code: 'validation_error', message: 'Please select a payment method' };
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      validatePaymentMethod();

      // Here we'll implement the actual payment processing based on the selected method
      switch (selectedMethod) {
        case "mpesa":
          // Implement M-PESA payment
          await processMpesaPayment();
          break;
        case "card":
          // Implement Stripe payment
          await processCardPayment();
          break;
        case "bank":
          // Implement bank transfer
          await processBankTransfer();
          break;
        case "paypal":
          // Implement PayPal payment
          await processPayPalPayment();
          break;
        case "applepay":
          // Implement Apple Pay
          await processApplePay();
          break;
        case "googlepay":
          // Implement Google Pay
          await processGooglePay();
          break;
        default:
          throw { code: 'invalid_method', message: 'Invalid payment method selected' };
      }

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
        variant: "default",
      });

      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
    } catch (err: any) {
      const error = {
        code: err.code || 'unknown_error',
        message: err.message || 'An unexpected error occurred'
      };
      setError(error);
      toast({
        title: "Payment Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Placeholder payment processing functions
  const processMpesaPayment = async () => {
    // Implement M-PESA payment logic
    throw { code: 'not_implemented', message: 'M-PESA payments are not yet implemented' };
  };

  const processCardPayment = async () => {
    // Implement Stripe payment logic
    throw { code: 'not_implemented', message: 'Card payments are not yet implemented' };
  };

  const processBankTransfer = async () => {
    // Implement bank transfer logic
    throw { code: 'not_implemented', message: 'Bank transfers are not yet implemented' };
  };

  const processPayPalPayment = async () => {
    // Implement PayPal payment logic
    throw { code: 'not_implemented', message: 'PayPal payments are not yet implemented' };
  };

  const processApplePay = async () => {
    // Implement Apple Pay logic
    throw { code: 'not_implemented', message: 'Apple Pay is not yet implemented' };
  };

  const processGooglePay = async () => {
    // Implement Google Pay logic
    throw { code: 'not_implemented', message: 'Google Pay is not yet implemented' };
  };

  const renderIcon = (icon: keyof typeof Icons) => {
    const IconComponent = Icons[icon];
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Select your preferred payment method to complete the {planType} subscription
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="px-3 py-2 bg-accent rounded-md">
            <p className="text-sm font-medium">Amount to pay:</p>
            <p className="text-2xl font-bold">{currency} {amount.toFixed(2)}</p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {getErrorMessage(error)}
              </AlertDescription>
            </Alert>
          )}
          
          <RadioGroup
            value={selectedMethod}
            onValueChange={setSelectedMethod}
            className="grid gap-4"
          >
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label
                  htmlFor={method.id}
                  className="flex flex-1 items-center justify-between rounded-md border border-border p-4 cursor-pointer hover:bg-accent"
                >
                  <div className="flex items-center space-x-3">
                    {renderIcon(method.icon)}
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handlePayment} disabled={!selectedMethod || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 