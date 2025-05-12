"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

// Simple toast system with React context
export type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
  open: boolean
}

type ToastContextType = {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id" | "open">) => string
  updateToast: (id: string, toast: Partial<Toast>) => void
  dismissToast: (id: string) => void
  dismissAllToasts: () => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id" | "open">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, open: true, ...toast }])
    return id
  }, [])

  const updateToast = React.useCallback((id: string, toast: Partial<Toast>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...toast } : t))
    )
  }, [])

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, open: false } : t))
    )
    // Remove the toast after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  const dismissAllToasts = React.useCallback(() => {
    setToasts((prev) => prev.map((t) => ({ ...t, open: false })))
    // Remove all toasts after animation
    setTimeout(() => {
      setToasts([])
    }, 300)
  }, [])

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        updateToast,
        dismissToast,
        dismissAllToasts,
      }}
    >
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Toast component function
export function toast(props: Omit<Toast, "id" | "open">) {
  if (typeof window === 'undefined') return { id: '', dismiss: () => {}, update: () => {} }
  
  const { addToast, dismissToast, updateToast } = useToast()
  const id = addToast(props)

  return {
    id,
    dismiss: () => dismissToast(id),
    update: (props: Partial<Omit<Toast, "id" | "open">>) =>
      updateToast(id, props),
  }
}

// Toast UI components
function Toaster() {
  const { toasts } = useToast()
  const [isMounted, setIsMounted] = React.useState(false)
  
  React.useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) return null
  
  return createPortal(
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  )
}

function ToastItem({
  id,
  title,
  description,
  action,
  variant = "default",
  open,
}: Toast) {
  const { dismissToast } = useToast()
  
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full mt-4",
        variant === "destructive" 
          ? "destructive border-destructive bg-destructive text-destructive-foreground" 
          : "border bg-background text-foreground"
      )}
      data-state={open ? "open" : "closed"}
    >
      <div className="grid gap-1">
        {title && <h5 className="text-sm font-semibold">{title}</h5>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      
      {action && <div>{action}</div>}
      
      <button
        onClick={() => dismissToast(id)}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
} 