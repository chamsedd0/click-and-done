"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRequestStore } from "@/lib/store/requestStore";
import { updateRequest } from "@/lib/services/requests";

export default function RequestFormStep1() {
  const { user } = useAuthStore();
  const { currentRequest, updateCurrentRequest, formStep, setFormStep } = useRequestStore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    businessName: "",
    businessType: "",
    targetAudience: "",
  });
  
  // Load current request data
  useEffect(() => {
    if (currentRequest) {
      setFormData({
        title: currentRequest.title || "",
        description: currentRequest.description || "",
        businessName: currentRequest.businessName || "",
        businessType: currentRequest.businessType || "",
        targetAudience: currentRequest.targetAudience || "",
      });
    }
  }, [currentRequest]);
  
  // Redirect if not logged in or no current request
  useEffect(() => {
    if (!user && !useAuthStore.getState().isLoading) {
      router.push("/login?redirect=/request/start");
      return;
    }
    
    if (!currentRequest && !useRequestStore.getState().isLoading) {
      router.push("/request/start");
    }
  }, [user, currentRequest, router]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (!currentRequest) {
        throw new Error("No active request");
      }
      
      // Update request in Firestore
      await updateRequest(currentRequest.id, formData);
      
      // Update local state
      updateCurrentRequest(formData);
      
      // Move to next step
      setFormStep(2);
      
      // Navigate to next step
      router.push("/request/form/step-2");
    } catch (error: any) {
      console.error("Error updating request:", error);
      setError(
        error.message || "Failed to save your information. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveDraft = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      if (!currentRequest) {
        throw new Error("No active request");
      }
      
      // Update request in Firestore
      await updateRequest(currentRequest.id, formData);
      
      // Update local state
      updateCurrentRequest(formData);
      
      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error saving draft:", error);
      setError(
        error.message || "Failed to save draft. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Loading state
  if (!user || !currentRequest) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl py-10">
      <div className="flex flex-col space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Website Request</h1>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Step 1 of 5: Basic Information</p>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
            {error}
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Tell us about your business and the website you want to create.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="step1Form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="E.g., Company Website Redesign"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Briefly describe what you're looking for..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business/Organization Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    placeholder="E.g., Acme Inc."
                    value={formData.businessName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business/Organization Type</Label>
                  <Input
                    id="businessType"
                    name="businessType"
                    placeholder="E.g., Retail, Healthcare, Technology"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Textarea
                    id="targetAudience"
                    name="targetAudience"
                    placeholder="Describe your target audience or customers..."
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ArrowLeft className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
            
            <Button
              type="submit"
              form="step1Form"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="h-4 w-4 mr-2" />
              )}
              Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 