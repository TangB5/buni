# Coffee Payment System - Architecture Documentation

## Overview

This document describes the complete refactoring of the Coffee page with emotional branding and an integrated custom payment system. The architecture is modular, scalable, and designed for optimal UX/UI experience.

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── [locale]/(marketing)/coffee/
│   │   ├── coffee-content.tsx          # Main page component (refactored)
│   │   └── page.tsx                     # Page wrapper
│   └── api/payment/
│       ├── create/route.ts              # Payment session creation
│       ├── success/route.ts             # Payment success callback
│       └── cancel/route.ts              # Payment cancellation callback
├── features/coffee/
│   ├── payment/
│   │   ├── types.ts                     # TypeScript interfaces
│   │   ├── config.ts                    # Payment configuration
│   │   ├── hooks/
│   │   │   └── usePayment.ts           # Payment hook
│   │   └── components/
│   │       ├── PaymentModal.tsx         # Payment modal
│   │       ├── PaymentTierCard.tsx     # Tier selection cards
│   │       └── PaymentProviderSelector.tsx  # Provider selector
│   └── components/
│       ├── EmotionalHero.tsx           # Hero section with animations
│       ├── RitualSection.tsx           # Cultural ritual section
│       ├── ImpactSection.tsx            # Impact cards section
│       ├── HeritageSection.tsx         # African heritage section
│       ├── CommunitySection.tsx        # Community supporters section
│       ├── TestimonialSection.tsx      # Testimonial section
│       ├── CoffeeCTA.tsx               # Call-to-action component
│       └── Footer.tsx                  # Footer component
└── i18n/locales/
    └── en.json                         # Updated translations
```

## Key Components

### 1. Payment System

#### Payment Configuration (`config.ts`)
- **Providers**: Stripe, PayPal, Mobile Money
- **Tiers**: Espresso ($3), Cappuccino ($9), Pour Over ($25)
- **Emotional Taglines**: Each tier has an emotional message
- **Customizable**: Easy to add new providers or tiers

#### Payment Hook (`usePayment.ts`)
- Manages payment session creation
- Handles provider selection
- Integrates with backend API
- Error handling and loading states

#### Payment Modal
- Tier selection with visual cards
- Provider selector (Stripe, PayPal, Mobile Money)
- Real-time processing feedback
- Responsive design

### 2. Emotional Branding Components

#### EmotionalHero
- Animated background particles
- Scroll-triggered animations
- Gradient text effects
- Trust indicators

#### RitualSection
- Cultural storytelling
- Image with parallax effect
- Floating quote overlay
- Emotional connection to African traditions

#### ImpactSection
- Four impact cards with icons
- Statistics display
- Animated counters
- Community metrics

#### HeritageSection
- African heritage narrative
- Cultural pattern overlays
- Emotional highlight boxes
- Responsive layout

#### CommunitySection
- Supporter grid
- Community actions
- Social proof elements
- Interactive cards

### 3. Animations & CSS

#### Custom Animations (`globals.css`)
- `animate-float`: Floating particles effect
- `animate-pulse-glow`: Pulsing glow effect
- `animate-shimmer`: Shimmer effect for loading states
- `animate-fade-in-up`: Fade in with upward motion
- `animate-fade-in-scale`: Fade in with scale
- `animate-heartbeat`: Heartbeat animation for emotional elements

#### Utility Classes
- `.avs-card-selected`: Selected payment tier styling
- `.shadow-avs`: Custom shadow with AVS colors
- Responsive design utilities

## API Endpoints

### POST `/api/payment/create`
Creates a payment session with the selected provider.

**Request Body:**
```json
{
  "tierId": "espresso",
  "provider": "stripe",
  "amount": 3,
  "currency": "USD",
  "successUrl": "/coffee/success",
  "cancelUrl": "/coffee/cancel"
}
```

**Response:**
```json
{
  "sessionId": "coffee_1234567890_abc123",
  "checkoutUrl": "https://checkout.stripe.com/...",
  "tier": "Espresso",
  "amount": 3,
  "currency": "USD"
}
```

### GET `/api/payment/success`
Handles successful payment callbacks.

### GET `/api/payment/cancel`
Handles cancelled payment callbacks.

## Integration Guide

### Step 1: Configure Payment Providers

Edit `src/features/coffee/payment/config.ts`:

```typescript
export const paymentConfig: PaymentConfig = {
  providers: [
    {
      id: 'stripe',
      name: 'Stripe',
      icon: '💳',
      enabled: true,
    },
    // Add more providers
  ],
  // ... configuration
};
```

### Step 2: Integrate Payment APIs

Update the API route files with actual provider integrations:

1. **Stripe**: Install `@stripe/stripe-js` and use Stripe Checkout
2. **PayPal**: Use PayPal Orders API
3. **Mobile Money**: Integrate with Orange Money, MTN Mobile Money, etc.

### Step 3: Customize Tiers

Modify the tiers in `config.ts` to match your pricing:

```typescript
tiers: [
  {
    id: 'custom-tier',
    name: 'Custom Tier',
    amount: 15,
    currency: 'USD',
    description: 'Your description',
    features: ['Feature 1', 'Feature 2'],
    emotionalTagline: 'Your emotional message',
  },
]
```

### Step 4: Add Images

Place images in the `public/images/` directory:
- `coffee-ritual.jpg`
- `african-heritage.jpg`

### Step 5: Customize Translations

Update `src/i18n/locales/en.json` with your content.

## Features

### Emotional Branding
- **Storytelling**: Each section tells a part of the story
- **Cultural Connection**: African traditions and heritage
- **Visual Patterns**: Integration of AVS cultural patterns
- **Emotional Triggers**: Heartbeat animations, warm colors

### UX Improvements
- **Scroll Animations**: Elements animate as they enter viewport
- **Micro-interactions**: Hover effects, button animations
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation

### Payment System
- **Multiple Providers**: Stripe, PayPal, Mobile Money
- **Tier Selection**: Visual cards with clear features
- **Real-time Feedback**: Processing states, error handling
- **Secure**: Provider-specific security measures

## Customization

### Colors
The system uses AVS color tokens. Customize in `globals.css`:

```css
:root {
  --color-avs-primary: #C0573E;
  --color-avs-secondary: #F5EBE0;
  --color-avs-accent: #1D1D1B;
}
```

### Typography
Uses AVS font tokens:
- `font-display`: Display font for headings
- `font-body`: Body font for content

### Patterns
Integrates AVS pattern classes:
- `avs-pattern-kente-royale`
- `avs-pattern-ndop-sultan`
- `avs-pattern-adinkra-sankofa`

## Best Practices

1. **Testing**: Test payment flows in sandbox mode before production
2. **Error Handling**: Implement proper error handling in payment hooks
3. **Analytics**: Track conversion rates and user behavior
4. **Security**: Never expose API keys in client-side code
5. **Performance**: Lazy load images and optimize animations

## Future Enhancements

- [ ] Add recurring payment options
- [ ] Implement payment analytics dashboard
- [ ] Add supporter recognition system
- [ ] Create email notification system
- [ ] Add multi-currency support
- [ ] Implement payment history tracking

## Support

For issues or questions about the payment system, refer to:
- AVS Documentation
- Payment provider documentation
- Next.js API routes documentation

## License

This payment system is part of the AVS project and follows the same license terms.
