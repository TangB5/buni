'use client';
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../utils';
 
const Dialog      = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal  = DialogPrimitive.Portal;
const DialogClose   = DialogPrimitive.Close;
 
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-avs-accent/60 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
 
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  }
>(({ className, children, size = 'md', ...props }, ref) => {
  const sizes = {
    sm:   'max-w-sm',
    md:   'max-w-lg',
    lg:   'max-w-2xl',
    xl:   'max-w-4xl',
    full: 'max-w-[95vw]',
  };
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
          'rounded-avs-xl border border-avs-accent/10 bg-avs-secondary shadow-avs-lg',
          'focus:outline-none',
          'data-[state=open]:animate-in  data-[state=open]:fade-in-0  data-[state=open]:zoom-in-95  data-[state=open]:slide-in-from-left-1/2  data-[state=open]:slide-in-from-top-[48%]',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 rounded-avs p-1.5 text-avs-accent/40 hover:bg-avs-accent/8 hover:text-avs-accent transition-colors focus:outline-none focus:ring-2 focus:ring-avs-primary">
          <X size={15} aria-hidden />
          <span className="sr-only">Fermer</span>
        </DialogClose>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;
 
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('border-b border-avs-accent/8 px-6 py-5', className)} {...props} />
);
 
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('font-display text-xl font-bold text-avs-accent', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
 
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('mt-1 text-sm text-avs-accent/55 leading-relaxed', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
 
const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 py-5', className)} {...props} />
);
 
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center justify-end gap-3 border-t border-avs-accent/8 px-6 py-4', className)} {...props} />
);
 
export {
  Dialog, DialogTrigger, DialogContent, DialogClose,
  DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter,
};