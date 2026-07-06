import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-avs font-bold uppercase tracking-widest transition-colors',
  {
    variants: {
      variant: {
        primary:   'bg-avs-primary/12 text-avs-primary',
        secondary: 'bg-avs-accent/10  text-avs-accent/60',
        kente:     'bg-avs-kente/15   text-avs-kente',
        ndop:      'bg-avs-ndop/15    text-avs-ndop',
        indigo:    'bg-avs-indigo/15  text-avs-indigo',
        success:   'bg-green-100 text-green-700',
        warning:   'bg-amber-100 text-amber-700',
        danger:    'bg-red-100   text-red-600',
        outline:   'border border-current bg-transparent',
      },
      size: {
        sm: 'px-2   py-0.5 text-[9px]',
        md: 'px-2.5 py-1   text-[10px]',
        lg: 'px-3   py-1.5 text-xs',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  )
);
Badge.displayName = 'Badge';
export { badgeVariants };
