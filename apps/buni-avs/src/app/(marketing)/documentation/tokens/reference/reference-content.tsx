'use client';

import { useState } from 'react';
import { CodeBlock, LiveDemo, useCopy } from '../../doc-primitives';

export function ReferenceWhy() {
  return (
    <p>
      Les design tokens sont les éléments fondamentaux d'un système de design cohérent.
      Ils permettent de maintenir la consistance visuelle à travers toute l'application.
    </p>
  );
}

export function ReferenceExplanation() {
  const { copied, copy } = useCopy();
  const palette = [
    { name: 'avs-primary', hex: '#C0573E', label: 'Terre brûlée', origin: 'Poterie Yoruba', dark: false },
    { name: 'avs-secondary', hex: '#F5EBE0', label: 'Lin naturel', origin: 'Tissu Fulani', dark: false },
    { name: 'avs-accent', hex: '#1D1D1B', label: 'Obsidienne', origin: 'Basalte Kenya', dark: true },
    { name: 'avs-kente', hex: '#D4A017', label: 'Or kente', origin: 'Fil soie Asante', dark: false },
    { name: 'avs-ndop', hex: '#4A6741', label: 'Vert Bamiléké', origin: 'Plantes indigo', dark: true },
    { name: 'avs-indigo', hex: '#2A4A6B', label: 'Bleu bogolan', origin: 'Teinture Bambara', dark: true },
    { name: 'avs-earth', hex: '#8B4513', label: 'Ocre savane', origin: 'Argile du Sahel', dark: true },
    { name: 'avs-raffia', hex: '#C8A96E', label: 'Raphia naturel', origin: 'Fibre de palmier', dark: false },
  ];

  return (
    <>
      <p>La palette AVS est extraite de pigments naturels africains. Chaque couleur est documentée avec sa source ethnographique primaire. Cliquez sur un swatch pour copier le HEX.</p>

      <h3>Palette principale</h3>
      <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {palette.map(({ name, hex, label, origin }) => (
          <button key={name} onClick={() => void copy(hex, name)}
            className="group overflow-hidden rounded-xl text-left transition-all duration-300 hover:-translate-y-1"
            style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <div className="relative h-16" style={{ background: hex }}>
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-[10px] font-bold text-white drop-shadow">
                  {copied === name ? '✓ Copié !' : 'Copier HEX'}
                </span>
              </div>
            </div>
            <div className="p-2.5" style={{ background: 'var(--doc-surface, #ffffff)' }}>
              <p className="font-mono text-[9px]" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>{hex}</p>
              <p className="mt-0.5 text-[11px] font-bold" style={{ color: 'var(--doc-text, #1D1D1B)' }}>{label}</p>
              <p className="mt-0.5 font-mono text-[8px]" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>{name}</p>
              <p className="mt-0.5 text-[8px] italic" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))', opacity: 0.7 }}>{origin}</p>
            </div>
          </button>
        ))}
      </div>

      <h3>CSS Custom Properties</h3>
      <CodeBlock id="css-vars" lang="css" title="avs-tokens.css" code={`:root {
  --avs-primary:   #C0573E;
  --avs-secondary: #F5EBE0;
  --avs-accent:    #1D1D1B;
  --avs-kente:     #D4A017;
  --avs-ndop:      #4A6741;
  --avs-indigo:    #2A4A6B;
  --avs-earth:     #8B4513;
  --avs-raffia:    #C8A96E;

  --shadow-avs:    3px 3px 0px 0px var(--avs-accent);
  --shadow-avs-md: 5px 5px 0px 0px var(--avs-primary);
  --radius-avs:    0.375rem;
  --radius-avs-lg: 1.25rem;
  --transition:    250ms cubic-bezier(0.4, 0, 0.2, 1);
}`} />

      <h3>Typographie</h3>
      <LiveDemo label="Échelle typographique">
        <div className="space-y-4">
          <p className="font-display text-4xl font-black leading-none" style={{ color: 'var(--doc-text, #1D1D1B)', letterSpacing: '-0.02em', fontFamily: 'var(--font-display, Georgia, serif)' }}>Display — Playfair Display</p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--doc-muted, rgba(29,29,27,0.52))' }}>Body — DM Sans · Texte courant et interfaces</p>
          <p className="font-mono text-sm" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>Mono — JetBrains Mono · Code et tokens</p>
        </div>
      </LiveDemo>
    </>
  );
}

export const ReferenceContent = {
  Why: ReferenceWhy,
  Explanation: ReferenceExplanation,
};
