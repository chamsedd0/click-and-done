"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight, ArrowLeft, Calendar } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRequestStore } from "@/lib/store/requestStore";
import { updateRequest } from "@/lib/services/requests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RequestFormStep4() {
  const { user } = useAuthStore();
  const { currentRequest, updateCurrentRequest, setFormStep } = useRequestStore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    budget: 0,
    budgetFlexible: true,
    deadline: "", // ISO date string
    urgency: "normal", // low, normal, high
    expectedTimeline: "", // custom timeline info
    additionalTimelineNotes: "",
  });
  
  // Load current request data
  useEffect(() => {
    if (currentRequest) {
      const deadline = currentRequest.deadline 
        ? new Date(currentRequest.deadline).toISOString().split('T')[0]
        : "";
        
      setFormData({
        budget: currentRequest.budget || 0,
        budgetFlexible: currentRequest.budgetFlexible !== false, // default to true if not set
        deadline,
        urgency: currentRequest.urgency || "normal",
        expectedTimeline: currentRequest.expectedTimeline || "",
        additionalTimelineNotes: currentRequest.additionalTimelineNotes || "",
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
    
    if (name === "budget") {
      // Convert to number and handle invalid inputs
      const numberValue = parseFloat(value);
      if (!isNaN(numberValue) && numberValue >= 0) {
        setFormData(prev => ({
          ...prev,
          [name]: numberValue,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePrevStep = async () => {
    // Save current progress before going back
    try {
      if (currentRequest) {
        const dataToUpdate = {
          ...formData,
          deadline: formData.deadline ? new Date(formData.deadline).getTime() : undefined,
        };
        
        await updateRequest(currentRequest.id, dataToUpdate);
        updateCurrentRequest(dataToUpdate);
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
    
    setFormStep(3);
    router.push("/request/form/step-3");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (!currentRequest) {
        throw new Error("No active request");
      }
      
      // Convert date string to timestamp
      const dataToUpdate = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).getTime() : undefined,
      };
      
      // Update request in Firestore
      await updateRequest(currentRequest.id, dataToUpdate);
      
      // Update local state
      updateCurrentRequest(dataToUpdate);
      
      // Move to next step
      setFormStep(5);
      
      // Navigate to next step
      router.push("/request/form/step-5");
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
      
      // Convert date string to timestamp
      const dataToUpdate = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).getTime() : undefined,
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
            <p className="text-muted-foreground">Step 4 of 5: Timeline & Budget</p>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
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
            <CardTitle>Timeline & Budget</CardTitle>
            <CardDescription>
              Tell us about your budget and timeline expectations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="step4Form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Budget</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      placeholder="Enter your budget in USD"
                      value={formData.budget || ""}
                      onChange={handleInputChange}
                      min="0"
                      step="100"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="budgetFlexible"
                      name="budgetFlexible"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={formData.budgetFlexible}
                      onChange={handleCheckboxChange}
                      disabled={isLoading}
                    />
                    <Label htmlFor="budgetFlexible" className="text-sm font-medium">
                      My budget is flexible
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Timeline</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Desired Completion Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Project Urgency</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => handleSelectChange("urgency", value)}
                    >
                      <SelectTrigger id="urgency">
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          Low - No specific deadline
                        </SelectItem>
                        <SelectItem value="normal">
                          Normal - Standard timeline is fine
                        </SelectItem>
                        <SelectItem value="high">
                          High - Needed as soon as possible
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expectedTimeline">Expected Timeline</Label>
                    <Textarea
                      id="expectedTimeline"
                      name="expectedTimeline"
                      placeholder="Describe your expected timeline for the project..."
                      value={formData.expectedTimeline}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalTimelineNotes">Additional Timeline Notes</Label>
                    <Textarea
                      id="additionalTimelineNotes"
                      name="additionalTimelineNotes"
                      placeholder="Add any other relevant information about your project timeline..."
                      value={formData.additionalTimelineNotes}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
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
              form="step4Form"
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