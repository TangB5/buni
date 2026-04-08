'use client';
import * as React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../utils';

interface ToggleProps {
  checked:   boolean;
  onCheckedChange: (v: boolean) => void;
  label?:    string;
  disabled?: boolean;
  id?:       string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onCheckedChange, label, disabled, id }) => {
  const switchId = id ?? React.useId();
  return (
    <div className="flex items-center gap-3">
      <RadixSwitch.Root
        id={switchId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full border-2 border-transparent',
          'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-avs-primary' : 'bg-avs-accent/20'
        )}
      >
        <RadixSwitch.Thumb className={cn(
          'block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        )} />
      </RadixSwitch.Root>
      {label && <label htmlFor={switchId} className="cursor-pointer text-sm text-avs-accent">{label}</label>}
    </div>
  );
};
