"use client";

import React, { useEffect, useState } from "react";
import { 
  Button, 
  Badge,
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  Label,
  Input,
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  toast
} from "@/components/ui";
import { Payment, PaymentType } from "@/lib/services/payments";
import { CreditCard, Check, X, RefreshCw, Loader2, Receipt, DollarSign, ClipboardCheck, Clock, CheckCircle2, XCircle, ReceiptText } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { createPayment } from "@/lib/services/payments";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PaymentListProps {
  payments: Payment[];
  requestId?: string;
  onPaymentAdded?: (payment: Payment) => void;
}

export function PaymentList({ payments, requestId, onPaymentAdded }: PaymentListProps) {
  const { user } = useAuthStore();
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
  const formatDate = (timestamp?: number): string => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const handleSubmitPayment = async () => {
    if (!user || !requestId) return;
    
    if (!amount || isNaN(parseFloat(amount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddingPayment(true);
    
    try {
      // For demo purposes, we'll create a simulated payment
      const paymentId = await createPayment(
        requestId,
        user.uid,
        parseFloat(amount),
        'USD', // Default currency 
        'installment' as PaymentType, // Using installment as the default payment type
        description
      );
      
      const newPayment: Payment = {
        id: paymentId,
        requestId,
        userId: user.uid,
        amount: parseFloat(amount),
        currency: 'USD',
        type: 'installment',
        description,
        paymentMethod: paymentMethod,
        status: 'paid',
        transactionId: `tx_${Math.random().toString(36).substring(2, 15)}`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      if (onPaymentAdded) {
        onPaymentAdded(newPayment);
      }
      
      toast({
        title: "Payment successful",
        description: `Your payment of ${formatCurrency(parseFloat(amount))} has been processed.`,
      });
      
      // Reset form
      setAmount("");
      setDescription("");
      setPaymentMethod("credit_card");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment failed",
        description: error.message || "An error occurred while processing your payment",
        variant: "destructive",
      });
    } finally {
      setIsAddingPayment(false);
    }
  };
  
  if (!isClient) {
    return null;
  }
  
  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <ReceiptText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No payments yet</h3>
        <p className="text-muted-foreground mt-1">
          Payments made for this request will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Payment header and actions */}
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Payment History</h3>
        
        {requestId && user && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Make Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Make a Payment</DialogTitle>
                <DialogDescription>
                  Enter payment details to proceed with your transaction.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What is this payment for?"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitPayment}
                  disabled={isAddingPayment}
                >
                  {isAddingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* Payment list */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">
                {payment.description}
              </TableCell>
              <TableCell>{formatCurrency(payment.amount)}</TableCell>
              <TableCell>{getStatusBadge(payment.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {payment.paymentMethod}
                </div>
              </TableCell>
              <TableCell>{formatDate(payment.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 