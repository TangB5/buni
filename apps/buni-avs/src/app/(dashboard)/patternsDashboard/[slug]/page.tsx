'use client';

import { useParams, useSearchParams } from 'next/navigation';
import PatternDetailsPage from '../../../../features/patterns/components/PatternDetailsPage';
import PatternEditPage from '../../../../features/patterns/components/PatternEditPage';

/**
 * Page dynamique pour voir/éditer les détails d'un pattern
 * Route: /patternsDashboard/[slug]
 * Mode édition: /patternsDashboard/[slug]?edit=true
 */
export default function PatternPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const isEdit = searchParams.get('edit') === 'true';

  return (
    <div className="space-y-6">
      {isEdit ? <PatternEditPage slug={slug} /> : <PatternDetailsPage slug={slug} />}
    </div>
  );
}
