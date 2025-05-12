"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Feedback } from "@/lib/types/database";
import { addFeedback } from "@/lib/services/feedback";
import { Loader2, Send } from "lucide-react";

interface FeedbackListProps {
  feedback: Feedback[];
  requestId: string;
  onFeedbackAdded: (feedback: Feedback) => void;
}

export function FeedbackList({ feedback, requestId, onFeedbackAdded }: FeedbackListProps) {
  const { user } = useAuthStore();
  const [newFeedback, setNewFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newFeedback.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get user ID safely
      const userId = user.uid || user.id || "";
      
      const createdFeedback = await addFeedback({
        requestId,
        userId: userId,
        userDisplayName: user.displayName || "User",
        content: newFeedback.trim(),
      });
      
      onFeedbackAdded(createdFeedback);
      setNewFeedback("");
    } catch (error) {
      console.error("Error adding feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };
  
  return (
    <div className="space-y-6">
      {feedback.length > 0 ? (
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="bg-muted/20 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <p className="font-medium">{item.userDisplayName}</p>
                <p className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</p>
              </div>
              <p className="text-sm whitespace-pre-wrap">{item.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No feedback yet. Be the first to add feedback!</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <Textarea
          placeholder="Add your feedback here..."
          value={newFeedback}
          onChange={(e) => setNewFeedback(e.target.value)}
          className="min-h-[100px]"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !newFeedback.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 