"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ["client", "admin", "collaborator"] 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until auth state is loaded
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      
      // Check role-based access
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
        return;
      }
      
      // Check if profile is completed
      if (!user.profileCompleted && pathname !== "/complete-profile") {
        router.push("/complete-profile");
        return;
      }
    }
  }, [user, isLoading, router, pathname, allowedRoles]);

  // Show loading state
  if (isLoading || !user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Show content when authenticated and authorized
  return <>{children}</>;
} 