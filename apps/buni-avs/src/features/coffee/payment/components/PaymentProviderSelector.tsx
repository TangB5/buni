'use client';

import type { PaymentProvider } from '../types';

interface PaymentProviderSelectorProps {
  providers: PaymentProvider[];
  selected: string;
  onSelect: (providerId: string) => void;
}

/**
 * Sélecteur segmenté des moyens de paiement.
 * Icônes PrimeIcons uniquement — aucun emoji.
 */
export function PaymentProviderSelector({
  providers,
  selected,
  onSelect,
}: PaymentProviderSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Moyen de paiement"
      className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-avs-primary/40 p-1.5"
    >
      {providers.map((provider) => {
        const isSelected = provider.id === selected;
        return (
          <button
            key={provider.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(provider.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              isSelected
                ? 'bg-avs-secondary text-avs-accent shadow-sm'
                : 'text-avs-accent/50 hover:text-avs-accent/80'
            }`}
          >
            <i className={`${provider.icon} text-base ${isSelected ? 'text-avs-kente' : ''}`} />
            {provider.name}
          </button>
        );
      })}
    </div>
  );
}