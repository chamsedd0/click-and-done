"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  BarChart3, 
  Clock, 
  Compass, 
  FileText, 
  Inbox, 
  Loader2, 
  MessageSquare, 
  Plus, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  ArrowDownRight,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserRequests } from "@/lib/services/requests";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from '@/components/dashboard/Sidebar';


export default function DashboardPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeRequests: null,
    completedProjects: null,
    newMessages: null,
    totalSpent: null
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [activity, setActivity] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    setIsLoading(true);
    getUserRequests(user.uid)
      .then((data) => {
        setRequests(data);
        setFilteredRequests(data);
        
        // Calculate stats
        const stats = {
          activeRequests: data.filter(req => req.status === 'in_progress').length,
          completedProjects: data.filter(req => req.status === 'completed').length,
          newMessages: 0, // TODO: Implement messages
          totalSpent: data.reduce((sum, req) => sum + (req.budget || 0), 0)
        };
        setStats(stats);
        
        // Set recent requests (last 5)
        setRecentRequests(data.slice(0, 5));
      })
      .catch((err) => {
        console.error('Error fetching requests:', err);
        setRequests([]);
        setFilteredRequests([]);
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-background font-sans flex">
      <Sidebar className="border-r border-border bg-[#181A20] dark:bg-[#101114] shadow-lg" />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 bg-background">
          {/* Welcome Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#60a5fa] via-[#6366f1] to-[#a78bfa] p-14 mb-14 shadow-2xl flex flex-col md:flex-row justify-between items-center min-h-[180px]">
            {/* SVG Icon/Illustration */}
            <div className="absolute right-0 top-0 opacity-2 w-2/3 h-full pointer-events-none select-none flex justify-end items-center">
              <LayoutDashboard className="w-full h-full text-white/10" />
            </div>
            <div className="relative z-10 flex items-center gap-8 w-full md:w-auto">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 shadow-lg">
                <LayoutDashboard className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg whitespace-nowrap">
                  Welcome back, <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{user?.displayName || 'User'}</span>
                </h1>
                <p className="text-lg text-white/90 font-medium">Here's what's happening with your website projects today.</p>
              </div>
            </div>
            <div className="relative z-10 flex gap-4 mt-8 md:mt-0">
              <Button variant="secondary" className="bg-white text-primary font-semibold shadow-md hover:bg-accent/90 transition-transform hover:scale-105 rounded-lg px-6 py-3">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Tour Dashboard
              </Button>
              <Button className="bg-accent text-white font-semibold shadow-md hover:bg-primary/90 transition-transform hover:scale-105 rounded-lg px-6 py-3">
                <Plus className="mr-2 h-5 w-5" />
                New Request
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <StatsCard
              title="Active Requests"
              icon={<FileText className="h-8 w-8 text-primary/90" />}
              value={stats.activeRequests}
              isLoading={isLoading}
              trend={{ value: "+14%", label: "from last month", isPositive: true }}
            />
            <StatsCard
              title="Completed Projects"
              icon={<CheckCircle2 className="h-8 w-8 text-success" />}
              value={stats.completedProjects}
              isLoading={isLoading}
              trend={{ value: "+5", label: "this month", isPositive: true }}
            />
            <StatsCard
              title="New Messages"
              icon={<MessageSquare className="h-8 w-8 text-warning" />}
              value={stats.newMessages}
              isLoading={isLoading}
              trend={{ value: "-3", label: "from yesterday", isPositive: false }}
            />
            <StatsCard
              title="Total Spent"
              icon={<BarChart3 className="h-8 w-8 text-accent" />}
              value={stats.totalSpent}
              isLoading={isLoading}
              prefix="$"
              trend={{ value: "+12%", label: "from last month", isPositive: true }}
            />
          </div>

          {/* Recent Activity / Requests */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-text tracking-tight">
                <FileText className="h-7 w-7 text-primary/80" />
                Current Projects
              </h2>
              <Card className="shadow-xl rounded-2xl transition-transform hover:scale-[1.01] hover:shadow-2xl bg-surface/90 dark:bg-[#181A20] border border-border">
                <CardContent className="p-8">
                  {isLoading ? (
                    <div className="space-y-6">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-2 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : recentRequests && recentRequests.length > 0 ? (
                    <div className="space-y-8">
                      {recentRequests.map((request) => (
                        <div key={request.id} className="space-y-2 border-b border-border pb-6 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-xl text-text mb-1 flex items-center gap-2">
                                <FileText className="h-6 w-6 text-accent" />
                                {request.title}
                              </h3>
                              <p className="text-base text-muted-foreground line-clamp-1 mt-1">{request.description}</p>
                            </div>
                            <StatusBadge status={request.status} className="text-base px-4 py-1 rounded-full font-semibold shadow-md" />
                          </div>
                          <div className="flex justify-between items-center text-base mt-2">
                            <span className="text-muted-foreground font-medium flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                            <span className="font-bold text-lg text-success">{request.budget ? `$${request.budget}` : 'No budget set'}</span>
                          </div>
                          <div className="h-2 bg-muted/20 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${request.progress || 0}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/10"><FileText className="h-8 w-8 text-muted-foreground" /></div>}
                      title="No active projects"
                      description="Start by creating a new website request."
                      action={
                        <Link href="/dashboard/requests/new">
                          <Button size="lg" className="mt-4 bg-primary text-white font-semibold flex items-center gap-2 rounded-lg shadow-md hover:bg-accent/90">
                            <Plus className="h-5 w-5" />
                            New Request
                          </Button>
                        </Link>
                      }
                    />
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-text tracking-tight">
                <MessageSquare className="h-7 w-7 text-warning/80" />
                Recent Messages
              </h2>
              <Card className="shadow-xl rounded-2xl transition-transform hover:scale-[1.01] hover:shadow-2xl bg-surface/90 dark:bg-[#181A20] border border-border">
                <CardContent className="p-8">
                  {isLoading ? (
                    <div className="space-y-6">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-1/5" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : recentMessages && recentMessages.length > 0 ? (
                    <div>
                      {recentMessages.map((message, i) => (
                        <div key={i} className="border-b border-border last:border-0 py-3 first:pt-0 last:pb-0 flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-warning" />
                          Message {i + 1}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/10"><MessageSquare className="h-8 w-8 text-muted-foreground" /></div>}
                      title="No messages yet"
                      description="Messages from your team will appear here."
                      action={
                        <Button variant="outline" size="lg" className="mt-4 flex items-center gap-2 rounded-lg shadow-md hover:bg-primary/90">
                          <MessageSquare className="h-5 w-5" />
                          Go to Messages
                        </Button>
                      }
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Reusable Stats Card Component
function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  isLoading, 
  prefix = "",
  action = null
}: {
  title: string;
  value: number | null;
  icon: React.ReactNode;
  trend: { value: string; label: string; isPositive: boolean };
  isLoading: boolean;
  prefix?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : value !== null ? (
              <p className="text-3xl font-bold">{prefix}{value}</p>
            ) : (
              <p className="text-3xl font-bold text-muted-foreground/40">--</p>
            )}
          </div>
          <div className="p-2 rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
        
        {trend && !isLoading && (
          <div className="mt-4 flex items-center text-xs">
            <span className={`flex items-center ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
              <ArrowUpRight className={`h-3 w-3 mr-1 ${!trend.isPositive && "rotate-180"}`} />
              {trend.value}
            </span>
            <span className="text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Reusable Empty State Component
function EmptyState({ icon, title, description, action = null }: { icon: React.ReactNode, title: string, description: string, action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8">
      <div className="rounded-full bg-muted/20 p-6 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-md">{description}</p>
      {action}
    </div>
  );
}

function StatusBadge({ status, className }: { status: string, className?: string }) {
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

  const { label, icon, className: statusClassName } = getStatusDetails();

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${statusClassName} ${className}`}>
      {icon}
      {label}
    </Badge>
  );
}