'use client';
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';
 
interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?:       string;
  description?: string;
  indeterminate?: boolean;
}
 
const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, description, indeterminate, id, ...props }, ref) => {
    const checkId = id ?? React.useId();
    return (
      <div className="flex items-start gap-3">
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkId}
          className={cn(
            'peer mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-sm border-2 border-avs-accent/25',
            'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-primary focus-visible:ring-offset-2',
            'hover:border-avs-primary/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[state=checked]:border-avs-primary data-[state=checked]:bg-avs-primary',
            'data-[state=indeterminate]:border-avs-primary data-[state=indeterminate]:bg-avs-primary',
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-avs-secondary">
            {indeterminate ? <Minus size={11} strokeWidth={3} /> : <Check size={11} strokeWidth={3} />}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {(label || description) && (
          <div className="min-w-0">
            {label && <label htmlFor={checkId} className="cursor-pointer text-sm font-medium text-avs-accent leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
            {description && <p className="mt-0.5 text-xs text-avs-accent/50 leading-snug">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
 
export { Checkbox };
