"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { getAllRequests, assignAdminToRequest, updateRequestStatus } from "@/lib/services/admin";
import { WebsiteRequest } from "@/lib/types/database";
import { Loader2, CheckCircle, Clock, FileText, X, RefreshCw, Search, FilterX, User, UserCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/authStore";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<WebsiteRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<WebsiteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WebsiteRequest | null>(null);
  
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const allRequests = await getAllRequests();
        setRequests(allRequests);
        setFilteredRequests(allRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to load website requests. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequests();
  }, [user]);
  
  useEffect(() => {
    // Apply filters, search, and sorting
    let result = [...requests];
    
    // Apply status filter
    if (filter !== "all") {
      result = result.filter(request => request.status === filter);
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        request =>
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query) ||
          request.userId.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return b.updatedAt - a.updatedAt;
      } else if (sortBy === "oldest") {
        return a.updatedAt - b.updatedAt;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "progress") {
        return b.progress - a.progress;
      }
      return 0;
    });
    
    setFilteredRequests(result);
  }, [requests, filter, searchQuery, sortBy]);
  
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
            <RefreshCw className="h-3 w-3" />
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
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const clearFilters = () => {
    setFilter("all");
    setSearchQuery("");
    setSortBy("newest");
  };
  
  const handleSelfAssign = async (requestId: string) => {
    if (!user) return;
    
    setIsAssigning(true);
    
    try {
      await assignAdminToRequest(requestId, user.uid);
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === requestId 
          ? { ...req, assignedAdminId: user.uid } 
          : req
      ));
      
      toast.success("You have been assigned to this request.");
    } catch (error) {
      console.error("Error assigning admin:", error);
      toast.error("Failed to assign admin. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };
  
  const handleStatusChange = async (requestId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    
    try {
      // Calculate progress based on status
      let progress = 0;
      switch (newStatus) {
        case "submitted":
          progress = 20;
          break;
        case "in_progress":
          progress = 50;
          break;
        case "review":
          progress = 80;
          break;
        case "completed":
          progress = 100;
          break;
        default:
          progress = 0;
      }

      await updateRequestStatus(requestId, newStatus, progress);
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === requestId 
          ? { ...req, status: newStatus, progress } 
          : req
      ));
      
      toast.success(`Request status has been updated to ${newStatus}.`);
      
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  return (
    <AdminRoute>
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-8">
        <div className="w-full max-w-5xl space-y-8 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage all website requests and assign admins
              </p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="w-full max-w-3xl mx-auto">
              {/* Filters */}
              <Card className="shadow-lg rounded-xl">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger>
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
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
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
                  
                  {(filter !== "all" || searchQuery.trim() || sortBy !== "newest") && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground"
                      >
                        <FilterX className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="w-full max-w-3xl mx-auto">
              {/* Request list */}
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredRequests.length === 0 ? (
                <Card className="shadow-lg rounded-xl">
                  <CardContent className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="rounded-full bg-muted p-8">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-semibold">No requests found</h3>
                    <p className="text-muted-foreground text-center max-w-md text-lg">
                      {requests.length === 0
                        ? "There are no website requests in the system."
                        : "No requests match your current filters. Try adjusting your search or filter criteria."}
                    </p>
                    {requests.length > 0 && (
                      <Button variant="outline" onClick={clearFilters}>
                        <FilterX className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg rounded-xl">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Assigned Admin</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">
                                <Link 
                                  href={`/admin/requests/${request.id}`}
                                  className="hover:underline"
                                >
                                  {request.title}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <div className="cursor-pointer">
                                      {getStatusBadge(request.status)}
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Update Status</DialogTitle>
                                      <DialogDescription>
                                        Change the status of "{request.title}"
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-2 gap-2">
                                        <Button
                                          variant={request.status === "submitted" ? "default" : "outline"}
                                          onClick={() => handleStatusChange(request.id, "submitted")}
                                          disabled={isUpdatingStatus}
                                        >
                                          <FileText className="h-4 w-4 mr-2" />
                                          Submitted
                                        </Button>
                                        <Button
                                          variant={request.status === "in_progress" ? "default" : "outline"}
                                          onClick={() => handleStatusChange(request.id, "in_progress")}
                                          disabled={isUpdatingStatus}
                                        >
                                          <RefreshCw className="h-4 w-4 mr-2" />
                                          In Progress
                                        </Button>
                                        <Button
                                          variant={request.status === "review" ? "default" : "outline"}
                                          onClick={() => handleStatusChange(request.id, "review")}
                                          disabled={isUpdatingStatus}
                                        >
                                          <FileText className="h-4 w-4 mr-2" />
                                          Review
                                        </Button>
                                        <Button
                                          variant={request.status === "completed" ? "default" : "outline"}
                                          onClick={() => handleStatusChange(request.id, "completed")}
                                          disabled={isUpdatingStatus}
                                          className={request.status === "completed" ? "bg-green-600" : ""}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Completed
                                        </Button>
                                        <Button
                                          variant={request.status === "cancelled" ? "destructive" : "outline"}
                                          onClick={() => handleStatusChange(request.id, "cancelled")}
                                          disabled={isUpdatingStatus}
                                          className="col-span-2"
                                        >
                                          <X className="h-4 w-4 mr-2" />
                                          Cancelled
                                        </Button>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      {isUpdatingStatus && (
                                        <div className="flex items-center text-muted-foreground">
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Updating...
                                        </div>
                                      )}
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>
                                      {request.userId.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs truncate max-w-[120px]">
                                    {request.userId}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {request.assignedAdminId ? (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback>
                                        {request.assignedAdminId.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs truncate max-w-[120px]">
                                      {user?.uid === request.assignedAdminId ? "You" : request.assignedAdminId}
                                    </span>
                                  </div>
                                ) : (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleSelfAssign(request.id)}
                                    disabled={isAssigning}
                                  >
                                    {isAssigning ? (
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    ) : (
                                      <UserCheck className="h-3 w-3 mr-1" />
                                    )}
                                    Assign Self
                                  </Button>
                                )}
                              </TableCell>
                              <TableCell>{formatDate(request.updatedAt)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                      className="bg-primary h-2 rounded-full" 
                                      style={{ width: `${request.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs">{request.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/admin/requests/${request.id}`}>
                                    View/Edit
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 