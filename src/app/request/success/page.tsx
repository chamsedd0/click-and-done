"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

export default function RequestSuccessPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user && !useAuthStore.getState().isLoading) {
      router.push("/login");
    }
  }, [user, router]);
  
  // Loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl py-16">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Request Submitted Successfully!</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Your website request has been received. Our team will review it and get back to you soon.
          </p>
        </div>
        
        <div className="bg-muted/50 border rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-medium mb-4">What happens next?</h2>
          <ol className="space-y-4 text-left">
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 h-6 w-6 flex items-center justify-center text-primary font-medium mr-3 mt-0.5">
                1
              </div>
              <div>
                <span className="font-medium">Review</span>
                <p className="text-sm text-muted-foreground">
                  Our team will review your request details and requirements.
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 h-6 w-6 flex items-center justify-center text-primary font-medium mr-3 mt-0.5">
                2
              </div>
              <div>
                <span className="font-medium">Initial Design</span>
                <p className="text-sm text-muted-foreground">
                  We'll create initial design concepts based on your preferences.
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 h-6 w-6 flex items-center justify-center text-primary font-medium mr-3 mt-0.5">
                3
              </div>
              <div>
                <span className="font-medium">Feedback</span>
                <p className="text-sm text-muted-foreground">
                  You'll be able to review and provide feedback on the designs.
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 h-6 w-6 flex items-center justify-center text-primary font-medium mr-3 mt-0.5">
                4
              </div>
              <div>
                <span className="font-medium">Development</span>
                <p className="text-sm text-muted-foreground">
                  After approval, we'll develop the full website based on the approved design.
                </p>
              </div>
            </li>
          </ol>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button asChild>
            <Link href="/dashboard">
              View Your Requests
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/">
              Back to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 