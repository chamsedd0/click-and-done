"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/lib/store/authStore";
import { getRequestById } from "@/lib/services/requests";
import { getRequestFeedback } from "@/lib/services/feedback";
import { getRequestFiles } from "@/lib/services/files";
import { getRequestPayments } from "@/lib/services/payments";
import { FeedbackList } from "@/components/feedback/FeedbackList";
import { FileUploader } from "@/components/files/FileUploader";
import { FileList } from "@/components/files/FileList";
import { PaymentList } from "@/components/payments/PaymentList";
import { WebsiteRequest, Feedback, FileMetadata, Payment } from "@/lib/types/database";
import { Loader2, ArrowLeft, Clock, CheckCircle, FileText, AlertCircle, X } from "lucide-react";

interface RequestDetailsProps {
  id: string;
}

export default function RequestDetails({ id }: RequestDetailsProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [request, setRequest] = useState<WebsiteRequest | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    const fetchRequestData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError("");
      
      try {
        // Fetch request details
        const requestData = await getRequestById(id);
        
        if (!requestData) {
          setError("Request not found");
          setIsLoading(false);
          return;
        }
        
        // Check permission (user must be owner, collaborator, or admin)
        const userId = user.uid || user.id || "";
        const isOwner = requestData.userId === userId;
        const isCollaborator = requestData.collaboratorIds.includes(userId);
        const isAdmin = user.role === 'admin';
        
        if (!isOwner && !isCollaborator && !isAdmin) {
          setError("You don't have permission to view this request");
          setIsLoading(false);
          return;
        }
        
        setRequest(requestData);
        
        // Fetch related data
        const [feedbackData, filesData, paymentsData] = await Promise.all([
          getRequestFeedback(id),
          getRequestFiles(id),
          getRequestPayments(id),
        ]);
        
        setFeedback(feedbackData);
        setFiles(filesData);
        setPayments(paymentsData);
      } catch (error: any) {
        console.error("Error fetching request data:", error);
        setError(error.message || "Failed to load request details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequestData();
  }, [id, user]);
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Draft
          </Badge>
        );
      case "submitted":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Submitted
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="default" className="bg-amber-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case "review":
        return (
          <Badge variant="default" className="bg-purple-500 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Review
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Helper function to format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }
  
  // Show error state
  if (error || !request) {
    return (
      <ProtectedRoute>
        <div className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Error
              </CardTitle>
              <CardDescription>
                {error || "Failed to load request details"}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                {getStatusBadge(request.status)}
              </div>
              <h1 className="text-3xl font-bold">{request.title}</h1>
              <p className="text-muted-foreground">
                Created {formatDate(request.createdAt)} · Last updated {formatDate(request.updatedAt)}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {request.status === "draft" && (
                <Button asChild>
                  <Link href={`/request/form/step-1?id=${request.id}`}>
                    Continue Editing
                  </Link>
                </Button>
              )}
              
              {["review", "in_progress"].includes(request.status) && (
                <Button>
                  Provide Feedback
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress */}
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${request.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>Requirements</div>
            <div>Design</div>
            <div>Development</div>
            <div>Testing</div>
            <div>Delivery</div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Business Name</h3>
                      <p>{request.businessName || "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Business Type</h3>
                      <p>{request.businessType || "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Project Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {request.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Target Audience</h3>
                      <p className="text-sm text-muted-foreground">
                        {request.targetAudience || "Not specified"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Design Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Design Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Color Scheme</h3>
                      <p>{request.designPreferences?.colorScheme || "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Layout Preference</h3>
                      <p>{request.designPreferences?.layoutPreference || "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Design Style</h3>
                      <p className="text-sm text-muted-foreground">
                        {request.styleDescription || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Additional Notes</h3>
                      <p className="text-sm text-muted-foreground">
                        {request.additionalDesignNotes || "None"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Features Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Features & Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {request.functionalRequirements && request.functionalRequirements.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium">Key Requirements</h3>
                        <ul className="ml-5 list-disc text-sm text-muted-foreground">
                          {request.functionalRequirements
                            .filter(req => req.trim() !== "")
                            .map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium">Selected Features</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {request.contentManagement && (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                            <span>Content Management</span>
                          </div>
                        )}
                        {request.userAccounts && (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                            <span>User Accounts</span>
                          </div>
                        )}
                        {request.ecommerce && (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                            <span>E-commerce</span>
                          </div>
                        )}
                        {request.contactForm && (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                            <span>Contact Form</span>
                          </div>
                        )}
                        {request.newsletter && (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                            <span>Newsletter</span>
                          </div>
                        )}
                        {request.blog && (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                            <span>Blog</span>
                          </div>
                        )}
                        {request.socialMedia && (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                            <span>Social Media</span>
                          </div>
                        )}
                        {request.analytics && (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                            <span>Analytics</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {request.customFeatures && (
                      <div>
                        <h3 className="text-sm font-medium">Custom Features</h3>
                        <p className="text-sm text-muted-foreground">{request.customFeatures}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Timeline Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Timeline & Budget</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Budget</h3>
                      <p>{request.budget ? formatCurrency(request.budget) : "Not specified"}
                        {request.budgetFlexible && " (Flexible)"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Desired Completion Date</h3>
                      <p>{request.deadline ? formatDate(request.deadline) : "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Urgency</h3>
                      <p>{request.urgency ? 
                          request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1) 
                          : "Normal"}
                      </p>
                    </div>
                    {request.expectedTimeline && (
                      <div>
                        <h3 className="text-sm font-medium">Expected Timeline</h3>
                        <p className="text-sm text-muted-foreground">{request.expectedTimeline}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Files Tab */}
            <TabsContent value="files" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Files</CardTitle>
                    <CardDescription>
                      Upload and download files related to this request
                    </CardDescription>
                  </div>
                  <FileUploader requestId={id} onUploadComplete={() => {
                    getRequestFiles(id).then(setFiles);
                  }} />
                </CardHeader>
                <CardContent>
                  <FileList files={files} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Feedback Tab */}
            <TabsContent value="feedback" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feedback</CardTitle>
                  <CardDescription>
                    View and provide feedback on the request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FeedbackList 
                    feedback={feedback} 
                    requestId={id} 
                    onFeedbackAdded={(newFeedback) => {
                      setFeedback(prev => [newFeedback, ...prev]);
                    }} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payments</CardTitle>
                  <CardDescription>
                    Track and manage payments for this request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentList payments={payments} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>
                    Track all activities related to this request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Activity tracking will be implemented soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
} 