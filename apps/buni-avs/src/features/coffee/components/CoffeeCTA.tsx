'use client';

// PrimeIcons are used as CSS classes (e.g., 'pi pi-coffee')
import { useTranslations } from '@/i18n';
import { useState } from 'react';
import { PaymentModal } from '../payment/components/PaymentModal';

interface CoffeeCTAProps {
  variant?: 'primary' | 'secondary' | 'emotional';
}

export function CoffeeCTA({ variant = 'primary' }: CoffeeCTAProps) {
  const t = useTranslations('coffee.cta');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const baseClasses = "group inline-flex items-center gap-3 rounded-xl px-8 py-4 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-avs-primary";

  const variantClasses = {
    primary: 'avs-btn-primary shadow-lg hover:shadow-xl',
    secondary: 'border-2 border-avs-primary/30 text-avs-primary hover:bg-avs-primary/10 hover:border-avs-primary',
    emotional: 'bg-gradient-to-r from-avs-primary to-avs-primary/80 text-avs-secondary shadow-lg hover:shadow-xl hover:from-avs-primary/90 hover:to-avs-primary/70',
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`${baseClasses} ${variantClasses[variant]}`}
        aria-label={t('ariaLabel')}
      >
        {variant === 'emotional' && <i className="pi pi-heart text-sm animate-pulse" />}
        <i className="pi pi-coffee text-lg" />
        <span>{t('button')}</span>
        <i className="pi pi-arrow-right text-base opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </button>

      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
