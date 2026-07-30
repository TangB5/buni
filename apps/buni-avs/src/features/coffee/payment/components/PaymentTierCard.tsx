'use client';

import { PaymentTier } from '../types';
// PrimeIcons are used as CSS classes (e.g., 'pi pi-coffee')

interface PaymentTierCardProps {
  tier: PaymentTier;
  onSelect: (tierId: string) => void;
  isProcessing: boolean;
  selected?: boolean;
}

export function PaymentTierCard({ tier, onSelect, isProcessing, selected }: PaymentTierCardProps) {
  return (
    <div
      className={`relative group rounded-2xl p-8 transition-all duration-300 ${
        selected
          ? 'avs-card-selected ring-2 ring-avs-primary shadow-avs'
          : 'avs-card hover:shadow-avs hover:-translate-y-1'
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-avs-primary text-avs-secondary text-xs font-bold uppercase tracking-wider">
            <i className="pi pi-star text-xs"></i>
            Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <i className="pi pi-coffee text-2xl text-avs-primary"></i>
          <h3 className="font-display font-bold text-2xl text-avs-accent">{tier.name}</h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-display font-black text-4xl text-avs-primary">${tier.amount}</span>
          <span className="text-avs-accent/60">/{tier.currency}</span>
        </div>
        <p className="mt-2 text-sm text-avs-accent/80 italic">{tier.emotionalTagline}</p>
      </div>

      <p className="text-avs-accent/70 mb-6 leading-relaxed">{tier.description}</p>

      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-avs-primary/10 flex items-center justify-center mt-0.5">
              <i className="pi pi-heart text-xs text-avs-primary"></i>
            </div>
            <span className="text-avs-accent/80 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(tier.id)}
        disabled={isProcessing}
        className={`w-full avs-btn-primary py-4 rounded-xl font-bold transition-all duration-300 ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
        }`}
      >
        {isProcessing ? 'Processing...' : `Support with ${tier.name}`}
      </button>
    </div>
  );
}
