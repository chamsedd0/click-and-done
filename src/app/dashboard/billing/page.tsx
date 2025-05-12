"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Download, 
  Plus, 
  Clock, 
  CheckCircle, 
  ReceiptText, 
  ArrowRightCircle, 
  Layers,
  Edit,
  Trash2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/store/authStore";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

export default function BillingPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [usageData, setUsageData] = useState(null);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Normally you would fetch this data from your API
      setCurrentPlan(null); // Set to null to show the empty state
      setPaymentMethods([]);
      setInvoices([]);
      setUsageData({
        currentUsage: 2,
        limit: 10,
        percentage: 20,
        resetDate: "Jun 30, 2023"
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };
  
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Manage your plan, payment methods, and view your billing history
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="billing-history">Billing History</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        
        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          {isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle className="animate-pulse bg-muted h-6 w-48 rounded"></CardTitle>
                <CardDescription className="animate-pulse bg-muted h-4 w-64 rounded mt-2"></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="animate-pulse bg-muted h-20 rounded"></div>
                <div className="animate-pulse bg-muted h-16 rounded"></div>
              </CardContent>
              <CardFooter>
                <div className="animate-pulse bg-muted h-10 w-32 rounded"></div>
              </CardFooter>
            </Card>
          ) : currentPlan ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Current Plan: {currentPlan.name}</CardTitle>
                    <CardDescription>
                      Your subscription renews on {formatDate(currentPlan.renewalDate)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{currentPlan.name} Plan Includes:</p>
                    <ul className="mt-2 space-y-1">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:text-right">
                    <p className="text-2xl font-bold">{formatCurrency(currentPlan.price)}</p>
                    <p className="text-muted-foreground">per {currentPlan.interval}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Available Plan Upgrades</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Example upgrade plan card */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Professional Plan</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="font-bold text-xl">{formatCurrency(49.99)}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                        <ul className="mt-2 space-y-1">
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            Everything in {currentPlan.name}
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            Unlimited projects
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            Priority support
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          <ArrowRightCircle className="mr-2 h-4 w-4" />
                          Upgrade
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    {/* Example upgrade plan card */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Enterprise Plan</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="font-bold text-xl">{formatCurrency(99.99)}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                        <ul className="mt-2 space-y-1">
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            Everything in Professional
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            Custom branding
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            Dedicated account manager
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          <ArrowRightCircle className="mr-2 h-4 w-4" />
                          Upgrade
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 justify-between">
                <Button variant="outline" className="text-destructive">
                  Cancel Subscription
                </Button>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Change Plan
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Choose a Plan</CardTitle>
                <CardDescription>
                  Select a subscription plan that best fits your needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Starter Plan */}
                  <Card className="border-2 border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle>Starter</CardTitle>
                      <CardDescription>
                        Perfect for individuals and small projects
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-3xl font-bold">{formatCurrency(19.99)}</span>
                        <span className="text-muted-foreground"> / month</span>
                      </div>
                      <Separator />
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>Up to 3 website projects</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>Basic templates</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>Standard support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Select Starter</Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Professional Plan */}
                  <Card className="border-2 border-primary shadow-md relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>Professional</CardTitle>
                      <CardDescription>
                        For businesses with multiple website needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-3xl font-bold">{formatCurrency(49.99)}</span>
                        <span className="text-muted-foreground"> / month</span>
                      </div>
                      <Separator />
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>Up to 10 website projects</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>Advanced templates</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>Custom domain support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Select Professional</Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Enterprise Plan */}
                  <Card className="border-2 border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle>Enterprise</CardTitle>
                      <CardDescription>
                        For large companies with advanced needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-3xl font-bold">{formatCurrency(99.99)}</span>
                        <span className="text-muted-foreground"> / month</span>
                      </div>
                      <Separator />
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>Unlimited website projects</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>Premium templates & custom branding</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>24/7 dedicated support</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>Dedicated account manager</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Select Enterprise</Button>
                    </CardFooter>
                  </Card>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg text-center text-sm">
                  <p className="mb-2">Not ready to commit? Start with our 14-day free trial.</p>
                  <Button variant="outline">Start Free Trial</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods securely
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-muted rounded"></div>
                          <div className="h-3 w-24 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="h-8 w-20 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      {/* Payment method card would go here */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No payment methods found</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    Add a payment method to manage your subscription.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              )}
            </CardContent>
            {paymentMethods.length > 0 && (
              <CardFooter>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Payment Method
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        {/* Billing History Tab */}
        <TabsContent value="billing-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-muted rounded"></div>
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-3">
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded"></div>
                        <div className="h-3 w-24 bg-muted rounded"></div>
                      </div>
                      <div className="h-8 w-20 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : invoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Invoice Number</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice, index) => (
                      <TableRow key={index}>
                        {/* Invoice data would go here */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <ReceiptText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No invoices yet</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    When you make a payment, your invoices will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
              <CardDescription>
                Track your current usage and limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="animate-pulse space-y-6">
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-muted rounded"></div>
                    <div className="h-2 w-full bg-muted rounded"></div>
                    <div className="flex justify-between">
                      <div className="h-3 w-10 bg-muted rounded"></div>
                      <div className="h-3 w-10 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              ) : usageData ? (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Website Projects</h4>
                      <span className="text-muted-foreground text-sm">
                        {usageData.currentUsage} of {usageData.limit}
                      </span>
                    </div>
                    <Progress value={usageData.percentage} className="h-2" />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {usageData.currentUsage} used
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {usageData.limit - usageData.currentUsage} remaining
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg flex items-start gap-3">
                    <div className="mt-0.5">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Usage resets on {usageData.resetDate}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Need more resources? Upgrade your plan to increase your limits.
                      </p>
                      <Button variant="outline" className="mt-3">
                        <Layers className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No usage data available</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    Subscribe to a plan to start tracking your usage.
                  </p>
                  <Button>View Plans</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}