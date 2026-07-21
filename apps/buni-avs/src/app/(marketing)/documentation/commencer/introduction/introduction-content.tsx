'use client';

import { Callout } from '../../doc-primitives';

export function IntroductionWhy() {
  return (
    <>
      {/* Hero banner */}
      <div className="avs-pattern-ndop-royal relative mb-8 overflow-hidden rounded-2xl">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.96) 0%, rgba(29,20,8,0.88) 100%)' }} />
        <div className="relative px-8 py-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] uppercase font-bold" style={{ background: 'rgba(192,87,62,0.2)', color: '#C0573E', border: '1px solid rgba(192,87,62,0.3)' }}>
              <i className="pi pi-sparkles" style={{ fontSize: '8px' }} /> v1.0 · Tailwind CSS v4
            </span>
          </div>
          <h1 className="font-display text-3xl font-black leading-tight" style={{ color: '#f5ebe0', letterSpacing: '-0.02em' }}>
            AVS — African Visual Standard
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed" style={{ color: 'rgba(245,235,224,0.60)' }}>
            Design system open-source inspiré du patrimoine visuel africain.
            Compatible Tailwind CSS v4. Installation en 30 secondes.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['React 18+', 'Next.js 14+', 'TypeScript', 'Tailwind CSS v4', 'Radix UI', 'Framer Motion'].map((t) => (
              <span key={t} className="rounded-lg px-2.5 py-1 font-mono text-[10px] font-semibold" style={{ background: 'rgba(245,235,224,0.08)', color: 'rgba(245,235,224,0.55)', border: '1px solid rgba(245,235,224,0.10)' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <p>
        AVS est le premier design system africain moderne. Intégrez des couleurs, motifs et composants
        authentiques dans votre projet avec une seule commande. Aucun compte, aucune configuration complexe.
      </p>
    </>
  );
}

export function IntroductionExplanation() {
  return (
    <>
      <p>
        AVS est conçu pour être <strong>ultra-simple à intégrer</strong>. Pas de configuration complexe,
        pas de dépendances lourdes. Juste une commande et vous avez accès à :
      </p>

      <div className="my-6 grid gap-3 sm:grid-cols-2">
        {[
          { icon: 'pi-palette', title: 'Couleurs africaines', desc: 'Palette extraite de pigments naturels (terre rouge, or kente, indigo bogolan).' },
          { icon: 'pi-image', title: 'Motifs SVG & CSS', desc: 'Motifs traditionnels (kente, ndop, adinkra) prêts à l\'emploi.' },
          { icon: 'pi-cube', title: 'Composants UI', desc: 'Boutons, cartes, formulaires avec design africain moderne.' },
          { icon: 'pi-bolt', title: 'Installation 30s', desc: 'Une seule commande pour tout configurer automatiquement.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="rounded-xl p-5 transition-colors" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-surface, #ffffff)' }}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: 'var(--doc-primary-10, rgba(192,87,62,0.10))', color: 'var(--doc-primary, #C0573E)' }}>
              <i className={`pi ${icon}`} style={{ fontSize: '18px' }} />
            </div>
            <h3 className="mb-1 text-sm font-bold" style={{ color: 'var(--doc-text, #1D1D1B)', fontFamily: 'var(--font-display, Georgia, serif)' }}>{title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))', marginBottom: 0 }}>{desc}</p>
          </div>
        ))}
      </div>

      <h3>Installation ultra-simple</h3>
      <p>Une seule commande pour tout configurer :</p>

      <div className="my-4 rounded-xl border border-avs-accent/9 bg-avs-primary/5 p-6">
        <code className="font-mono text-sm" style={{ color: '#C0573E' }}>
          npx @buni/cli init
        </code>
      </div>

      <p>
        Cette commande détecte automatiquement votre configuration (Next.js, Vite, etc.) et installe
        Tailwind CSS v4 avec les couleurs AVS, les motifs et les composants nécessaires.
      </p>

      <h3>Pourquoi AVS ?</h3>
      <div className="my-4 overflow-x-auto rounded-xl border border-avs-accent/9" >
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b-1 border-avs-accent/9 bg-avs-primary/10" >
              {['Fonctionnalité', 'AVS', 'PrimeReact', 'Shadcn'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-bold tracking-wider uppercase text-avs-accent text-[9px]" >{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Installation 30s', 'check', 'times', 'times'],
              ['Design africain', 'check', 'times', 'times'],
              ['Tailwind CSS v4', 'check', 'check', 'check'],
              ['Motifs CSS', 'check', 'times', 'times'],
              ['SVG natifs', 'check', 'exclamation-triangle', 'times'],
              ['Copy & Paste', 'check', 'times', 'check'],
              ['TypeScript strict', 'check', 'check', 'check'],
            ].map(([feat, ...vals], i, arr) => (
              <tr
  key={feat}
  className="
    border-b border-avs-accent/9
    transition-colors
    hover:bg-[var(--doc-primary-10,rgba(192,87,62,0.10))]
    last:border-b-0
  "
>
                <td className="px-4 py-2.5 font-semibold text-avs-accent">{feat}</td>
                {vals.map((v, vi) => (
                  <td key={vi} className="px-4 py-2.5 text-center">
                    {v === 'check' && <i className="pi pi-check text-emerald-500" style={{ fontSize: '12px' }} />}
                    {v === 'times' && <i className="pi pi-times text-red-500" style={{ fontSize: '12px' }} />}
                    {v === 'exclamation-triangle' && <i className="pi pi-exclamation-triangle text-amber-500" style={{ fontSize: '12px' }} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="tip" title="Commencez maintenant">
        Lancez <code className="font-mono text-xs">npx @buni/cli init</code> dans votre projet pour
        installer AVS en 30 secondes. Ensuite, explorez les{' '}
        <a href="/documentation/motifs/utiliser-patterns-code">motifs</a> et{' '}
        <a href="/documentation/composants">composants</a>.
      </Callout>
    </>
  );
}

export const IntroductionContent = {
  Why: IntroductionWhy,
  Explanation: IntroductionExplanation,
};
