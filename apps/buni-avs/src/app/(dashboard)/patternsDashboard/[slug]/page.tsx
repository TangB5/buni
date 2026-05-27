'use client';

import { useParams } from 'next/navigation';
import PatternDetailsPage from '@/features/patterns/components/PatternDetailsPage';

/**
 * Page dynamique pour voir les détails d'un pattern
 * Route: /patternsDashboard/[slug]
 */
export default function PatternPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="space-y-6">
      <PatternDetailsPage slug={slug} />
    </div>
  );
}
