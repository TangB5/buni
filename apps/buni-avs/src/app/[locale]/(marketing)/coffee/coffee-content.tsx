'use client';

import { EmotionalHero } from '@/features/coffee/components/EmotionalHero';
import { RitualSection } from '@/features/coffee/components/RitualSection';
import { ImpactSection } from '@/features/coffee/components/ImpactSection';
import { HeritageSection } from '@/features/coffee/components/HeritageSection';
import { CommunitySection } from '@/features/coffee/components/CommunitySection';
import { TestimonialSection } from '@/features/coffee/components/TestimonialSection';

export function CoffeeContent() {
  return (
    <div className="min-h-screen bg-avs-secondary">
      <EmotionalHero />
      <RitualSection />
      <ImpactSection />
      <HeritageSection />
      <CommunitySection />
      <TestimonialSection />
    </div> 
  );
}