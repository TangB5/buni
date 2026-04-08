import * as React from 'react';
import * as RadixSeparator from '@radix-ui/react-separator';
import { cn } from '../utils';

export const Separator = React.forwardRef<
  React.ElementRef<typeof RadixSeparator.Root>,
  React.ComponentPropsWithoutRef<typeof RadixSeparator.Root>
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <RadixSeparator.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-avs-accent/8',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className
    )}
    {...props}
  />
));
Separator.displayName = RadixSeparator.Root.displayName;
