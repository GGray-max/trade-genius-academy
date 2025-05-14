
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CreditCard, 
  Receipt, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Download,
  X,
  ArrowRight
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Mock subscription plans
const plans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 9.99,
    interval: "monthly",
    features: ["5 trading bots", "Basic analytics", "Email support"]
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: 29.99,
    interval: "monthly",
    features: ["20 trading bots", "Advanced analytics", "Priority support", "API access"]
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: 99.99,
    interval: "monthly",
    features: ["Unlimited trading bots", "Custom bot development", "Dedicated support", "Full API access", "Custom integrations"]
  },
];

// Mock payment history
const paymentHistory = [
  {
    id: "inv_12345",
    date: "2025-04-15",
    amount: 29.99,
    status: "paid",
    description: "Pro Plan (Monthly)"
  },
  {
    id: "inv_12344",
    date: "2025-03-15",
    amount: 29.99,
    status: "paid",
    description: "Pro Plan (Monthly)"
  },
  {
    id: "inv_12343",
    date: "2025-02-15",
    amount: 29.99,
    status: "paid",
    description: "Pro Plan (Monthly)"
  },
  {
    id: "inv_12342",
    date: "2025-01-15",
    amount: 9.99,
    status: "paid",
    description: "Basic Plan (Monthly)"
  },
];

const BillingSettings = () => {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [subscriptionInterval, setSubscriptionInterval] = useState<"monthly" | "yearly">("monthly");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [changePlanDialogOpen, setChangePlanDialogOpen] = useState(false);
  
  // Mock data for current subscription
  const currentSubscription = {
    plan: "pro",
    status: "active",
    renewalDate: "2025-06-15",
    interval: "monthly",
    amount: 29.99,
    paymentMethod: {
      type: "card",
      last4: "4242",
      brand: "Visa",
      expMonth: 12,
      expYear: 2028
    }
  };

  const handleChangePlan = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call your payment processor's API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Subscription updated to ${plans.find(p => p.id === selectedPlan)?.name} (${subscriptionInterval})`);
      setChangePlanDialogOpen(false);
    } catch (error: any) {
      toast.error(`Failed to change plan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call your payment processor's API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Your subscription has been canceled");
      setCancelDialogOpen(false);
    } catch (error: any) {
      toast.error(`Failed to cancel subscription: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription and payment methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 border rounded-md p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{plans.find(p => p.id === currentSubscription.plan)?.name}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Badge className="mr-2" variant="outline">
                    {currentSubscription.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                  <span>Renews on {formatDate(currentSubscription.renewalDate)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${currentSubscription.amount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">per {currentSubscription.interval}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Payment Method</h4>
              <div className="flex items-center p-3 border rounded-md">
                <div className="bg-slate-100 p-2 rounded mr-3">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">
                    {currentSubscription.paymentMethod.brand} •••• {currentSubscription.paymentMethod.last4}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires {currentSubscription.paymentMethod.expMonth}/{currentSubscription.paymentMethod.expYear}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  Update
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Dialog open={changePlanDialogOpen} onOpenChange={setChangePlanDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    Change Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Change Subscription Plan</DialogTitle>
                    <DialogDescription>
                      Select a new plan that fits your needs
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-4 space-y-4">
                    <div>
                      <p className="font-medium mb-2">Billing Interval</p>
                      <RadioGroup 
                        defaultValue={subscriptionInterval}
                        onValueChange={(value) => setSubscriptionInterval(value as "monthly" | "yearly")}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly">Monthly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yearly" id="yearly" />
                          <Label htmlFor="yearly">Yearly (Save 20%)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <p className="font-medium mb-3">Select Plan</p>
                      <RadioGroup 
                        defaultValue={selectedPlan} 
                        onValueChange={setSelectedPlan}
                        className="grid gap-4"
                      >
                        {plans.map((plan) => (
                          <Label
                            key={plan.id}
                            htmlFor={plan.id}
                            className={`flex flex-col sm:flex-row border rounded-lg p-4 cursor-pointer ${
                              selectedPlan === plan.id 
                                ? "border-primary bg-primary/5" 
                                : "border-muted"
                            }`}
                          >
                            <div className="flex items-center">
                              <RadioGroupItem value={plan.id} id={plan.id} className="mr-2" />
                              <div>
                                <p className="font-medium">{plan.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  ${subscriptionInterval === "yearly" 
                                    ? (plan.price * 12 * 0.8).toFixed(2) 
                                    : plan.price.toFixed(2)
                                  } / {subscriptionInterval}
                                </p>
                              </div>
                            </div>
                            <ul className="mt-2 sm:mt-0 sm:ml-auto text-sm space-y-1">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center">
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setChangePlanDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleChangePlan} 
                      disabled={isLoading || selectedPlan === currentSubscription.plan}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isLoading ? "Updating..." : "Confirm Change"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className="space-y-2">
                        <p>
                          Are you sure you want to cancel your subscription? You will lose access to:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {plans.find(p => p.id === currentSubscription.plan)?.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                        <div className="flex items-center p-3 mt-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
                          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                          <p className="text-sm">
                            Your subscription will remain active until {formatDate(currentSubscription.renewalDate)}.
                          </p>
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelSubscription}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isLoading ? "Processing..." : "Cancel Subscription"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="mr-2 h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>
            View your payment history and download invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "paid" ? "success" : "outline"} className={
                      payment.status === "paid" ? "bg-green-100 text-green-800" : ""
                    }>
                      {payment.status === "paid" ? "Paid" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSettings;
