"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Send, 
  PlusCircle, 
  PaperclipIcon, 
  X, 
  UserCircle2, 
  CircleUserRound, 
  Loader2,
  Inbox,
  MoreVertical,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messageEndRef = useRef(null);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Normally you would fetch conversations from your API
      setConversations([]);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Scroll to bottom of messages when activeConversation changes
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation]);
  
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // In a real app, you would send the message to your API here
    console.log("Sending message:", message);
    
    // Clear the message input
    setMessage("");
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Communicate with your project team
          </p>
        </div>
        
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1 border">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Conversations</CardTitle>
              <Badge variant="outline" className="font-normal">
                {isLoading ? "--" : conversations.length}
              </Badge>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-border/60"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                {isLoading ? (
                  <div className="space-y-3 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-md">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-3 w-8" />
                      </div>
                    ))}
                  </div>
                ) : conversations.length > 0 ? (
                  <ScrollArea className="h-[400px] mt-3">
                    <div className="space-y-1">
                      {conversations.map((conversation, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 text-left"
                          onClick={() => setActiveConversation(conversation)}
                        >
                          {/* Conversation item would go here */}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-10 mt-3">
                    <div className="rounded-full bg-muted/20 p-5 mb-4">
                      <Inbox className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-lg font-medium">No conversations</h3>
                    <p className="text-muted-foreground mt-1 max-w-xs">
                      Start a new conversation with your project team to discuss your website.
                    </p>
                    <Button className="mt-4">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Conversation
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="unread">
                {isLoading ? (
                  <div className="space-y-3 mt-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-md">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-3 w-8" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-10 mt-3">
                    <div className="rounded-full bg-muted/20 p-5 mb-4">
                      <CircleUserRound className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-lg font-medium">No unread messages</h3>
                    <p className="text-muted-foreground mt-1 max-w-xs">
                      You're all caught up! Check back later for new messages.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      
        {/* Message Thread */}
        <Card className="lg:col-span-2 border flex flex-col overflow-hidden">
          {isLoading ? (
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 border-b pb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              
              <div className="space-y-6 py-6 flex-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    {i % 2 === 0 && <Skeleton className="h-10 w-10 rounded-full" />}
                    <div className={`space-y-1 max-w-[70%] ${i % 2 === 0 ? '' : 'items-end'}`}>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-20 w-full rounded-lg" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    {i % 2 !== 0 && <Skeleton className="h-10 w-10 rounded-full" />}
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            </div>
          ) : activeConversation ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{activeConversation.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {activeConversation.participants} participants
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  {/* Messages would go here */}
                </div>
                <div ref={messageEndRef} />
              </ScrollArea>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[48px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
                      }
                    }}
                  />
                  <Button type="submit" size="icon" disabled={!message.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
                <div className="mt-2 text-xs text-muted-foreground">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="rounded-full bg-muted/20 p-6 mb-4">
                <MessageBubble className="h-16 w-16 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-medium">No conversation selected</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Select a conversation from the list or start a new one to begin messaging.
              </p>
              <Button className="mt-6">
                <PlusCircle className="mr-2 h-4 w-4" />
                Start a New Conversation
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Custom Message Bubble Icon
function MessageBubble(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8" />
      <path d="M8 13h6" />
    </svg>
  );
}