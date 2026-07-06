import * as React from 'react';

export const AvsHome = React.forwardRef<
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
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="9,22 9,12 15,12 15,22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
));
AvsHome.displayName = 'AvsHome';
