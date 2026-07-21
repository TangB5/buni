'use client';

import { useState } from 'react';
import { SwatchFamily } from '../data';
import { SWATCH_LIBRARY } from '../data';

export function SwatchLibrary({ onPick }: { onPick: (hex: string, name: string) => void }) {
  const [family, setFamily] = useState(SWATCH_LIBRARY[0]!.id);
  const active = SWATCH_LIBRARY.find((f) => f.id === family) ?? SWATCH_LIBRARY[0]!;

  return (
    <div className="rounded-xl border border-avs-accent/9 bg-avs-accent/[0.02] p-3">
      <div className="mb-2.5 flex flex-wrap gap-1">
        {SWATCH_LIBRARY.map((f) => (
          <button
            key={f.id}
            onClick={() => setFamily(f.id)}
            className={`rounded-md px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide transition-colors ${
              family === f.id ? 'bg-avs-primary text-avs-secondary' : 'text-avs-accent/40 hover:text-avs-accent/70'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {active.swatches.map((s) => (
          <button
            key={s.hex}
            onClick={() => onPick(s.hex, s.name)}
            title={`${s.name} — ${s.meaning}`}
            className="group relative h-9 w-full overflow-hidden rounded-md transition-transform hover:scale-110 hover:z-10"
            style={{ background: s.hex }}
          />
        ))}
      </div>
    </div>
  );
}
