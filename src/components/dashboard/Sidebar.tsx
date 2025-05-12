"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight,
  Users,
  ClipboardList,
  Bell,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/authStore";

interface SidebarProps {
  className?: string;
  onToggle?: (collapsed: boolean) => void;
}

export function Sidebar({ className, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  
  const isAdmin = user?.role === "admin";
  
  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };
  
  // Initialize on mount
  useEffect(() => {
    if (onToggle) {
      onToggle(collapsed);
    }
  }, []);
  
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "My Requests",
      href: "/dashboard/requests",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Help & Support",
      href: "/dashboard/support",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];
  
  const adminItems = [
    {
      title: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "All Requests",
      href: "/admin/dashboard/requests",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/admin/dashboard/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/admin/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
  ];
  
  const displayItems = [...navItems, ...(isAdmin ? adminItems : [])];
  
  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] bg-sidebar text-sidebar-foreground",
        collapsed ? "w-[60px]" : "w-[240px]",
        "transition-all duration-300 ease-in-out",
        "border-r border-sidebar-border",
        className
      )}
    >
      <div className="flex h-full flex-col">
        <button 
          onClick={toggleCollapsed} 
          className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-background shadow-sm"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
        
        <div className="flex-1 overflow-auto py-6">
          <nav className="mt-0 px-2 space-y-1">
            {displayItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    "transition-colors duration-200",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Admin section if needed */}
        {isAdmin && !collapsed && (
          <div className="mt-2 px-3 py-3">
            <div className="rounded-md bg-sidebar-primary p-2 text-center text-sidebar-primary-foreground">
              <span className="text-xs font-semibold">Admin Access</span>
            </div>
          </div>
        )}
        
        {/* User info at bottom */}
        <div className={cn(
          "px-3 py-4 mt-auto border-t border-sidebar-border",
          collapsed ? "items-center justify-center" : ""
        )}>
          <div className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "space-x-3"
          )}>
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.displayName || "User"}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email || ""}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
} 