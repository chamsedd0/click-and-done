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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RequestFormStep2() {
  const { user } = useAuthStore();
  const { currentRequest, updateCurrentRequest, setFormStep } = useRequestStore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    designPreferences: {
      colorScheme: "",
      layoutPreference: "",
      styleReferences: [""],
    },
    styleDescription: "",
    exampleWebsites: "",
    logoExists: false,
    brandGuidelinesExist: false,
    additionalDesignNotes: "",
  });
  
  // Load current request data
  useEffect(() => {
    if (currentRequest) {
      setFormData({
        designPreferences: {
          colorScheme: currentRequest.designPreferences?.colorScheme || "",
          layoutPreference: currentRequest.designPreferences?.layoutPreference || "",
          styleReferences: currentRequest.designPreferences?.styleReferences || [""],
        },
        styleDescription: currentRequest.styleDescription || "",
        exampleWebsites: currentRequest.exampleWebsites || "",
        logoExists: currentRequest.logoExists || false,
        brandGuidelinesExist: currentRequest.brandGuidelinesExist || false,
        additionalDesignNotes: currentRequest.additionalDesignNotes || "",
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
    
    if (name === "exampleWebsites" || name === "styleDescription" || name === "additionalDesignNotes") {
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
    if (name === "colorScheme" || name === "layoutPreference") {
      setFormData(prev => ({
        ...prev,
        designPreferences: {
          ...prev.designPreferences,
          [name]: value,
        },
      }));
    }
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
    
    setFormStep(1);
    router.push("/request/form/step-1");
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
      setFormStep(3);
      
      // Navigate to next step
      router.push("/request/form/step-3");
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
            <p className="text-muted-foreground">Step 2 of 5: Design Preferences</p>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
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
            <CardTitle>Design Preferences</CardTitle>
            <CardDescription>
              Tell us about your design preferences and style.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="step2Form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="colorScheme">Color Scheme Preference</Label>
                  <Select
                    value={formData.designPreferences.colorScheme}
                    onValueChange={(value) => handleSelectChange("colorScheme", value)}
                  >
                    <SelectTrigger id="colorScheme">
                      <SelectValue placeholder="Select color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light & Minimal</SelectItem>
                      <SelectItem value="dark">Dark & Bold</SelectItem>
                      <SelectItem value="colorful">Colorful & Vibrant</SelectItem>
                      <SelectItem value="corporate">Corporate & Professional</SelectItem>
                      <SelectItem value="earthy">Earthy & Natural</SelectItem>
                      <SelectItem value="custom">Custom (Describe below)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="layoutPreference">Layout Preference</Label>
                  <Select
                    value={formData.designPreferences.layoutPreference}
                    onValueChange={(value) => handleSelectChange("layoutPreference", value)}
                  >
                    <SelectTrigger id="layoutPreference">
                      <SelectValue placeholder="Select layout style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern & Clean</SelectItem>
                      <SelectItem value="traditional">Traditional & Formal</SelectItem>
                      <SelectItem value="creative">Creative & Unique</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="bootstrap">Standard Bootstrap</SelectItem>
                      <SelectItem value="custom">Custom (Describe below)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="styleDescription">Design Style Description</Label>
                  <Textarea
                    id="styleDescription"
                    name="styleDescription"
                    placeholder="Describe your preferred design style in detail..."
                    value={formData.styleDescription}
                    onChange={handleInputChange}
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exampleWebsites">Example Websites You Like</Label>
                  <Textarea
                    id="exampleWebsites"
                    name="exampleWebsites"
                    placeholder="Please list URLs of websites with designs you like..."
                    value={formData.exampleWebsites}
                    onChange={handleInputChange}
                    rows={3}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Include specific aspects you like about these examples
                  </p>
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="logoExists"
                      name="logoExists"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={formData.logoExists}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="logoExists" className="text-sm font-medium">
                      I already have a logo
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="brandGuidelinesExist"
                      name="brandGuidelinesExist"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={formData.brandGuidelinesExist}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="brandGuidelinesExist" className="text-sm font-medium">
                      I have brand guidelines to follow
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalDesignNotes">Additional Design Notes</Label>
                  <Textarea
                    id="additionalDesignNotes"
                    name="additionalDesignNotes"
                    placeholder="Any other design preferences or requirements..."
                    value={formData.additionalDesignNotes}
                    onChange={handleInputChange}
                    rows={3}
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
              form="step2Form"
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