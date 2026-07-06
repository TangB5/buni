'use client';
import * as React from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  error?:     string;
  label?:     string;
  hint?:      string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, label, hint, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-avs-accent/50">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-avs-accent/35">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId} ref={ref}
            className={cn(
              'w-full rounded-avs border-2 bg-white px-4 py-2.5 text-sm text-avs-accent placeholder:text-avs-accent/35',
              'transition-all duration-150 outline-none',
              'border-avs-accent/15 hover:border-avs-accent/25',
              'focus:border-avs-primary focus:ring-2 focus:ring-avs-primary/20',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
              leftIcon  && 'pl-9',
              rightIcon && 'pr-9',
              props.disabled && 'cursor-not-allowed opacity-50',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-avs-accent/35">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p id={`${inputId}-error`} className="mt-1 flex items-center gap-1 text-xs text-red-600" role="alert">{error}</p>}
        {hint && !error && <p id={`${inputId}-hint`} className="mt-1 text-xs text-avs-accent/40">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string; label?: string }>(
  ({ className, error, label, id, ...props }, ref) => {
    const textareaId = id ?? React.useId();
    return (
      <div className="w-full">
        {label && <label htmlFor={textareaId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-avs-accent/50">{label}</label>}
        <textarea
          id={textareaId} ref={ref}
          className={cn(
            'w-full rounded-avs border-2 border-avs-accent/15 bg-white px-4 py-3 text-sm text-avs-accent placeholder:text-avs-accent/35 resize-none',
            'transition-all duration-150 outline-none focus:border-avs-primary focus:ring-2 focus:ring-avs-primary/20',
            error && 'border-red-400 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
