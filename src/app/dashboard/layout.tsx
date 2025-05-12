"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar onToggle={handleSidebarToggle} />
          <main 
            className={`flex-1 transition-all duration-300 p-6 ${
              sidebarCollapsed ? "ml-[60px]" : "ml-[240px]"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 