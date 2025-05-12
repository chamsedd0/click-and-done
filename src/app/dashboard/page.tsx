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
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserRequests } from "@/lib/services/requests";
import { Badge } from "@/components/ui/badge";


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
    <div className="space-y-8 container mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background border p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.displayName || 'User'}</h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your website projects today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Compass className="mr-2 h-4 w-4" />
              Tour Dashboard
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Requests"
          icon={<FileText className="h-5 w-5 text-blue-500" />}
          value={stats.activeRequests}
          isLoading={isLoading}
          trend={{
            value: "+14%",
            label: "from last month",
            isPositive: true
          }}
        />
        
        <StatsCard
          title="Completed Projects"
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          value={stats.completedProjects}
          isLoading={isLoading}
          trend={{
            value: "+5",
            label: "this month",
            isPositive: true
          }}
        />
        
        <StatsCard
          title="New Messages"
          icon={<MessageSquare className="h-5 w-5 text-amber-500" />}
          value={stats.newMessages}
          isLoading={isLoading}
          trend={{
            value: "-3",
            label: "from yesterday",
            isPositive: false
          }}
        />
        
        <StatsCard
          title="Total Spent"
          icon={<BarChart3 className="h-5 w-5 text-purple-500" />}
          value={stats.totalSpent}
          isLoading={isLoading}
          prefix="$"
          trend={{
            value: "+12%",
            label: "from last month",
            isPositive: true
          }}
        />
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <h2 className="text-xl font-semibold mt-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activity && activity.length > 0 ? (
                <div className="space-y-4">
                  {activity.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start border-b pb-4 last:border-0 last:pb-0">
                      Activity item {i + 1}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Clock className="h-12 w-12 text-muted-foreground/30" />}
                  title="No recent activity"
                  description="When you create requests or receive updates, they'll appear here."
                />
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Current Projects</h2>
              <Card>
                <CardContent className="p-6">
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
                    <div className="space-y-4">
                      {recentRequests.map((request) => (
                        <div key={request.id} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{request.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {request.description}
                              </p>
                            </div>
                            <StatusBadge status={request.status} />
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                            <span className="font-medium">
                              {request.budget ? `$${request.budget}` : 'No budget set'}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${request.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<FileText className="h-12 w-12 text-muted-foreground/30" />}
                      title="No active projects"
                      description="Start by creating a new website request."
                      action={
                        <Link href="/dashboard/requests/new">
                          <Button size="sm" className="mt-2">
                            <Plus className="mr-2 h-4 w-4" />
                            New Request
                          </Button>
                        </Link>
                      }
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Messages</h2>
              <Card>
                <CardContent className="p-6">
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
                        <div key={i} className="border-b last:border-0 py-3 first:pt-0 last:pb-0">
                          Message {i + 1}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Inbox className="h-12 w-12 text-muted-foreground/30" />}
                      title="No messages yet"
                      description="Messages from your team will appear here."
                      action={
                        <Button variant="outline" size="sm" className="mt-2">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Go to Messages
                        </Button>
                      }
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center mt-6">
            <h2 className="text-xl font-semibold">Your Requests</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : recentRequests && recentRequests.length > 0 ? (
                <div className="space-y-6">
                  {recentRequests.map((request, i) => (
                    <div key={i} className="space-y-2">
                      Request {i + 1}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<FileText className="h-16 w-16 text-muted-foreground/30" />}
                  title="No requests found"
                  description="You haven't created any website requests yet."
                  action={
                    <Button className="mt-3">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Request
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <div className="flex justify-between items-center mt-6">
            <h2 className="text-xl font-semibold">Your Messages</h2>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/6" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentMessages && recentMessages.length > 0 ? (
                <div className="space-y-6">
                  {recentMessages.map((message, i) => (
                    <div key={i} className="space-y-2">
                      Message {i + 1}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<MessageSquare className="h-16 w-16 text-muted-foreground/30" />}
                  title="Your inbox is empty"
                  description="Messages from your project team will appear here."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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