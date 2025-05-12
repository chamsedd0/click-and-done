"use client"

import * as React from "react"
import { createPortal } from "react-dom"
// Create simplified dropdown-menu components
// import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

// Simplified dropdown implementations using React state and portals
type DropdownMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType>({
  open: false,
  setOpen: () => {},
  triggerRef: React.createRef<HTMLElement | null>(),
});

const DropdownMenu = ({ 
  children, 
  open, 
  onOpenChange 
}: { 
  children: React.ReactNode; 
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
}) => {
  const [internalOpen, setInternalOpen] = React.useState(open || false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  }, [onOpenChange]);
  
  // Update internal state when controlled prop changes
  React.useEffect(() => {
    if (open !== undefined && open !== internalOpen) {
      setInternalOpen(open);
    }
  }, [open, internalOpen]);

  // Get the first child (trigger) and second child (content)
  const childrenArray = React.Children.toArray(children);
  const triggerElement = childrenArray[0];
  const contentElement = childrenArray[1];

  // Set up a ref for the trigger element without using cloneElement
  const triggerCallbackRef = React.useCallback((node: HTMLElement | null) => {
    if (node) triggerRef.current = node;
  }, []);

  // Just render the elements directly - we'll use DOM positioning instead
  return (
    <DropdownMenuContext.Provider 
      value={{ open: internalOpen, setOpen: handleOpenChange, triggerRef }}
    >
      <span ref={triggerCallbackRef as any}>{triggerElement}</span>
      {contentElement}
    </DropdownMenuContext.Provider>
  );
};

// Content component
const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    align?: "start" | "center" | "end";
    sideOffset?: number;
  }
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const { open, triggerRef } = React.useContext(DropdownMenuContext);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  
  // Calculate position relative to the trigger when elements are in the DOM
  React.useLayoutEffect(() => {
    if (!open) return;
    
    const updatePosition = () => {
      if (triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        
        let top = window.scrollY + triggerRect.bottom + sideOffset;
        let left = window.scrollX + triggerRect.left;
        
        // Adjust horizontal alignment
        if (contentRef.current) {
          const contentWidth = contentRef.current.offsetWidth;
          
          if (align === "center") {
            left = window.scrollX + triggerRect.left + (triggerRect.width / 2) - (contentWidth / 2);
          } else if (align === "end") {
            left = window.scrollX + triggerRect.right - contentWidth;
          }
          
          // Keep dropdown in viewport
          const viewportWidth = window.innerWidth;
          if (left + contentWidth > viewportWidth) {
            left = viewportWidth - contentWidth - 10;
          }
          if (left < 0) left = 10;
        }
        
        setPosition({ top, left });
      }
    };
    
    // Initial position
    updatePosition();
    
    // Create a MutationObserver to watch for content changes
    let observer: MutationObserver | null = null;
    if (contentRef.current) {
      observer = new MutationObserver(updatePosition);
      observer.observe(contentRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      });
    }
    
    // Update position when window resizes
    window.addEventListener('resize', updatePosition);
    
    // Run updatePosition after a short delay to ensure proper rendering
    const timeout = setTimeout(updatePosition, 50);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      if (observer) observer.disconnect();
      clearTimeout(timeout);
    };
  }, [open, triggerRef, align, sideOffset]);
  
  // Early return if not open
  if (!open) return null;
  
  // Use the imported createPortal function
  return createPortal(
    <div
      ref={(node) => {
        // Update refs
        contentRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      role="menu"
      aria-orientation="vertical"
      data-state={open ? "open" : "closed"}
      data-align={align}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        minWidth: triggerRef.current?.offsetWidth || 'auto',
      }}
      {...props}
    />,
    document.body
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

// Helper components with minimal implementation
const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    role="menuitem"
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

// Group component 
const DropdownMenuGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    className={cn("flex flex-col gap-0.5", className)}
    {...props}
  />
));
DropdownMenuGroup.displayName = "DropdownMenuGroup";

// Label component
const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

// Separator component
const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    role="separator"
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// Simple shortcut component
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// Basic implementation, would need full implementation for full functionality
const DropdownMenuCheckboxItem = DropdownMenuItem;
const DropdownMenuRadioItem = DropdownMenuItem;
const DropdownMenuRadioGroup = DropdownMenuGroup;
const DropdownMenuSubTrigger = DropdownMenuItem;
const DropdownMenuSubContent = DropdownMenuContent;
const DropdownMenuSub = DropdownMenu;
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const DropdownMenuItemIndicator = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Add the DropdownMenuTrigger component
const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild, children, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(prev => !prev);
    props.onClick?.(e);
  };
  
  // If asChild is true, we clone the children and add our props
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      ...props,
      onClick: handleClick,
      ref: ref as any,
      "aria-haspopup": true,
      "aria-expanded": false,
    });
  }
  
  return (
    <button
      type="button"
      ref={ref}
      className={cn(className)}
      onClick={handleClick}
      aria-haspopup="true"
      aria-expanded="false"
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// Create a file with the exports to maintain compatibility
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuItemIndicator,
} 