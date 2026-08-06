import { PaymentConfig } from './types';

export const paymentConfig: PaymentConfig = {
  providers: [
    {
      id: 'stripe',
      name: 'Stripe',
      icon: 'pi-credit-card',
      enabled: true,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'pi-paypal',
      enabled: true,
    },
    {
      id: 'mobile-money',
      name: 'Mobile Money',
      icon: 'pi-mobile',
      enabled: true,
    },
  ],
  tiers: [
    {
      id: 'espresso',
      name: 'Espresso',
      amount: 3,
      currency: 'USD',
      description: 'A quick boost of creativity',
      features: [
        'Support one project',
        'Personal thank you',
        'Impact on open source',
      ],
      emotionalTagline: 'Small gesture, big impact',
      icon: 'pi-coffee',
      price: '$3',
      highlighted: false,
    },
    {
      id: 'cappuccino',
      name: 'Cappuccino',
      amount: 9,
      currency: 'USD',
      description: 'Fuel a full day of creation',
      features: [
        'Support multiple projects',
        'Priority updates',
        'Community recognition',
      ],
      popular: true,
      emotionalTagline: 'Fuel the creative journey',
      icon: 'pi-gift',
      price: '$9',
      highlighted: true,
    },
    {
      id: 'pour-over',
      name: 'Pour Over',
      amount: 25,
      currency: 'USD',
      description: 'Sustain a week of dedicated work',
      features: [
        'Sustain development',
        'Early access features',
        'Direct collaboration',
        'Special supporter badge',
      ],
      emotionalTagline: 'Invest in African heritage',
      icon: 'pi-heart-fill',
      price: '$25',
      highlighted: false,
    },
  ],
  defaultProvider: 'stripe',
  successUrl: '/coffee/success',
  cancelUrl: '/coffee/cancel',
};
