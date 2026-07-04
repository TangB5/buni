'use client';

import { LiveDemo, CodeBlock, Callout } from "../doc-primitives";



export function MotifsWhy() {
  return (
    <p>
      Les motifs CSS permettent d'ajouter des textures visuelles riches sans surcharger l'application avec des images.
      Ils sont générés entièrement en CSS, ce qui les rend légers et personnalisables.
    </p>
  );
}

export function MotifsExplanation() {
  return (
    <>
      <p>Des motifs africains générés entièrement en CSS — sans image, sans SVG. Utilisation instantanée via <code>className</code>.</p>

      <h3>Catalogue</h3>
      <div className="my-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { cls: 'avs-pattern-kente-royale', label: 'Kente', origin: 'Akan, Ghana', desc: 'Bandelettes entrelacées' },
          { cls: 'avs-pattern-ndop-sultan', label: 'Ndop', origin: 'Bamoum, Cameroun', desc: 'Grille et cercles rituels' },
          { cls: 'avs-pattern-bogolan-fanga', label: 'Bogolan', origin: 'Bambara, Mali', desc: 'Teintures à la boue' },
          { cls: 'avs-pattern-wax-dakar', label: 'Wax', origin: 'Pan-africain', desc: 'Losanges et points' },
          { cls: 'avs-pattern-adinkra-sankofa', label: 'Adinkra', origin: 'Asante, Ghana', desc: 'Symboles philosophiques' },
          { cls: 'avs-pattern-kuba-kasai', label: 'Kuba', origin: 'Kasaï, Congo', desc: 'Géométrie entrelacée' },
        ].map(({ cls, label, origin, desc }) => (
          <div key={cls} className="overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className={`${cls} h-20`} />
            <div className="p-3" style={{ background: 'var(--doc-surface, #ffffff)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--doc-text, #1D1D1B)', fontFamily: 'var(--font-display, Georgia, serif)' }}>{label}</p>
              <p className="mt-0.5 text-[10px] font-semibold" style={{ color: 'var(--doc-primary, #C0573E)' }}>{origin}</p>
              <p className="mt-0.5 text-[10px]" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>{desc}</p>
              <p className="mt-1 font-mono text-[9px]" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))', opacity: 0.6 }}>.{cls}</p>
            </div>
          </div>
        ))}
      </div>

      <h3>Usages typiques</h3>
      <LiveDemo label="Applications des motifs">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="avs-pattern-ndop-sultan relative overflow-hidden rounded-xl">
            <div className="absolute inset-0" style={{ background: 'rgba(10,8,6,0.78)' }} />
            <div className="relative p-4 text-center">
              <p className="text-xs font-bold" style={{ color: 'rgba(245,235,224,0.85)' }}>Section Hero</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="avs-pattern-kente-royale relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ring-2 ring-white dark:ring-zinc-800">
              <span className="font-display text-lg font-black text-white drop-shadow-md relative z-10">A</span>
              <div className="absolute inset-0 bg-black/25" />
            </div>
            <span className="text-xs" style={{ color: 'var(--doc-muted, rgba(29,29,27,0.52))' }}>Avatar</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="avs-pattern-kente-royale h-10 w-10 animate-spin rounded-full opacity-75" style={{ animationDuration: '2s' }} />
            <span className="text-xs" style={{ color: 'var(--doc-muted, rgba(29,29,27,0.52))' }}>Spinner</span>
          </div>
        </div>
      </LiveDemo>

      <CodeBlock id="patterns-code" lang="tsx" code={`// Fond de section hero
<section className="avs-pattern-ndop-sultan relative min-h-screen">
  <div className="absolute inset-0 bg-avs-accent/80" />
  <div className="relative">{/* contenu */}</div>
</section>

// Avatar circulaire avec initiale
<div className="avs-pattern-kente-royale h-10 w-10 rounded-full ring-2 ring-white">
  <span className="font-display font-black text-white drop-shadow">A</span>
</div>

// Spinner animé
<div className="avs-pattern-kente-royale h-10 w-10 animate-spin rounded-full" />

// Bande décorative en tête de card
<div className="rounded-2xl overflow-hidden">
  <div className="avs-pattern-ndop-sultan h-1 w-full" />
  <div className="p-5">{/* contenu */}</div>
</div>`} />

      <Callout type="info">
        Les motifs CSS utilisent des <code>linear-gradient</code> et <code>radial-gradient</code> imbriqués,
        définis dans <code>src/theme/patterns/patterns.css</code>.
      </Callout>
    </>
  );
}

export const MotifsContent = {
  Why: MotifsWhy,
  Explanation: MotifsExplanation,
};
