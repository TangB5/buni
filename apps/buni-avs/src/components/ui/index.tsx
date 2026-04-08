// =============================================================================
// AVS — Composants UI atomiques (Radix + CVA)
// src/components/ui/index.tsx
// =============================================================================

'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export const cn = (...i: Parameters<typeof clsx>) => twMerge(clsx(...i));

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-avs',
    'font-semibold text-sm select-none',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-primary focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:translate-y-px',
  ],
  {
    variants: {
      variant: {
        primary:   'bg-avs-primary text-avs-secondary shadow-avs hover:-translate-y-0.5 hover:shadow-avs-md',
        secondary: 'border-2 border-avs-accent/20 text-avs-accent hover:border-avs-primary hover:text-avs-primary',
        ghost:     'text-avs-primary hover:bg-avs-primary/10',
        outline:   'border-2 border-avs-primary text-avs-primary hover:bg-avs-primary hover:text-avs-secondary',
        danger:    'bg-red-600 text-white shadow-avs hover:-translate-y-0.5',
        kente:     'bg-avs-kente text-avs-accent shadow-avs hover:-translate-y-0.5',
        link:      'text-avs-primary underline-offset-4 hover:underline h-auto p-0',
      },
      size: {
        xs:   'h-7  px-3 text-xs',
        sm:   'h-8  px-3.5 text-sm',
        md:   'h-10 px-5 text-sm',
        lg:   'h-12 px-7 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?:    boolean;
  isLoading?:  boolean;
  leftIcon?:   React.ReactNode;
  rightIcon?:  React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        disabled={disabled ?? isLoading}
        aria-busy={isLoading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading && <Loader2 size={14} className="animate-spin" aria-hidden />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

// ─────────────────────────────────────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?:     string;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, ...props }, ref) => (
    <div className="relative">
      {leftIcon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-avs-accent/40">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'avs-input',
          leftIcon  && 'pl-10',
          rightIcon && 'pr-10',
          error     && 'avs-input-error',
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {rightIcon && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-avs-accent/40">
          {rightIcon}
        </span>
      )}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
);
Input.displayName = 'Input';

// ─────────────────────────────────────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────────────────────────────────────
const badgeVariants = cva(
  'inline-flex items-center rounded-avs text-[10px] font-bold uppercase tracking-widest',
  {
    variants: {
      variant: {
        primary:   'bg-avs-primary/12 text-avs-primary',
        secondary: 'bg-avs-accent/10 text-avs-accent',
        kente:     'bg-avs-kente/15 text-avs-kente',
        ndop:      'bg-avs-ndop/15 text-avs-ndop',
        success:   'bg-green-100 text-green-700',
        warning:   'bg-amber-100 text-amber-700',
        danger:    'bg-red-100 text-red-600',
      },
      size: {
        sm: 'px-2 py-0.5',
        md: 'px-2.5 py-1',
      },
    },
    defaultVariants: { variant: 'primary', size: 'sm' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// SPINNER
// ─────────────────────────────────────────────────────────────────────────────
interface SpinnerProps { size?: number; className?: string; label?: string; }

export function Spinner({ size = 20, className, label = 'Chargement…' }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn('inline-flex', className)}>
      <Loader2 size={size} className="animate-spin text-avs-primary" aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────────────────────────
const cardVariants = cva('rounded-avs-lg border border-avs-accent/10 bg-avs-secondary', {
  variants: {
    variant: {
      default:  'shadow-avs',
      elevated: 'shadow-avs-md',
      outlined: 'border-2 border-avs-accent/20 shadow-none',
      ghost:    'border-none shadow-none bg-transparent',
    },
    padding: {
      none: 'p-0',
      sm:   'p-4',
      md:   'p-6',
      lg:   'p-8',
    },
  },
  defaultVariants: { variant: 'default', padding: 'md' },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, padding }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-b border-avs-accent/8 pb-4 mb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-display font-bold text-avs-accent', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// LABEL
// ─────────────────────────────────────────────────────────────────────────────
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label className={cn('avs-label', className)} {...props}>
      {children}
      {required && <span className="ml-1 text-avs-primary" aria-label="Requis">*</span>}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEPARATOR
// ─────────────────────────────────────────────────────────────────────────────
interface SeparatorProps { className?: string; label?: string; }

export function Separator({ className, label }: SeparatorProps) {
  if (label) {
    return (
      <div className={cn('relative flex items-center gap-3', className)}>
        <div className="h-px flex-1 bg-avs-accent/10" />
        <span className="text-xs text-avs-accent/40">{label}</span>
        <div className="h-px flex-1 bg-avs-accent/10" />
      </div>
    );
  }
  return <div className={cn('avs-divider', className)} role="separator" aria-hidden />;
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn('animate-avs-pulse rounded-avs bg-avs-accent/8', className)}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
export { buttonVariants, badgeVariants, cardVariants };