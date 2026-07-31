export interface PaymentProvider {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export interface PaymentTier {
  id: string;
  name: string;
  amount: number;
  currency: string;
  description: string;
  features: string[];
  popular?: boolean;
  emotionalTagline: string;
  highlighted?: boolean;
  icon: string;
  price: string;
}

export interface PaymentConfig {
  providers: PaymentProvider[];
  tiers: PaymentTier[];
  defaultProvider: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentSession {
  sessionId: string;
  tierId: string;
  provider: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}
