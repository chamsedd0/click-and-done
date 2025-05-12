"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight, ArrowLeft, Plus, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRequestStore } from "@/lib/store/requestStore";
import { updateRequest } from "@/lib/services/requests";

export default function RequestFormStep3() {
  const { user } = useAuthStore();
  const { currentRequest, updateCurrentRequest, setFormStep } = useRequestStore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    functionalRequirements: [""],
    contentManagement: false,
    userAccounts: false,
    ecommerce: false,
    contactForm: false,
    newsletter: false,
    blog: false,
    socialMedia: false,
    analytics: false,
    customFeatures: "",
  });
  
  // Load current request data
  useEffect(() => {
    if (currentRequest) {
      setFormData({
        functionalRequirements: currentRequest.functionalRequirements || [""],
        contentManagement: currentRequest.contentManagement || false,
        userAccounts: currentRequest.userAccounts || false,
        ecommerce: currentRequest.ecommerce || false,
        contactForm: currentRequest.contactForm || false,
        newsletter: currentRequest.newsletter || false,
        blog: currentRequest.blog || false,
        socialMedia: currentRequest.socialMedia || false,
        analytics: currentRequest.analytics || false,
        customFeatures: currentRequest.customFeatures || "",
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...formData.functionalRequirements];
    updatedRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      functionalRequirements: updatedRequirements,
    }));
  };
  
  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      functionalRequirements: [...prev.functionalRequirements, ""],
    }));
  };
  
  const removeRequirement = (index: number) => {
    if (formData.functionalRequirements.length === 1) {
      return; // Keep at least one requirement field
    }
    
    const updatedRequirements = [...formData.functionalRequirements];
    updatedRequirements.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      functionalRequirements: updatedRequirements,
    }));
  };
  
  const handlePrevStep = async () => {
    // Save current progress before going back
    try {
      if (currentRequest) {
        await updateRequest(currentRequest.id, formData);
        updateCurrentRequest(formData);
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
    
    setFormStep(2);
    router.push("/request/form/step-2");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (!currentRequest) {
        throw new Error("No active request");
      }
      
      // Clean up empty requirements
      const cleanedRequirements = formData.functionalRequirements.filter(req => req.trim() !== "");
      if (cleanedRequirements.length === 0) {
        cleanedRequirements.push(""); // Keep at least one empty field
      }
      
      const dataToUpdate = {
        ...formData,
        functionalRequirements: cleanedRequirements,
      };
      
      // Update request in Firestore
      await updateRequest(currentRequest.id, dataToUpdate);
      
      // Update local state
      updateCurrentRequest(dataToUpdate);
      
      // Move to next step
      setFormStep(4);
      
      // Navigate to next step
      router.push("/request/form/step-4");
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
      
      // Clean up empty requirements
      const cleanedRequirements = formData.functionalRequirements.filter(req => req.trim() !== "");
      if (cleanedRequirements.length === 0) {
        cleanedRequirements.push(""); // Keep at least one empty field
      }
      
      const dataToUpdate = {
        ...formData,
        functionalRequirements: cleanedRequirements,
      };
      
      // Update request in Firestore
      await updateRequest(currentRequest.id, dataToUpdate);
      
      // Update local state
      updateCurrentRequest(dataToUpdate);
      
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
            <p className="text-muted-foreground">Step 3 of 5: Functional Requirements</p>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
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
            <CardTitle>Functional Requirements</CardTitle>
            <CardDescription>
              Tell us what features and functionality you need for your website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="step3Form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base">Key Requirements</Label>
                  
                  {formData.functionalRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Textarea
                        placeholder={`Requirement ${index + 1}`}
                        value={requirement}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        className="flex-grow"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRequirement(index)}
                        disabled={formData.functionalRequirements.length === 1 || isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={addRequirement}
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-base">Common Features</Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="contentManagement"
                        name="contentManagement"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.contentManagement}
                        onChange={handleCheckboxChange}
                        disabled={isLoading}
                      />
                      <Label htmlFor="contentManagement" className="text-sm font-medium">
                        Content Management System (CMS)
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="userAccounts"
                        name="userAccounts"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.userAccounts}
                        onChange={handleCheckboxChange}
                        disabled={isLoading}
                      />
                      <Label htmlFor="userAccounts" className="text-sm font-medium">
                        User Accounts / Login System
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ecommerce"
                        name="ecommerce"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.ecommerce}
                        onChange={handleCheckboxChange}
                        disabled={isLoading}
                      />
                      <Label htmlFor="ecommerce" className="text-sm font-medium">
                        E-commerce / Shopping Cart
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="contactForm"
                        name="contactForm"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.contactForm}
                        onChange={handleCheckboxChange}
                        disabled={isLoading}
                      />
                      <Label htmlFor="contactForm" className="text-sm font-medium">
                        Contact Form
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="newsletter"
                        name="newsletter"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.newsletter}
                        onChange={handleCheckboxChange}
                        disabled={isLoading}
                      />
                      <Label htmlFor="newsletter" className="text-sm font-medium">
                        Newsletter Subscription
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="blog"
                        name="blog"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.blog}
                        onChange={handleCheckboxChange}
                        disabled={isLoading}
                      />
                      <Label htmlFor="blog" className="text-sm font-medium">
                        Blog / News Section
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="socialMedia"
                        name="socialMedia"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.socialMedia}
                        onChange={handleCheckboxChange}
                        disabled={isLoading}
                      />
                      <Label htmlFor="socialMedia" className="text-sm font-medium">
                        Social Media Integration
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="analytics"
                        name="analytics"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.analytics}
                        onChange={handleCheckboxChange}
                        disabled={isLoading}
                      />
                      <Label htmlFor="analytics" className="text-sm font-medium">
                        Analytics Integration
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customFeatures">Custom Features</Label>
                  <Textarea
                    id="customFeatures"
                    name="customFeatures"
                    placeholder="Describe any custom features or functionality not listed above..."
                    value={formData.customFeatures}
                    onChange={handleInputChange}
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Draft
              </Button>
            </div>
            
            <Button
              type="submit"
              form="step3Form"
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