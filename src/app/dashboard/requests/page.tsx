"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  Filter, 
  FilterX, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  RefreshCw,
  ArrowUpDown,
  Eye,
  Calendar,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/authStore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserRequests } from "@/lib/services/requests";
import { WebsiteRequest } from "@/lib/types/database";

export default function RequestsPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<WebsiteRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<WebsiteRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getUserRequests(user.uid)
      .then((data) => {
        setRequests(data);
        setFilteredRequests(data);
      })
      .catch((err) => {
        setRequests([]);
        setFilteredRequests([]);
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  const applyFilters = () => {
    let filtered = [...requests];
    if (searchQuery.trim()) {
      filtered = filtered.filter((req) =>
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.description && req.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }
    if (sortBy === "newest") {
      filtered = filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === "oldest") {
      filtered = filtered.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sortBy === "progress") {
      filtered = filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    }
    setFilteredRequests(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
  };

  // Re-apply filters when dependencies change
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, sortBy, requests]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("newest");
  };

  return (
    <div className="space-y-6 container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
        <div>
          <h1 className="text-4xl font-extrabold mb-6 text-text flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary/90" />
            My Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your website requests
          </p>
        </div>
        
        <Link href="/dashboard/requests/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-r from-[#60a5fa] via-[#6366f1] to-[#a78bfa] text-white mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Filter Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-9 border-border/60 focus:border-primary"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="border-border/60">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="border-border/60">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(statusFilter !== "all" || searchQuery.trim() || sortBy !== "newest") && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <FilterX className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="mt-2">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground mr-1">
            {isLoading ? (
              <Skeleton className="h-4 w-32 inline-block" />
            ) : (
              `${filteredRequests.length} request${filteredRequests.length !== 1 ? 's' : ''}`
            )}
          </div>
        </div>

        {/* Grid View Content */}
        <TabsContent value="grid" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden bg-surface/80 dark:bg-[#181A20]/80 shadow-xl rounded-2xl border border-border group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-5/6 mt-2" />
                    <Skeleton className="h-4 w-full mt-1" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-8" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden bg-surface/80 dark:bg-[#181A20]/80 shadow-xl rounded-2xl border border-border group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-accent" />
                        <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors line-clamp-1">{request.title}</h3>
                      </div>
                      <StatusBadge status={request.status} className="text-base px-4 py-1 rounded-full font-semibold shadow-md" />
                    </div>
                    <p className="text-base text-muted-foreground line-clamp-2 mt-1">{request.description}</p>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-lg text-success">{request.budget ? `$${request.budget}` : 'No budget set'}</span>
                    </div>
                    <div className="h-2 bg-muted/20 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-gradient-to-r from-primary via-accent to-success transition-all duration-300" style={{ width: `${request.progress || 0}%` }} />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-border">
                    <Link href={`/dashboard/requests/${request.id}`} className="w-full">
                      <Button variant="outline" className="w-full rounded-lg font-semibold group-hover:bg-primary/10 transition-colors">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/10 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold">No requests found</h3>
              <p className="text-muted-foreground mt-2 max-w-md mb-6">
                {requests.length === 0
                  ? "You haven't created any website requests yet. Get started by creating a new request."
                  : "No requests match your current filters. Try adjusting your search or filter criteria."}
              </p>
              
              {requests.length === 0 ? (
                <Link href="/dashboard/requests/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Request
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={clearFilters}>
                  <FilterX className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        {/* List View Content */}
        <TabsContent value="list" className="mt-6">
          <Card className="bg-surface/90 dark:bg-[#181A20] shadow-xl rounded-2xl border border-border group">
            {isLoading ? (
              <div className="divide-y">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="md:w-32 flex justify-end">
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredRequests.length > 0 ? (
              <div className="divide-y">
                {filteredRequests.map((request, index) => (
                  <div key={index} className="p-4 flex flex-col md:flex-row md:items-center gap-4 bg-surface/80 dark:bg-[#181A20]/80 shadow-xl rounded-2xl border border-border group mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1 items-center">
                        <div className="flex items-center gap-2">
                          <FileText className="h-6 w-6 text-accent" />
                          <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{request.title}</h3>
                        </div>
                        <StatusBadge status={request.status} className="text-base px-4 py-1 rounded-full font-semibold shadow-md" />
                      </div>
                      <p className="text-base text-muted-foreground line-clamp-1 mt-1">{request.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm mt-2">
                        <span className="text-muted-foreground font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-bold text-lg text-success">{request.budget ? `$${request.budget}` : 'No budget set'}</span>
                        <span className="text-muted-foreground">Progress: {request.progress || 0}%</span>
                      </div>
                      <div className="h-2 bg-muted/20 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-gradient-to-r from-primary via-accent to-success transition-all duration-300" style={{ width: `${request.progress || 0}%` }} />
                      </div>
                    </div>
                    <div className="md:w-32 flex justify-end items-center">
                      <Link href={`/dashboard/requests/${request.id}`}>
                        <Button variant="outline" size="sm" className="rounded-lg font-semibold group-hover:bg-primary/10 transition-colors">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/10 mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold">No requests found</h3>
                <p className="text-muted-foreground mt-2 max-w-md mb-6">
                  {requests.length === 0
                    ? "You haven't created any website requests yet. Get started by creating a new request."
                    : "No requests match your current filters. Try adjusting your search or filter criteria."}
                </p>
                
                {requests.length === 0 ? (
                  <Link href="/dashboard/requests/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Request
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" onClick={clearFilters}>
                    <FilterX className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Status Badge Component for Requests
function StatusBadge({ status, className = "" }: { status: string, className?: string }) {
  const getStatusDetails = () => {
    switch (status) {
      case "draft":
        return { label: "Draft", icon: <Clock className="h-3 w-3" />, className: "border-muted-foreground/30 text-muted-foreground" };
      case "submitted":
        return { label: "Submitted", icon: <FileText className="h-3 w-3" />, className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" };
      case "in_progress":
        return { label: "In Progress", icon: <RefreshCw className="h-3 w-3" />, className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" };
      case "review":
        return { label: "Review", icon: <Eye className="h-3 w-3" />, className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" };
      case "completed":
        return { label: "Completed", icon: <CheckCircle2 className="h-3 w-3" />, className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" };
      case "cancelled":
        return { label: "Cancelled", icon: <FilterX className="h-3 w-3" />, className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" };
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