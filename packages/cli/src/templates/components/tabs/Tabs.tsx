'use client';
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/cn';
 
const Tabs      = TabsPrimitive.Root;
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & { variant?: 'underline' | 'pills' | 'outline' }
>(({ className, variant = 'underline', ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'flex',
      variant === 'underline' && 'border-b border-avs-accent/10 gap-0',
      variant === 'pills'     && 'gap-1.5',
      variant === 'outline'   && 'gap-1 rounded-avs-xl border border-avs-accent/10 bg-avs-accent/3 p-1',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;
 
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { variant?: 'underline' | 'pills' | 'outline' }
>(({ className, variant = 'underline', ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'select-none whitespace-nowrap font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-primary disabled:pointer-events-none disabled:opacity-50',
      variant === 'underline' && [
        'border-b-2 -mb-px px-4 py-2.5',
        'border-transparent text-avs-accent/50 hover:text-avs-accent',
        'data-[state=active]:border-avs-primary data-[state=active]:text-avs-primary',
      ],
      variant === 'pills' && [
        'rounded-avs px-4 py-2 text-avs-accent/55 hover:text-avs-accent hover:bg-avs-accent/6',
        'data-[state=active]:bg-avs-primary data-[state=active]:text-avs-secondary data-[state=active]:shadow-avs',
      ],
      variant === 'outline' && [
        'flex-1 rounded-avs px-4 py-2 text-avs-accent/50 hover:text-avs-accent',
        'data-[state=active]:bg-avs-secondary data-[state=active]:text-avs-accent data-[state=active]:shadow-avs',
      ],
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
 
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('focus-visible:outline-none', className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
 
export { Tabs, TabsList, TabsTrigger, TabsContent };
