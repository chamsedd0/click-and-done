"use client";

import React from "react";
import { useState } from "react";
import { 
  Button, 
  toast,
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui";
import { 
  Download, 
  File, 
  FileImage, 
  FileText, 
  FileSpreadsheet, 
  FileCode,
  Trash2,
  Eye,
  FileX
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { FileMetadata, deleteFile } from "@/lib/services/files";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileIcon } from "lucide-react";
import { FileMetadata as DatabaseFileMetadata } from "@/lib/types/database";

interface FileListProps {
  files: FileMetadata[];
  onFileDeleted?: (fileId: string) => void;
}

export function FileList({ files, onFileDeleted }: FileListProps) {
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileIcon className="h-4 w-4" />;
    } else if (fileType.includes('pdf')) {
      return <FileIcon className="h-4 w-4 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileIcon className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <FileIcon className="h-4 w-4 text-green-500" />;
    } else {
      return <FileIcon className="h-4 w-4" />;
    }
  };
  
  const handleDeleteFile = async (fileId: string) => {
    if (!user) return;
    
    setIsDeleting(fileId);
    
    try {
      await deleteFile(fileId);
      
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully",
      });
      
      if (onFileDeleted) {
        onFileDeleted(fileId);
      }
    } catch (error: any) {
      console.error("Error deleting file:", error);
      
      toast({
        title: "Error deleting file",
        description: error.message || "An error occurred while deleting the file",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Preview component for images
  const ImagePreview = ({ url, filename }: { url: string, filename: string }) => {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setPreviewImage(null)}>
        <div className="max-w-4xl max-h-screen p-4 overflow-auto">
          <img 
            src={url} 
            alt={filename} 
            className="max-w-full max-h-full object-contain"
          />
          <p className="text-white text-center mt-2">{filename}</p>
        </div>
      </div>
    );
  };
  
  const [previewImage, setPreviewImage] = useState<FileMetadata | null>(null);
  
  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <FileX className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No files uploaded</h3>
        <p className="text-muted-foreground">
          Upload files related to this request using the button above.
        </p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.id}>
            <TableCell className="font-medium flex items-center gap-2">
              {getFileTypeIcon(file.fileType)}
              {file.fileName}
            </TableCell>
            <TableCell>{file.fileType.split('/')[1]?.toUpperCase() || file.fileType}</TableCell>
            <TableCell>{formatFileSize(file.fileSize)}</TableCell>
            <TableCell>{formatDate(file.createdAt)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <a href={file.downloadURL} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 