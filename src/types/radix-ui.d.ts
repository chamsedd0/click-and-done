import * as React from 'react';

declare module '@radix-ui/react-avatar' {
  export interface AvatarProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode;
  }
  
  export interface AvatarImageProps extends React.ComponentPropsWithoutRef<'img'> {
    children?: React.ReactNode;
  }
  
  export interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode;
  }
  
  export const Root: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLDivElement>>;
  export const Image: React.ForwardRefExoticComponent<AvatarImageProps & React.RefAttributes<HTMLImageElement>>;
  export const Fallback: React.ForwardRefExoticComponent<AvatarFallbackProps & React.RefAttributes<HTMLDivElement>>;
}

declare module '@radix-ui/react-dropdown-menu' {
  interface BaseProps {
    children?: React.ReactNode;
  }
  
  export interface RootProps extends BaseProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    modal?: boolean;
    dir?: 'ltr' | 'rtl';
  }
  
  export interface TriggerProps extends React.ComponentPropsWithoutRef<'button'> {
    asChild?: boolean;
  }
  
  export interface ContentProps extends React.ComponentPropsWithoutRef<'div'> {
    loop?: boolean;
    onEscapeKeyDown?: (event: React.KeyboardEvent) => void;
    onPointerDownOutside?: (event: React.PointerEvent) => void;
    onFocusOutside?: (event: React.FocusEvent) => void;
    onInteractOutside?: (event: React.FocusEvent | React.PointerEvent) => void;
    forceMount?: boolean;
    sideOffset?: number;
    alignOffset?: number;
    avoidCollisions?: boolean;
    collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
    sticky?: 'partial' | 'always';
    hideWhenDetached?: boolean;
    updatePositionStrategy?: 'optimized' | 'always';
    asChild?: boolean;
    align?: 'start' | 'center' | 'end';
  }
  
  export interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    disabled?: boolean;
    onSelect?: (event: Event) => void;
    textValue?: string;
    asChild?: boolean;
    inset?: boolean;
  }
  
  export interface GroupProps extends React.ComponentPropsWithoutRef<'div'> {
    asChild?: boolean;
  }
  
  export interface LabelProps extends React.ComponentPropsWithoutRef<'div'> {
    asChild?: boolean;
    inset?: boolean;
  }
  
  export interface SeparatorProps extends React.ComponentPropsWithoutRef<'div'> {
    asChild?: boolean;
  }
  
  export const Root: React.FC<RootProps>;
  export const Trigger: React.ForwardRefExoticComponent<TriggerProps & React.RefAttributes<HTMLButtonElement>>;
  export const Group: React.ForwardRefExoticComponent<GroupProps & React.RefAttributes<HTMLDivElement>>;
  export const Portal: React.FC<{ children: React.ReactNode; forceMount?: boolean; container?: HTMLElement }>;
  export const Sub: React.FC<RootProps>;
  export const RadioGroup: React.ForwardRefExoticComponent<GroupProps & React.RefAttributes<HTMLDivElement>>;
  export const SubTrigger: React.ForwardRefExoticComponent<ItemProps & React.RefAttributes<HTMLDivElement>>;
  export const SubContent: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<HTMLDivElement>>;
  export const Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<HTMLDivElement>>;
  export const Item: React.ForwardRefExoticComponent<ItemProps & React.RefAttributes<HTMLDivElement>>;
  export const CheckboxItem: React.ForwardRefExoticComponent<ItemProps & { checked?: boolean; onCheckedChange?: (checked: boolean) => void } & React.RefAttributes<HTMLDivElement>>;
  export const RadioItem: React.ForwardRefExoticComponent<ItemProps & { value: string } & React.RefAttributes<HTMLDivElement>>;
  export const Label: React.ForwardRefExoticComponent<LabelProps & React.RefAttributes<HTMLDivElement>>;
  export const Separator: React.ForwardRefExoticComponent<SeparatorProps & React.RefAttributes<HTMLDivElement>>;
  export const ItemIndicator: React.FC<{ children: React.ReactNode; forceMount?: boolean; asChild?: boolean }>;
  export const Shortcut: React.FC<React.HTMLAttributes<HTMLSpanElement>>;
}

declare module '@radix-ui/react-slot' {
  export interface SlotProps {
    children?: React.ReactNode;
    asChild?: boolean;
  }
  export const Slot: React.ForwardRefExoticComponent<SlotProps & React.RefAttributes<HTMLElement>>;
}

declare module '@radix-ui/react-toast' {
  interface ToastProviderProps {
    children: React.ReactNode;
    duration?: number;
    swipeDirection?: 'right' | 'left' | 'up' | 'down';
    swipeThreshold?: number;
    label?: string;
  }
  
  interface ToastProps extends React.ComponentPropsWithoutRef<'div'> {
    forceMount?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    variant?: string;
  }
  
  export const Provider: React.FC<ToastProviderProps>;
  export const Viewport: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<'ol'> & React.RefAttributes<HTMLOListElement>>;
  export const Root: React.ForwardRefExoticComponent<ToastProps & React.RefAttributes<HTMLDivElement>>;
  export const Action: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<'button'> & React.RefAttributes<HTMLButtonElement>>;
  export const Close: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<'button'> & React.RefAttributes<HTMLButtonElement>>;
  export const Title: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<'div'> & React.RefAttributes<HTMLDivElement>>;
  export const Description: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<'div'> & React.RefAttributes<HTMLDivElement>>;
}

declare module '@radix-ui/react-radio-group' {
  export interface RadioGroupProps extends React.ComponentPropsWithoutRef<'div'> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    loop?: boolean;
    disabled?: boolean;
    name?: string;
    required?: boolean;
    orientation?: 'horizontal' | 'vertical';
    dir?: 'ltr' | 'rtl';
  }

  export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<'button'> {
    value: string;
    disabled?: boolean;
    required?: boolean;
  }

  export interface RadioGroupIndicatorProps extends React.ComponentPropsWithoutRef<'span'> {
    forceMount?: boolean;
  }

  export const Root: React.ForwardRefExoticComponent<RadioGroupProps & React.RefAttributes<HTMLDivElement>>;
  export const Item: React.ForwardRefExoticComponent<RadioGroupItemProps & React.RefAttributes<HTMLButtonElement>>;
  export const Indicator: React.ForwardRefExoticComponent<RadioGroupIndicatorProps & React.RefAttributes<HTMLSpanElement>>;
}

declare module '@radix-ui/react-dialog' {
  export interface DialogProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
  }

  export interface DialogTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
    asChild?: boolean;
  }

  export interface DialogPortalProps {
    children?: React.ReactNode;
    container?: HTMLElement;
    forceMount?: boolean;
  }

  export interface DialogOverlayProps extends React.ComponentPropsWithoutRef<'div'> {
    forceMount?: boolean;
    asChild?: boolean;
  }

  export interface DialogContentProps extends React.ComponentPropsWithoutRef<'div'> {
    forceMount?: boolean;
    onEscapeKeyDown?: (event: React.KeyboardEvent) => void;
    onPointerDownOutside?: (event: React.PointerEvent) => void;
    onInteractOutside?: (event: React.PointerEvent) => void;
    asChild?: boolean;
  }

  export interface DialogTitleProps extends React.ComponentPropsWithoutRef<'h2'> {
    asChild?: boolean;
  }

  export interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<'p'> {
    asChild?: boolean;
  }

  export interface DialogCloseProps extends React.ComponentPropsWithoutRef<'button'> {
    asChild?: boolean;
  }

  export const Root: React.FC<DialogProps>;
  export const Trigger: React.ForwardRefExoticComponent<DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
  export const Portal: React.FC<DialogPortalProps>;
  export const Overlay: React.ForwardRefExoticComponent<DialogOverlayProps & React.RefAttributes<HTMLDivElement>>;
  export const Content: React.ForwardRefExoticComponent<DialogContentProps & React.RefAttributes<HTMLDivElement>>;
  export const Title: React.ForwardRefExoticComponent<DialogTitleProps & React.RefAttributes<HTMLHeadingElement>>;
  export const Description: React.ForwardRefExoticComponent<DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
  export const Close: React.ForwardRefExoticComponent<DialogCloseProps & React.RefAttributes<HTMLButtonElement>>;
}

declare module '@radix-ui/react-alert-dialog' {
  export interface AlertDialogProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  }

  export interface AlertDialogTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
    asChild?: boolean;
  }

  export interface AlertDialogPortalProps {
    children?: React.ReactNode;
    container?: HTMLElement;
    forceMount?: boolean;
  }

  export interface AlertDialogOverlayProps extends React.ComponentPropsWithoutRef<'div'> {
    forceMount?: boolean;
    asChild?: boolean;
  }

  export interface AlertDialogContentProps extends React.ComponentPropsWithoutRef<'div'> {
    forceMount?: boolean;
    onEscapeKeyDown?: (event: React.KeyboardEvent) => void;
    asChild?: boolean;
  }

  export interface AlertDialogTitleProps extends React.ComponentPropsWithoutRef<'h2'> {
    asChild?: boolean;
  }

  export interface AlertDialogDescriptionProps extends React.ComponentPropsWithoutRef<'p'> {
    asChild?: boolean;
  }

  export interface AlertDialogActionProps extends React.ComponentPropsWithoutRef<'button'> {
    asChild?: boolean;
  }

  export interface AlertDialogCancelProps extends React.ComponentPropsWithoutRef<'button'> {
    asChild?: boolean;
  }

  export const Root: React.FC<AlertDialogProps>;
  export const Trigger: React.ForwardRefExoticComponent<AlertDialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
  export const Portal: React.FC<AlertDialogPortalProps>;
  export const Overlay: React.ForwardRefExoticComponent<AlertDialogOverlayProps & React.RefAttributes<HTMLDivElement>>;
  export const Content: React.ForwardRefExoticComponent<AlertDialogContentProps & React.RefAttributes<HTMLDivElement>>;
  export const Title: React.ForwardRefExoticComponent<AlertDialogTitleProps & React.RefAttributes<HTMLHeadingElement>>;
  export const Description: React.ForwardRefExoticComponent<AlertDialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
  export const Action: React.ForwardRefExoticComponent<AlertDialogActionProps & React.RefAttributes<HTMLButtonElement>>;
  export const Cancel: React.ForwardRefExoticComponent<AlertDialogCancelProps & React.RefAttributes<HTMLButtonElement>>;
}

declare module '@radix-ui/react-separator' {
  export interface SeparatorProps extends React.ComponentPropsWithoutRef<'div'> {
    decorative?: boolean;
    orientation?: 'horizontal' | 'vertical';
    asChild?: boolean;
  }

  export const Root: React.ForwardRefExoticComponent<SeparatorProps & React.RefAttributes<HTMLDivElement>>;
}

declare module '@radix-ui/react-tabs' {
  export interface TabsProps extends React.ComponentPropsWithoutRef<'div'> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    orientation?: 'horizontal' | 'vertical';
    dir?: 'ltr' | 'rtl';
    activationMode?: 'automatic' | 'manual';
  }

  export interface TabsListProps extends React.ComponentPropsWithoutRef<'div'> {
    loop?: boolean;
    asChild?: boolean;
  }

  export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
    value: string;
    disabled?: boolean;
    asChild?: boolean;
  }

  export interface TabsContentProps extends React.ComponentPropsWithoutRef<'div'> {
    value: string;
    forceMount?: boolean;
    asChild?: boolean;
  }

  export const Root: React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLDivElement>>;
  export const List: React.ForwardRefExoticComponent<TabsListProps & React.RefAttributes<HTMLDivElement>>;
  export const Trigger: React.ForwardRefExoticComponent<TabsTriggerProps & React.RefAttributes<HTMLButtonElement>>;
  export const Content: React.ForwardRefExoticComponent<TabsContentProps & React.RefAttributes<HTMLDivElement>>;
}

declare module '@radix-ui/react-select' {
  import * as React from 'react';
  
  type Direction = 'ltr' | 'rtl';
  type Align = 'start' | 'center' | 'end';
  type Side = 'top' | 'right' | 'bottom' | 'left';

  // Root
  interface RootProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    dir?: Direction;
    name?: string;
    autoComplete?: string;
    disabled?: boolean;
    required?: boolean;
  }
  const Root: React.FC<RootProps>;

  // Trigger
  interface TriggerProps extends React.ComponentPropsWithoutRef<'button'> {}
  const Trigger: React.ForwardRefExoticComponent<TriggerProps & React.RefAttributes<HTMLButtonElement>>;

  // Value
  interface ValueProps extends React.ComponentPropsWithoutRef<'span'> {
    placeholder?: string;
  }
  const Value: React.ForwardRefExoticComponent<ValueProps & React.RefAttributes<HTMLSpanElement>>;

  // Icon
  interface IconProps extends React.ComponentPropsWithoutRef<'span'> {}
  const Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<HTMLSpanElement>>;

  // Portal
  interface PortalProps extends React.ComponentPropsWithoutRef<'div'> {
    container?: HTMLElement;
  }
  const Portal: React.FC<PortalProps>;

  // Content
  interface ContentProps extends React.ComponentPropsWithoutRef<'div'> {
    position?: 'item-aligned' | 'popper';
    side?: Side;
    sideOffset?: number;
    align?: Align;
    alignOffset?: number;
    avoidCollisions?: boolean;
    collisionBoundary?: Element | null | Array<Element | null>;
    collisionPadding?: number | Partial<Record<Side, number>>;
    arrowPadding?: number;
    sticky?: 'partial' | 'always';
    hideWhenDetached?: boolean;
  }
  const Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<HTMLDivElement>>;

  // Viewport
  interface ViewportProps extends React.ComponentPropsWithoutRef<'div'> {}
  const Viewport: React.ForwardRefExoticComponent<ViewportProps & React.RefAttributes<HTMLDivElement>>;

  // Item
  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    value: string;
    disabled?: boolean;
    textValue?: string;
  }
  const Item: React.ForwardRefExoticComponent<ItemProps & React.RefAttributes<HTMLDivElement>>;

  // ItemText
  interface ItemTextProps extends React.ComponentPropsWithoutRef<'span'> {}
  const ItemText: React.ForwardRefExoticComponent<ItemTextProps & React.RefAttributes<HTMLSpanElement>>;

  // ItemIndicator
  interface ItemIndicatorProps extends React.ComponentPropsWithoutRef<'span'> {
    forceMount?: boolean;
  }
  const ItemIndicator: React.ForwardRefExoticComponent<ItemIndicatorProps & React.RefAttributes<HTMLSpanElement>>;

  // Group
  interface GroupProps extends React.ComponentPropsWithoutRef<'div'> {}
  const Group: React.ForwardRefExoticComponent<GroupProps & React.RefAttributes<HTMLDivElement>>;

  // Label
  interface LabelProps extends React.ComponentPropsWithoutRef<'div'> {}
  const Label: React.ForwardRefExoticComponent<LabelProps & React.RefAttributes<HTMLDivElement>>;

  // Separator
  interface SeparatorProps extends React.ComponentPropsWithoutRef<'div'> {}
  const Separator: React.ForwardRefExoticComponent<SeparatorProps & React.RefAttributes<HTMLDivElement>>;

  // ScrollUpButton
  interface ScrollUpButtonProps extends React.ComponentPropsWithoutRef<'div'> {}
  const ScrollUpButton: React.ForwardRefExoticComponent<ScrollUpButtonProps & React.RefAttributes<HTMLDivElement>>;

  // ScrollDownButton
  interface ScrollDownButtonProps extends React.ComponentPropsWithoutRef<'div'> {}
  const ScrollDownButton: React.ForwardRefExoticComponent<ScrollDownButtonProps & React.RefAttributes<HTMLDivElement>>;

  export {
    Root,
    Trigger,
    Value,
    Icon,
    Portal,
    Content,
    Viewport,
    Item,
    ItemText,
    ItemIndicator,
    Group,
    Label,
    Separator,
    ScrollUpButton,
    ScrollDownButton,
  };
} 