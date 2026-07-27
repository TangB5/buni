'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Combo, ComboColor, Role } from '../data';
import { HexColorField } from './hex-color-field';
import { SwatchLibrary } from './swatch-library';

export function RoleSlot({
  role, label, color, onChange,
}: {
  role: Role; label: string; color: ComboColor; onChange: (c: ComboColor) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-avs-accent/9 bg-avs-secondary p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md border border-avs-accent/10" style={{ background: color.hex }} aria-hidden />
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-wide text-avs-accent/40">{role}</p>
            <p className="text-xs font-semibold text-avs-accent">{label}</p>
          </div>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-md px-2 py-1 font-mono text-[9px] font-bold text-avs-accent/40 transition-colors hover:text-avs-accent"
        >
          {open ? 'Fermer' : 'Changer'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-2.5 overflow-hidden pt-2.5"
          >
            <HexColorField hex={color.hex} onChange={(hex) => onChange({ ...color, hex })} />
            <SwatchLibrary onPick={(hex, name) => { onChange({ ...color, hex, name: name.toLowerCase().replace(/\s+/g, '-') }); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
