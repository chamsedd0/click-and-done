"use client";

import { useState, useEffect } from "react";
import { 
  Button, 
  Badge,
  toast,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui";
import { useAuthStore } from "@/lib/store/authStore";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/services/notifications";
import { Bell, Check, Loader2 } from "lucide-react";
import Link from "next/link";

export function NotificationDropdown() {
  const { user } = useAuthStore();
  const { 
    notifications, 
    unreadCount, 
    setNotifications, 
    setUnreadCount, 
    markAsRead, 
    markAllAsRead,
    isLoading,
    setLoading
  } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        const userNotifications = await getUserNotifications(user.uid);
        setNotifications(userNotifications);
        
        // Count unread notifications
        const unreadCount = userNotifications.filter(n => !n.read).length;
        setUnreadCount(unreadCount);
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadNotifications();
    }
  }, [user, setNotifications, setUnreadCount, setLoading]);
  
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      markAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await markAllNotificationsAsRead(user.uid);
      markAllAsRead();
      
      toast({
        title: "All notifications marked as read",
        description: "Your notifications have been cleared.",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      
      toast({
        title: "Error",
        description: "Failed to mark notifications as read.",
        variant: "destructive",
      });
    }
  };
  
  const formatNotificationDate = (timestamp: number) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffMs = now.getTime() - notificationDate.getTime();
    
    // Less than a minute
    if (diffMs < 60 * 1000) {
      return "Just now";
    }
    
    // Less than an hour
    if (diffMs < 60 * 60 * 1000) {
      const minutes = Math.floor(diffMs / (60 * 1000));
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }
    
    // Less than a day
    if (diffMs < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diffMs / (60 * 60 * 1000));
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }
    
    // Less than a week
    if (diffMs < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }
    
    // More than a week
    return notificationDate.toLocaleDateString();
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 w-10 p-0 hover:bg-accent/50 rounded-md cursor-pointer"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </div>
      <DropdownMenuContent className="w-80 z-[100] shadow-lg" align="end" sideOffset={5}>
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={handleMarkAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="py-6 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-10 w-10 mx-auto mb-3 text-muted-foreground/60" />
            <p className="text-muted-foreground font-medium">No notifications</p>
            <p className="text-xs text-muted-foreground/70 mt-1">You'll see notifications here when there are updates on your requests</p>
          </div>
        ) : (
          <DropdownMenuGroup className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`cursor-pointer p-0 focus:bg-transparent ${notification.read ? "opacity-80" : ""}`}
              >
                <div 
                  className="py-3 px-3 w-full hover:bg-accent/80 transition-colors rounded-md"
                  onClick={() => {
                    if (!notification.read) {
                      handleMarkAsRead(notification.id);
                    }
                    setIsOpen(false);
                    if (notification.link) {
                      window.location.href = notification.link;
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    {!notification.read && (
                      <div className="min-w-[8px] min-h-[8px] bg-primary rounded-full mt-1.5"></div>
                    )}
                    <div className={!notification.read ? "flex-1" : "ml-4 flex-1"}>
                      <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"}`}>
                        {notification.title}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {notification.body}
                      </p>
                      <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                        <span>{formatNotificationDate(notification.createdAt)}</span>
                        {notification.link && (
                          <span className="text-primary hover:underline text-xs">
                            {notification.link.includes('/requests/') ? 'View Request' : 'View'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer py-2 justify-center focus:bg-transparent">
          <Link href="/notifications" className="text-center w-full hover:text-primary transition-colors font-medium">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 