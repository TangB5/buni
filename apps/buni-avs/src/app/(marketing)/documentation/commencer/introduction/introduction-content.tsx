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
              <i className="pi pi-sparkles" style={{ fontSize: '8px' }} /> v1.0 · Open Standard
            </span>
          </div>
          <h1 className="font-display text-3xl font-black leading-tight" style={{ color: '#f5ebe0', letterSpacing: '-0.02em' }}>
            AVS — African Visual Standard
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed" style={{ color: 'rgba(245,235,224,0.60)' }}>
            Bibliothèque de composants UI open-source construite avec React, Radix UI et Tailwind CSS.
            Inspirée du patrimoine visuel africain. Aucun compte requis.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['React 18+', 'Next.js 14+', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Framer Motion'].map((t) => (
              <span key={t} className="rounded-lg px-2.5 py-1 font-mono text-[10px] font-semibold" style={{ background: 'rgba(245,235,224,0.08)', color: 'rgba(245,235,224,0.55)', border: '1px solid rgba(245,235,224,0.10)' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <p>
        La plupart des design systems actuels sont basés sur des esthétiques occidentales. AVS change la donne en proposant
        une identité visuelle authentiquement africaine, documentée et accessible à tous les développeurs.
      </p>
    </>
  );
}

export function IntroductionExplanation() {
  return (
    <>
      <p>
        AVS adopte l&apos;approche <strong>Copy &amp; Paste</strong> popularisée par Shadcn/UI : vous copiez les composants
        dans votre projet, ils vous appartiennent entièrement. Pas de dépendance opaque, pas de lock-in.
      </p>

      <div className="my-6 grid gap-3 sm:grid-cols-2">
        {[
          { icon: 'pi-globe', title: 'Culturellement ancré', desc: 'Chaque token de couleur, motif et composant est documenté avec sa source primaire africaine.' },
          { icon: 'pi-unlock', title: 'Public par défaut', desc: 'Composants, motifs, templates — tout est accessible sans authentification.' },
          { icon: 'pi-bolt', title: 'Copy & Paste', desc: 'Vous possédez votre code. Aucune dépendance lourde. Adaptez, étendez, supprimez.' },
          { icon: 'pi-palette', title: 'Design System cohérent', desc: 'Palette extraite de pigments naturels africains, tokens CSS, motifs CSS pur.' },
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

      <div className="my-4 overflow-x-auto rounded-xl" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))' }}>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-primary-10, rgba(192,87,62,0.10))' }}>
              {['Fonctionnalité', 'AVS', 'PrimeReact', 'Shadcn'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-bold tracking-wider uppercase" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))', fontSize: '9px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Accès sans compte', 'check', 'check', 'check'],
              ['Copy & Paste', 'check', 'times', 'check'],
              ['Design africain', 'check', 'times', 'times'],
              ['SVG natifs', 'check', 'exclamation-triangle', 'times'],
              ['Motifs CSS', 'check', 'times', 'times'],
              ['Radix UI', 'check', 'times', 'check'],
              ['TypeScript strict', 'check', 'check', 'check'],
            ].map(([feat, ...vals], i, arr) => (
              <tr key={feat} className="transition-colors hover:bg-[var(--doc-primary-10,rgba(192,87,62,0.10))]" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--doc-border, rgba(29,29,27,0.09))' : 'none' }}>
                <td className="px-4 py-2.5 font-semibold" style={{ color: 'var(--doc-text, #1D1D1B)' }}>{feat}</td>
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

      <Callout type="tip" title="Bonne pratique">
        Commencez par lire la section Installation, puis explorez les{' '}
        <a href="/components">Composants</a> qui proposent des previews live interactives.
      </Callout>
    </>
  );
}

export const IntroductionContent = {
  Why: IntroductionWhy,
  Explanation: IntroductionExplanation,
};
