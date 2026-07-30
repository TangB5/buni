'use client';

import { PaymentProvider } from '../types';

interface PaymentProviderSelectorProps {
  providers: PaymentProvider[];
  selected: string;
  onSelect: (providerId: string) => void;
}

export function PaymentProviderSelector({ providers, selected, onSelect }: PaymentProviderSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {providers.map((provider) => (
        <button
          key={provider.id}
          onClick={() => onSelect(provider.id)}
          disabled={!provider.enabled}
          className={`group relative px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
            !provider.enabled
              ? 'border-avs-accent/10 opacity-50 cursor-not-allowed'
              : selected === provider.id
              ? 'border-avs-primary bg-avs-primary/10'
              : 'border-avs-accent/20 hover:border-avs-primary/50 hover:bg-avs-primary/5'
          }`}
        >
          <span className="text-2xl mr-2">{provider.icon}</span>
          <span className={`font-medium ${
            selected === provider.id ? 'text-avs-primary' : 'text-avs-accent/70'
          }`}>
            {provider.name}
          </span>
          {selected === provider.id && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-avs-primary rounded-full animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
}
