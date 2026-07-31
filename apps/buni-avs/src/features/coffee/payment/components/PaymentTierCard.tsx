'use client';

import type { PaymentTier } from '../types';

interface PaymentTierCardProps {
  tier: PaymentTier;
  onSelect: (tierId: string) => void;
  isProcessing: boolean;
  selected: boolean;
  hasError?: boolean;
}

/**
 * Carte de palier de soutien. Icônes PrimeIcons uniquement — aucun emoji.
 */
export function PaymentTierCard({
  tier,
  onSelect,
  isProcessing,
  selected,
  hasError = false,
}: PaymentTierCardProps) {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border p-6 transition-all ${
        tier.highlighted
          ? 'border-avs-kente/40 bg-avs-kente/5'
          : 'border-avs-accent/10 bg-avs-primary/20'
      } ${selected ? 'ring-2 ring-avs-kente/50' : ''}`}
    >
      {tier.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-avs-kente px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-avs-secondary">
          Populaire
        </span>
      )}

      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${
          tier.highlighted ? 'bg-avs-kente/15' : 'bg-avs-accent/10'
        }`}
      >
        <i
          className={`${tier.icon} text-lg ${
            tier.highlighted ? 'text-avs-kente' : 'text-avs-accent/70'
          }`}
        />
      </div>

      <h3 className="font-display text-lg font-semibold text-avs-accent">{tier.name}</h3>
      <p className="mt-1 text-sm text-avs-accent/60">{tier.description}</p>

      <p className="mt-4 font-display text-3xl font-bold text-avs-accent">
        {tier.price}
        <span className="ml-1 text-sm font-normal text-avs-accent/50">{tier.currency}</span>
      </p>

      <ul className="mt-5 mb-6 flex-1 space-y-2">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-avs-accent/70">
            <i className="pi pi-check text-avs-kente mt-0.5 text-xs" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onSelect(tier.id)}
        disabled={isProcessing}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
          tier.highlighted
            ? 'bg-avs-kente text-avs-secondary hover:bg-avs-kente/90'
            : 'bg-avs-accent/10 text-avs-accent hover:bg-avs-accent/15'
        }`}
      >
        {isProcessing ? (
          <>
            <i className="pi pi-spinner pi-spin text-sm" />
            Traitement…
          </>
        ) : (
          <>
            <i className="pi pi-arrow-right text-sm" />
            Choisir
          </>
        )}
      </button>

      {hasError && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-red-400">
          <i className="pi pi-exclamation-circle" />
          Le paiement a échoué. Réessayez.
        </p>
      )}
    </div>
  );
}