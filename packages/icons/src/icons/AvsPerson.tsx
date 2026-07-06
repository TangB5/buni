import * as React from 'react';

export const AvsPerson = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>(({ className = '', ...props }, ref) => (
  <svg
    ref={ref}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="8" r="4" strokeWidth="2" />
    <path d="M4 20C4 16 7 14 12 14C17 14 20 16 20 20" strokeWidth="2" strokeLinecap="round" />
  </svg>
));
AvsPerson.displayName = 'AvsPerson';
