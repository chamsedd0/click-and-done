"use client";

import React from "react";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Loader2, 
  MessageSquare, 
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/lib/store/authStore";
import { getRequestById } from "@/lib/services/requests";
import { WebsiteRequest } from "@/lib/types/database";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuthStore();
  const router = useRouter();
  const [request, setRequest] = useState<WebsiteRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getRequestById(id)
      .then((data) => {
        if (!data) {
          setError("Request not found");
          return;
        }
        setRequest(data);
      })
      .catch((err) => {
        setError("Failed to load request details");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [user, id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center text-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Request</h2>
          <p className="text-muted-foreground mb-6">{error || "Request not found"}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{request.title}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={request.status} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm">
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm">
                {new Date(request.updatedAt).toLocaleDateString()}
              </span>
            </div>
            {request.deadline && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Deadline</span>
                <span className="text-sm">
                  {new Date(request.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {request.businessName && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Business Name</span>
                <span className="text-sm">{request.businessName}</span>
              </div>
            )}
            {request.businessType && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Business Type</span>
                <span className="text-sm">{request.businessType}</span>
              </div>
            )}
            {request.budget && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Budget</span>
                <span className="text-sm">${request.budget}</span>
              </div>
            )}
            {request.estimatedHours && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Estimated Hours</span>
                <span className="text-sm">{request.estimatedHours} hours</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {request.description}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Functional Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              {request.functionalRequirements && request.functionalRequirements.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {request.functionalRequirements.map((req, index) => (
                    <li key={index} className="text-muted-foreground">{req}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No functional requirements specified.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.designPreferences?.colorScheme && (
                <div>
                  <h4 className="font-medium mb-2">Color Scheme</h4>
                  <p className="text-muted-foreground">{request.designPreferences.colorScheme}</p>
                </div>
              )}
              {request.designPreferences?.layoutPreference && (
                <div>
                  <h4 className="font-medium mb-2">Layout Preference</h4>
                  <p className="text-muted-foreground">{request.designPreferences.layoutPreference}</p>
                </div>
              )}
              {request.styleDescription && (
                <div>
                  <h4 className="font-medium mb-2">Style Description</h4>
                  <p className="text-muted-foreground">{request.styleDescription}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.expectedTimeline && (
                <div>
                  <h4 className="font-medium mb-2">Expected Timeline</h4>
                  <p className="text-muted-foreground">{request.expectedTimeline}</p>
                </div>
              )}
              {request.urgency && (
                <div>
                  <h4 className="font-medium mb-2">Urgency</h4>
                  <Badge variant="outline" className="capitalize">
                    {request.urgency}
                  </Badge>
                </div>
              )}
              {request.additionalTimelineNotes && (
                <div>
                  <h4 className="font-medium mb-2">Additional Notes</h4>
                  <p className="text-muted-foreground">{request.additionalTimelineNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const getStatusDetails = () => {
    switch (status) {
      case "draft":
        return { label: "Draft", icon: <Clock className="h-3 w-3" />, className: "border-muted-foreground/30 text-muted-foreground" };
      case "submitted":
        return { label: "Submitted", icon: <FileText className="h-3 w-3" />, className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" };
      case "in_progress":
        return { label: "In Progress", icon: <RefreshCw className="h-3 w-3" />, className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" };
      case "review":
        return { label: "Review", icon: <MessageSquare className="h-3 w-3" />, className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" };
      case "completed":
        return { label: "Completed", icon: <CheckCircle2 className="h-3 w-3" />, className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" };
      case "cancelled":
        return { label: "Cancelled", icon: <AlertCircle className="h-3 w-3" />, className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" };
      default:
        return { label: status, icon: null, className: "" };
    }
  };

  const { label, icon, className } = getStatusDetails();

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${className}`}>
      {icon}
      {label}
    </Badge>
  );
} 