'use client';

import { useState } from 'react';

export function HexColorField({ hex, onChange }: { hex: string; onChange: (hex: string) => void }) {
  const [draft, setDraft] = useState(hex);

  const commit = (value: string) => {
    const v = value.startsWith('#') ? value : `#${value}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-avs-accent/15">
        <input
          type="color"
          value={hex}
          onChange={(e) => { setDraft(e.target.value); onChange(e.target.value); }}
          className="absolute -left-1 -top-1 h-11 w-11 cursor-pointer border-none p-0"
          aria-label="Choisir une couleur personnalisée"
        />
      </label>
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') commit((e.target as HTMLInputElement).value); }}
        placeholder="#C0573E"
        maxLength={7}
        className="w-24 rounded-lg border border-avs-accent/15 bg-avs-secondary px-2.5 py-1.5 font-mono text-xs text-avs-accent outline-none focus:border-avs-primary/50"
      />
    </div>
  );
}
