'use client';

import { useState } from 'react';
import { CodeBlock, LiveDemo, PropTable, Callout } from '../../doc-primitives';

export function BoutonWhy() {
  return (
    <p>
      Le bouton est l'un des composants les plus utilisés dans une interface. Il doit être clair, accessible
      et cohérent avec le design system pour offrir une expérience utilisateur optimale.
    </p>
  );
}

export function BoutonExplanation() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <p>Composant bouton multi-variantes basé sur <strong>CVA</strong> et <strong>Radix Slot</strong>. Supporte le polymorphisme via <code>asChild</code>.</p>

      <h3>Import</h3>
      <CodeBlock id="btn-import-code" lang="tsx" code={`import { Button } from '@/components/ui';
// ou
import { Button } from '@avs/ui';`} />

      <h3>Variantes</h3>
      <LiveDemo>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { v: 'Primaire',   cls: 'bg-avs-primary text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md' },
            { v: 'Secondaire', cls: 'border-2 border-avs-accent/20 text-avs-accent hover:border-avs-primary hover:text-avs-primary' },
            { v: 'Ghost',      cls: 'text-avs-primary hover:bg-avs-primary/10' },
            { v: 'Kente',      cls: 'bg-avs-kente text-avs-accent font-black shadow-sm hover:-translate-y-0.5' },
            { v: 'Danger',     cls: 'bg-red-600 text-white shadow-sm hover:-translate-y-0.5' },
          ].map(({ v, cls }) => (
            <button key={v} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${cls}`}>{v}</button>
          ))}
        </div>
      </LiveDemo>
      <CodeBlock id="btn-variants-code" lang="tsx" code={`<Button variant="primary">Primaire</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="kente">Kente</Button>
<Button variant="danger">Danger</Button>`} />

      <h3>États interactifs</h3>
      <LiveDemo label="États">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-avs-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <><span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Chargement…</>
            ) : 'Cliquer pour charger'}
          </button>
          <button disabled className="cursor-not-allowed rounded-xl border border-avs-accent/20 px-4 py-2 text-xs font-bold text-avs-accent/40">Désactivé</button>
        </div>
      </LiveDemo>

      <h3>API de référence</h3>
      <PropTable rows={[
        ['variant', 'primary | secondary | ghost | kente | danger', 'primary', 'Style visuel du bouton'],
        ['size', 'xs | sm | md | lg | icon', 'md', 'Taille du bouton'],
        ['isLoading', 'boolean', 'false', 'Affiche un spinner à la place du contenu'],
        ['disabled', 'boolean', 'false', 'Désactive toutes les interactions'],
        ['asChild', 'boolean', 'false', "Délègue le rendu à l'enfant (Radix Slot)"],
        ['leftIcon', 'ReactNode', '—', 'Icône affichée à gauche du texte'],
        ['rightIcon', 'ReactNode', '—', 'Icône affichée à droite du texte'],
        ['className', 'string', '—', 'Classes CSS additionnelles'],
      ]} />

      <Callout type="tip">
        Pour les liens de navigation, utilisez toujours <code>asChild</code> avec <code>Link</code> de Next.js
        plutôt que <code>href</code> directement, pour bénéficier du prefetching.
      </Callout>
    </>
  );
}

export const BoutonContent = {
  Why: BoutonWhy,
  Explanation: BoutonExplanation,
};
