"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { uploadRequestFile } from "@/lib/services/files";
import { toast } from "sonner";

interface FileUploaderProps {
  requestId: string;
  onUploadComplete: () => void;
}

export function FileUploader({ requestId, onUploadComplete }: FileUploaderProps) {
  const { user } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploading(true);
    
    try {
      // Get user ID and name safely
      const userId = user.uid || user.id || "";
      const displayName = user.displayName || "User";
      
      await uploadRequestFile(
        requestId,
        file,
        userId,
        displayName
      );
      
      toast.success("File uploaded successfully");
      onUploadComplete();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
      />
      <Button 
        onClick={handleClick} 
        disabled={isUploading || !user}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </>
        )}
      </Button>
    </>
  );
} 