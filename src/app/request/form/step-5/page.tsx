"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRequestStore } from "@/lib/store/requestStore";
import { updateRequest, submitRequest } from "@/lib/services/requests";
import { createNotification } from "@/lib/services/notifications";

export default function RequestFormStep5() {
  const { user } = useAuthStore();
  const { currentRequest, updateCurrentRequest, setFormStep, resetForm } = useRequestStore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Check completeness of each section
  const [completenessCheck, setCompletenessCheck] = useState({
    basic: false,
    design: false,
    functional: false,
    timeline: false,
  });
  
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
  
  // Check completeness of each section
  useEffect(() => {
    if (currentRequest) {
      setCompletenessCheck({
        basic: Boolean(currentRequest.title && currentRequest.description),
        design: Boolean(currentRequest.designPreferences?.colorScheme || currentRequest.styleDescription),
        functional: Boolean(currentRequest.functionalRequirements?.some(req => req.trim() !== "")),
        timeline: Boolean(currentRequest.budget || currentRequest.deadline || currentRequest.expectedTimeline),
      });
    }
  }, [currentRequest]);
  
  const handlePrevStep = async () => {
    setFormStep(4);
    router.push("/request/form/step-4");
  };
  
  const handleEditSection = (section: number) => {
    setFormStep(section);
    router.push(`/request/form/step-${section}`);
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      if (!currentRequest) {
        throw new Error("No active request");
      }
      
      // Check if all required sections are complete
      const allComplete = Object.values(completenessCheck).every(Boolean);
      
      if (!allComplete) {
        setError("Please complete all sections before submitting your request.");
        setIsLoading(false);
        return;
      }
      
      // Submit request in Firestore (changes status from draft to submitted)
      await submitRequest(currentRequest.id);
      
      // Create notification for admin
      if (user) {
        await createNotification(
          user.uid,
          "Request Submitted",
          `Your website request "${currentRequest.title}" has been submitted successfully.`,
          `/requests/${currentRequest.id}`
        );
      }
      
      // Reset form state
      resetForm();
      
      // Navigate to success page
      router.push("/request/success");
    } catch (error: any) {
      console.error("Error submitting request:", error);
      setError(
        error.message || "Failed to submit your request. Please try again."
      );
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
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Not specified";
    return new Date(timestamp).toLocaleDateString();
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
            <p className="text-muted-foreground">Step 5 of 5: Review & Submit</p>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive flex items-start">
            <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Review Your Request</CardTitle>
            <CardDescription>
              Please review your website request details before submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      1. Basic Information
                    </h3>
                    {completenessCheck.basic ? (
                      <div className="flex items-center text-green-600 dark:text-green-500 text-sm mt-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Complete</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600 dark:text-amber-500 text-sm mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Incomplete</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditSection(1)}
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Project Title:</span>{" "}
                    {currentRequest.title || "Not specified"}
                  </div>
                  <div>
                    <span className="font-medium">Business Name:</span>{" "}
                    {currentRequest.businessName || "Not specified"}
                  </div>
                  <div>
                    <span className="font-medium">Business Type:</span>{" "}
                    {currentRequest.businessType || "Not specified"}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="mt-1 text-muted-foreground">
                      {currentRequest.description || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Design Preferences */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      2. Design Preferences
                    </h3>
                    {completenessCheck.design ? (
                      <div className="flex items-center text-green-600 dark:text-green-500 text-sm mt-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Complete</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600 dark:text-amber-500 text-sm mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Incomplete</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditSection(2)}
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Color Scheme:</span>{" "}
                    {currentRequest.designPreferences?.colorScheme || "Not specified"}
                  </div>
                  <div>
                    <span className="font-medium">Layout Preference:</span>{" "}
                    {currentRequest.designPreferences?.layoutPreference || "Not specified"}
                  </div>
                  {currentRequest.styleDescription && (
                    <div>
                      <span className="font-medium">Style Description:</span>
                      <p className="mt-1 text-muted-foreground">
                        {currentRequest.styleDescription}
                      </p>
                    </div>
                  )}
                  {currentRequest.logoExists && (
                    <div>
                      <span className="font-medium">Has Logo:</span> Yes
                    </div>
                  )}
                </div>
              </div>
              
              {/* Functional Requirements */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      3. Functional Requirements
                    </h3>
                    {completenessCheck.functional ? (
                      <div className="flex items-center text-green-600 dark:text-green-500 text-sm mt-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Complete</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600 dark:text-amber-500 text-sm mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Incomplete</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditSection(3)}
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-3 text-sm">
                  {currentRequest.functionalRequirements && currentRequest.functionalRequirements.length > 0 && (
                    <div>
                      <span className="font-medium">Key Requirements:</span>
                      <ul className="mt-1 pl-5 list-disc text-muted-foreground">
                        {currentRequest.functionalRequirements
                          .filter(req => req.trim() !== "")
                          .map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Common Features */}
                  <div className="mt-2">
                    <span className="font-medium">Selected Features:</span>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {currentRequest.contentManagement && (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                          <span>Content Management</span>
                        </div>
                      )}
                      {currentRequest.userAccounts && (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                          <span>User Accounts</span>
                        </div>
                      )}
                      {currentRequest.ecommerce && (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                          <span>E-commerce</span>
                        </div>
                      )}
                      {currentRequest.contactForm && (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                          <span>Contact Form</span>
                        </div>
                      )}
                      {currentRequest.newsletter && (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                          <span>Newsletter</span>
                        </div>
                      )}
                      {currentRequest.blog && (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                          <span>Blog</span>
                        </div>
                      )}
                      {currentRequest.socialMedia && (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                          <span>Social Media</span>
                        </div>
                      )}
                      {currentRequest.analytics && (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                          <span>Analytics</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Timeline & Budget */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      4. Timeline & Budget
                    </h3>
                    {completenessCheck.timeline ? (
                      <div className="flex items-center text-green-600 dark:text-green-500 text-sm mt-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Complete</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600 dark:text-amber-500 text-sm mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Incomplete</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditSection(4)}
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Budget:</span>{" "}
                    {currentRequest.budget ? formatCurrency(currentRequest.budget) : "Not specified"}
                    {currentRequest.budgetFlexible && " (Flexible)"}
                  </div>
                  <div>
                    <span className="font-medium">Desired Completion Date:</span>{" "}
                    {formatDate(currentRequest.deadline)}
                  </div>
                  <div>
                    <span className="font-medium">Urgency:</span>{" "}
                    {currentRequest.urgency === "high" ? "High" : 
                     currentRequest.urgency === "low" ? "Low" : 
                     "Normal"}
                  </div>
                  {currentRequest.expectedTimeline && (
                    <div>
                      <span className="font-medium">Expected Timeline:</span>
                      <p className="mt-1 text-muted-foreground">
                        {currentRequest.expectedTimeline}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
              onClick={handleSubmit}
              disabled={isLoading || !Object.values(completenessCheck).every(Boolean)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Submit Request
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 