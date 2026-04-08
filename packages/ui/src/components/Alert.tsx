import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Info, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../utils';
 
const alertVariants = cva(
  'relative flex items-start gap-3 rounded-avs-lg border px-4 py-4 text-sm',
  {
    variants: {
      variant: {
        info:    'border-avs-indigo/30 bg-avs-indigo/6 text-avs-indigo',
        success: 'border-green-200 bg-green-50 text-green-800',
        warning: 'border-amber-200 bg-amber-50 text-amber-800',
        danger:  'border-red-200 bg-red-50 text-red-700',
        kente:   'border-avs-kente/30 bg-avs-kente/8 text-avs-kente',
      },
    },
    defaultVariants: { variant: 'info' },
  }
);
 
const ALERT_ICONS = {
  info:    Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger:  AlertCircle,
  kente:   Info,
};
 
interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?:       string;
  dismissible?: boolean;
  onDismiss?:   () => void;
}
 
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, children, dismissible, onDismiss, ...props }, ref) => {
    const Icon = ALERT_ICONS[variant ?? 'info'];
    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
        <Icon size={16} className="mt-0.5 shrink-0" aria-hidden />
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold text-xs uppercase tracking-wider mb-1">{title}</p>}
          <div className="leading-relaxed">{children}</div>
        </div>
        {dismissible && (
          <button onClick={onDismiss} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity" aria-label="Fermer">
            ×
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';