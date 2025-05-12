"use client"

import * as React from "react"

// This file is now just a re-export of our simplified toast implementation
// to maintain compatibility with any code that might be importing from this file

export { 
  useToast, 
  toast, 
  ToastProvider, 
  type Toast as ToastProps 
} from "./simple-toast"

// Export these types for compatibility
export type ToastActionElement = React.ReactElement<{
  className?: string;
  altText?: string;
  onClick?: () => void;
}>; 