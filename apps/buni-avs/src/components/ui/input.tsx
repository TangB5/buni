import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-avs border-avs-accent/20 bg-avs-secondary/50 text-avs-accent placeholder:text-avs-accent/40 focus:border-avs-primary w-full border px-3 py-2.5 text-sm focus:outline-none ${props.className || ''}`}
    />
  );
}
