'use client';

import { useState, useCallback } from 'react';
import { paymentConfig } from '../config';
import { PaymentSession, PaymentTier } from '../types';

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [session, setSession] = useState<PaymentSession | null>(null);

  const initiatePayment = useCallback(async (tierId: string, provider: string) => {
    setIsProcessing(true);
    
    try {
      const tier = paymentConfig.tiers.find(t => t.id === tierId);
      if (!tier) throw new Error('Tier not found');

      // Create payment session - this would call your backend API
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId,
          provider,
          amount: tier.amount,
          currency: tier.currency,
          successUrl: paymentConfig.successUrl,
          cancelUrl: paymentConfig.cancelUrl,
        }),
      });

      if (!response.ok) throw new Error('Payment initiation failed');

      const data = await response.json();
      
      setSession({
        sessionId: data.sessionId,
        tierId,
        provider,
        amount: tier.amount,
        currency: tier.currency,
        status: 'pending',
        createdAt: new Date(),
      });

      // Redirect to payment provider
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }

      return data;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getTier = useCallback((tierId: string): PaymentTier | undefined => {
    return paymentConfig.tiers.find(t => t.id === tierId);
  }, []);

  return {
    initiatePayment,
    isProcessing,
    session,
    config: paymentConfig,
    getTier,
  };
}
