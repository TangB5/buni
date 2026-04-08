import React from 'react';

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-avs bg-avs-primary text-avs-secondary px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 ${props.className || ''}`}
    />
  );
}
