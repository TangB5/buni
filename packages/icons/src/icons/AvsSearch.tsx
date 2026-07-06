import * as React from 'react';

export const AvsSearch = React.forwardRef<
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
    <circle cx="11" cy="11" r="8" strokeWidth="2" />
    <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
));
AvsSearch.displayName = 'AvsSearch';
