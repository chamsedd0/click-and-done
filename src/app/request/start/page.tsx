"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight, Globe, ShoppingCart, Briefcase } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRequestStore } from "@/lib/store/requestStore";
import { createRequest } from "@/lib/services/requests";

export default function RequestStartPage() {
  const { user } = useAuthStore();
  const { setCurrentRequest, setFormStep, resetForm } = useRequestStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPlan = searchParams.get("plan");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Reset form state on page load
  useEffect(() => {
    resetForm();
  }, [resetForm]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user && !useAuthStore.getState().isLoading) {
      router.push(`/login?redirect=${encodeURIComponent("/request/start")}`);
    }
  }, [user, router]);
  
  const templates = [
    {
      id: "business",
      title: "Business Website",
      description: "Professional website for your business with focus on services, about, and contact pages.",
      icon: <Briefcase className="h-8 w-8" />,
      features: ["Homepage", "About Page", "Services", "Contact Form", "Mobile Responsive"],
      estimatedCost: "$499 - $1,499",
    },
    {
      id: "ecommerce",
      title: "E-Commerce Store",
      description: "Fully functional online store with product catalog, cart, and checkout functionality.",
      icon: <ShoppingCart className="h-8 w-8" />,
      features: ["Product Catalog", "Shopping Cart", "Secure Checkout", "User Accounts", "Order Management"],
      estimatedCost: "$999 - $2,499",
    },
    {
      id: "custom",
      title: "Custom Website",
      description: "Fully customized website built to your exact specifications and requirements.",
      icon: <Globe className="h-8 w-8" />,
      features: ["Custom Design", "Tailored Functionality", "Unique Features", "Advanced Integrations", "Scalable Architecture"],
      estimatedCost: "Custom Quote",
    },
  ];
  
  const handleTemplateSelect = async (templateId: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/request/start")}`);
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Create new draft request in Firestore
      const requestData = {
        title: `New ${templateId === "business" ? "Business" : templateId === "ecommerce" ? "E-Commerce" : "Custom"} Website Request`,
        description: `Website request for a ${templateId} template.`,
        websiteType: templateId,
      };
      
      const requestId = await createRequest(user.uid, requestData);
      
      // Set current request in store
      setCurrentRequest({
        id: requestId,
        userId: user.uid,
        title: requestData.title,
        description: requestData.description,
        status: "draft",
        currentStage: "requirements",
        progress: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        collaboratorIds: [],
        websiteType: templateId as any,
      });
      
      // Set form step to 1 (first step)
      setFormStep(1);
      
      // Redirect to form
      router.push("/request/form/step-1");
    } catch (error: any) {
      console.error("Error creating request:", error);
      setError(
        error.message || "Failed to create request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // If loading or not logged in, show loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container py-16 max-w-5xl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Start Your Website Request</h1>
          <p className="text-xl text-muted-foreground">
            Choose a template to get started with your website request.
          </p>
        </div>
        
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive max-w-md mx-auto">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className={`overflow-hidden ${
                preselectedPlan && preselectedPlan === template.id
                  ? "border-primary ring-2 ring-primary ring-opacity-50"
                  : ""
              }`}
            >
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{template.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {template.description}
                    </CardDescription>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2">
                    {template.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-medium text-sm mb-2">Features:</h4>
                <ul className="space-y-1 text-sm">
                  {template.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium">Estimated Cost:</p>
                  <p className="text-lg font-bold">{template.estimatedCost}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleTemplateSelect(template.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  Select Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Not sure which template to choose? We can help you decide.
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 