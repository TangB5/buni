'use client';

import { useToast } from '@buni/ui';

export function ShareBtn({ pattern }: { pattern: any }) {
  const { add: addToast } = useToast();

  const handleShare = async () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/patterns?pattern=${pattern.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: pattern.name,
          text: pattern.summary,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        addToast({ variant: 'success', message: 'Lien copié !' });
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-avs-primary/10 text-avs-primary hover:bg-avs-primary/20 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200"
      title="Partager ce motif"
    >
      <i className="pi pi-share-alt" style={{ fontSize: '11px' }} /> Partager
    </button>
  );
}
