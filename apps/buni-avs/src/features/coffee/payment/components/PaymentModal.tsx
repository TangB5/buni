'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePayment } from '../hooks/usePayment';

import { PaymentTierCard } from './PaymentTierCard';
import { PaymentProviderSelector } from './PaymentProviderSelector';
import { useBodyScrollLock } from '../hooks/Usebodyscrolllock';
import { useEscapeKey } from '../hooks/Useescapekey';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modale de soutien financier AVS.
 * Architecture : la modale ne gère que l'orchestration (ouverture/fermeture,
 * focus, scroll-lock) — le style des paliers et des moyens de paiement
 * est délégué à PaymentTierCard / PaymentProviderSelector.
 */
export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const { config, initiatePayment, isProcessing } = usePayment();
  const [selectedProvider, setSelectedProvider] = useState(config.defaultProvider);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [errorTierId, setErrorTierId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, isOpen);
  useBodyScrollLock(isOpen);

  // Réinitialise l'état d'erreur quand on rouvre la modale
  useEffect(() => {
    if (isOpen) setErrorTierId(null);
  }, [isOpen]);

  const handleTierSelect = async (tierId: string) => {
    setSelectedTier(tierId);
    setErrorTierId(null);
    try {
      await initiatePayment(tierId, selectedProvider);
    } catch (error) {
      console.error('Payment failed:', error);
      setErrorTierId(tierId);
      setSelectedTier(null);
    }
  };

  const selectedProviderName = config.providers.find((p) => p.id === selectedProvider)?.name;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-avs-accent/20 backdrop-blur-md "
            onClick={onClose}
          />

          {/* Panneau */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[28px] border border-avs-accent/10 bg-avs-secondary shadow-2xl"
          >
            {/* Bandeau motif — isolé du contenu pour éviter le bruit visuel */}
            <div className="avs-pattern-ndop-sultan pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.06]" />

            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full text-avs-accent/50 transition-colors hover:bg-avs-accent/10 hover:text-avs-accent"
            >
              <i className="pi pi-times text-lg" />
            </button>

            <div className="max-h-[90vh] overflow-y-auto px-6 py-10 sm:px-10">
              <header className="mb-10 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-avs-kente/10">
                  <i className="pi pi-heart-fill text-xl text-avs-kente" />
                </div>
                <h2
                  id="payment-modal-title"
                  className="font-display text-2xl font-bold text-avs-accent sm:text-3xl"
                >
                  Choisissez votre niveau de soutien
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-avs-accent/60">
                  Chaque contribution finance la création et la préservation du
                  patrimoine culturel africain.
                </p>
              </header>

              <section className="mb-10">
                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-avs-accent/50">
                  Moyen de paiement
                </p>
                <PaymentProviderSelector
                  providers={config.providers}
                  selected={selectedProvider}
                  onSelect={setSelectedProvider}
                />
              </section>

              <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {config.tiers.map((tier) => (
                  <PaymentTierCard
                    key={tier.id}
                    tier={tier}
                    onSelect={handleTierSelect}
                    isProcessing={isProcessing && selectedTier === tier.id}
                    selected={selectedTier === tier.id}
                    hasError={errorTierId === tier.id}
                  />
                ))}
              </section>

              <footer className="mt-8 flex items-center justify-center gap-2 text-xs text-avs-accent/40">
                <i className="pi pi-lock text-[11px]" />
                <span>Paiement sécurisé via {selectedProviderName}</span>
              </footer>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}