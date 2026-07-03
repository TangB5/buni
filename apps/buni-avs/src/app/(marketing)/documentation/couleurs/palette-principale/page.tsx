'use client';

import { useCopy, CodeBlock } from '../../doc-primitives';
import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';

const PALETTE = [
  { name: 'avs-primary',   hex: '#C0573E', label: 'Terre brûlée', origin: 'Poterie Yoruba' },
  { name: 'avs-secondary', hex: '#F5EBE0', label: 'Lin naturel',  origin: 'Tissu Fulani' },
  { name: 'avs-accent',    hex: '#1D1D1B', label: 'Obsidienne',   origin: 'Basalte Kenya' },
  { name: 'avs-kente',     hex: '#D4A017', label: 'Or kente',     origin: 'Fil soie Asante' },
  { name: 'avs-ndop',      hex: '#4A6741', label: 'Vert Bamiléké',origin: 'Plantes indigo' },
  { name: 'avs-indigo',    hex: '#2A4A6B', label: 'Bleu bogolan', origin: 'Teinture Bambara' },
  { name: 'avs-earth',     hex: '#8B4513', label: 'Ocre savane',  origin: 'Argile du Sahel' },
  { name: 'avs-raffia',    hex: '#C8A96E', label: 'Raphia naturel', origin: 'Fibre de palmier' },
];

function PaletteGrid() {
  const { copied, copy } = useCopy();
  return (
    <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {PALETTE.map(({ name, hex, label, origin }) => (
        <button
          key={name}
          onClick={() => void copy(hex, name)}
          className="group overflow-hidden rounded-xl border border-avs-accent/9 text-left shadow-avs transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative h-16" style={{ background: hex }}>
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[10px] font-bold text-avs-secondary drop-shadow">{copied === name ? '✓ Copié !' : 'Copier HEX'}</span>
            </div>
          </div>
          <div className="bg-avs-secondary p-2.5">
            <p className="font-mono text-[9px] text-avs-accent/32">{hex}</p>
            <p className="mt-0.5 text-[11px] font-bold text-avs-accent">{label}</p>
            <p className="mt-0.5 font-mono text-[8px] text-avs-accent/32">{name}</p>
            <p className="mt-0.5 text-[8px] italic text-avs-accent/25">{origin}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

const TOC: DocTocEntry[] = [{ id: 'explication', label: 'Palette principale', level: 2 }, { id: 'exemples', label: 'Variables CSS', level: 2 }];

export default function PalettePrincipalePage() {
  return (
    <DocPageTemplate
      space={{ label: 'Couleurs', color: '#8B4513', icon: 'palette' }}
      title="Palette principale"
      summary="Huit couleurs extraites de pigments et teintures naturelles africaines, chacune documentée avec sa source ethnographique."
      explanation={<PaletteGrid />}
      interactive={
        <CodeBlock id="css-vars" lang="css" title="avs-tokens.css" code={`:root {
  --avs-primary:   #C0573E;
  --avs-secondary: #F5EBE0;
  --avs-accent:    #1D1D1B;
  --avs-kente:     #D4A017;
  --avs-ndop:      #4A6741;
  --avs-indigo:    #2A4A6B;
  --avs-earth:     #8B4513;
  --avs-raffia:    #C8A96E;
}`} />
      }
      toc={TOC}
      prev={{ href: '/documentation/motifs/bogolan-fanga', title: 'Bogolan Fanga' }}
      next={{ href: '/documentation/tokens/reference', title: 'Design Tokens' }}
    />
  );
}