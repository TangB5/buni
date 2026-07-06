import * as React from 'react';
import { cn } from '@/lib/cn';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'elevated' | 'flat' }>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div ref={ref} className={cn(
      'rounded-avs-xl bg-avs-secondary',
      variant === 'default'  && 'border border-avs-accent/8 shadow-avs',
      variant === 'elevated' && 'border border-avs-accent/10 shadow-avs-md',
      variant === 'flat'     && 'border border-avs-accent/6',
      className
    )} {...props} />
  )
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between border-b border-avs-accent/8 px-5 py-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-5', className)} {...props} />
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center border-t border-avs-accent/8 px-5 py-4', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';
