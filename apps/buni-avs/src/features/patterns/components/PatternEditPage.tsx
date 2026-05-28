 'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PatternForm } from './PatternForm';
import { loadPattern } from '../usecases/load-pattern.usecase';
import type { Pattern } from '@buni/patterns';

interface PatternEditPageProps {
  slug: string;
}

export default function PatternEditPage({ slug }: PatternEditPageProps) {
  const router = useRouter();
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPattern = async () => {
      try {
        setLoading(true);
        const data = await loadPattern(slug);
        setPattern(data);
      } catch (err) {
        console.error('Erreur lors du chargement du pattern:', err);
        setError('Pattern non trouvé');
      } finally {
        setLoading(false);
      }
    };

    fetchPattern();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-avs-accent">Chargement...</div>
      </div>
    );
  }

  if (error || !pattern) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-avs-accent font-bold">{error || 'Pattern non trouvé'}</p>
        <button
          onClick={() => router.back()}
          className="avs-btn-primary"
        >
          Retour
        </button>
      </div>
    );
  }

  return <PatternForm initialPattern={pattern} />;
}
