'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';


const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-avs font-semibold select-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px whitespace-nowrap',
  {
    variants: {
      variant: {
        primary:   'bg-avs-primary text-avs-secondary shadow-avs hover:-translate-y-0.5 hover:shadow-avs-md',
        secondary: 'border-2 border-avs-accent/20 text-avs-accent hover:border-avs-primary hover:text-avs-primary',
        ghost:     'text-avs-primary hover:bg-avs-primary/10',
        outline:   'border-2 border-avs-primary text-avs-primary hover:bg-avs-primary hover:text-avs-secondary',
        danger:    'bg-red-600 text-white shadow-avs hover:-translate-y-0.5 hover:bg-red-700',
        kente:     'bg-avs-kente text-avs-accent shadow-avs hover:-translate-y-0.5',
        link:      'text-avs-primary underline-offset-4 hover:underline h-auto p-0 font-normal',
        muted:     'bg-avs-accent/8 text-avs-accent/60 hover:bg-avs-accent/12 hover:text-avs-accent',
      },
      size: {
        xs:   'h-7  px-3   text-xs',
        sm:   'h-8  px-3.5 text-sm',
        md:   'h-10 px-5   text-sm',
        lg:   'h-12 px-7   text-base',
        xl:   'h-14 px-9   text-lg',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?:   boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, isLoading, loadingText, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp ref={ref} disabled={disabled ?? isLoading} aria-busy={isLoading}
        className={cn(buttonVariants({ variant, size }), className)} {...props}>
        {isLoading ? (
          <><Loader2 size={14} className="animate-spin" aria-hidden />{loadingText ?? children}</>
        ) : (
          <>{leftIcon}{children}{rightIcon}</>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';
export { buttonVariants };
