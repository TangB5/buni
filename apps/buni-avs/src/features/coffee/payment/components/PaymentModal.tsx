'use client';

import { useState } from 'react';
// PrimeIcons are used as CSS classes (e.g., 'pi pi-coffee')
import { usePayment } from '../hooks/usePayment';
import { PaymentTierCard } from './PaymentTierCard';
import { PaymentProviderSelector } from './PaymentProviderSelector';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const { config, initiatePayment, isProcessing } = usePayment();
  const [selectedProvider, setSelectedProvider] = useState(config.defaultProvider);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTierSelect = async (tierId: string) => {
    setSelectedTier(tierId);
    try {
      await initiatePayment(tierId, selectedProvider);
    } catch (error) {
      console.error('Payment failed:', error);
      setSelectedTier(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-avs-secondary/95 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative avs-pattern-ndop-sultan bg-avs-secondary rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-avs-accent/10 transition-colors"
        >
          <i className="pi pi-times text-lg text-avs-accent/60"></i>
        </button>

        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl text-avs-accent mb-3">
            Choose Your Support Level
          </h2>
          <p className="text-avs-accent/60">
            Every contribution fuels creativity and African heritage preservation
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-avs-accent/80 mb-3 text-center">
            Payment Method
          </label>
          <PaymentProviderSelector
            providers={config.providers}
            selected={selectedProvider}
            onSelect={setSelectedProvider}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {config.tiers.map((tier) => (
            <PaymentTierCard
              key={tier.id}
              tier={tier}
              onSelect={handleTierSelect}
              isProcessing={isProcessing && selectedTier === tier.id}
              selected={selectedTier === tier.id}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-avs-accent/40">
            Secure payment powered by {config.providers.find(p => p.id === selectedProvider)?.name}
          </p>
        </div>
      </div>
    </div>
  );
}
