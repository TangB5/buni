'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Save } from 'lucide-react';
import { Combo, Role, ComboColor } from '../data';
import { RoleSlot } from './role-slot';
import { UsageExamples } from './usage-examples';

function makeEmptyCustomCombo(): Combo {
  return {
    id: `custom-${Date.now()}`,
    name: 'Mon combo',
    origin: 'Créé par vous',
    description: 'Une combinaison de couleurs personnalisée.',
    patternCSS: 'avs-pattern-wax-dakar',
    accentClass: 'text-avs-primary',
    accentHex: '#C0573E',
    colors: [
      { role: 'primary',   name: 'custom-primary',   hex: '#C0573E', meaning: '', origin: 'Personnalisé', css: '--custom-primary'   },
      { role: 'secondary', name: 'custom-secondary', hex: '#F5EBE0', meaning: '', origin: 'Personnalisé', css: '--custom-secondary' },
      { role: 'accent',    name: 'custom-accent',    hex: '#1D1D1B', meaning: '', origin: 'Personnalisé', css: '--custom-accent'    },
      { role: 'neutral',   name: 'custom-neutral',   hex: '#B0C4C8', meaning: '', origin: 'Personnalisé', css: '--custom-neutral'   },
    ],
  };
}

export function CustomPaletteBuilder({
  onSave, onCancel,
}: {
  onSave: (combo: Combo) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Combo>(makeEmptyCustomCombo);

  const updateColor = (role: Role, next: ComboColor) => {
    setDraft((d) => ({
      ...d,
      colors: d.colors.map((c) => (c.role === role ? next : c)),
      accentHex: role === 'primary' ? next.hex : d.accentHex,
    }));
  };

  const roleLabels: Record<Role, string> = {
    primary: 'Couleur principale', secondary: 'Couleur secondaire',
    accent: "Couleur d'accent", neutral: 'Couleur neutre',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl border border-avs-accent/9 bg-avs-secondary p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-avs-primary/10">
            <Plus size={14} className="text-avs-primary" aria-hidden />
          </div>
          <h3 className="font-display text-base font-black text-avs-accent">Créer votre combo</h3>
        </div>
        <button
          onClick={onCancel}
          className="rounded-lg p-1.5 text-avs-accent/40 transition-colors hover:bg-avs-accent/5 hover:text-avs-accent"
          aria-label="Fermer le builder"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nom + origine */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-[9px] font-bold uppercase tracking-wide text-avs-accent/40">Nom</label>
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className="w-full rounded-lg border border-avs-accent/15 bg-avs-secondary px-3 py-2 text-sm text-avs-accent outline-none focus:border-avs-primary/50"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-[9px] font-bold uppercase tracking-wide text-avs-accent/40">Origine / inspiration</label>
          <input
            type="text"
            value={draft.origin}
            onChange={(e) => setDraft((d) => ({ ...d, origin: e.target.value }))}
            className="w-full rounded-lg border border-avs-accent/15 bg-avs-secondary px-3 py-2 text-sm text-avs-accent outline-none focus:border-avs-primary/50"
          />
        </div>
      </div>

      {/* 4 slots de rôle */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {draft.colors.map((c) => (
          <RoleSlot key={c.role} role={c.role} label={roleLabels[c.role]} color={c} onChange={(next) => updateColor(c.role, next)} />
        ))}
      </div>

      {/* Aperçu en direct */}
      <div className="mb-6 rounded-xl border border-avs-accent/9 bg-avs-accent/[0.02] p-4">
        <UsageExamples combo={draft} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSave(draft)}
          className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-avs-secondary transition-transform hover:-translate-y-0.5"
          style={{ background: draft.accentHex, boxShadow: `0 4px 16px ${draft.accentHex}30` }}
        >
          <Save size={14} aria-hidden />
          Enregistrer ce combo
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border border-avs-accent/15 px-5 py-3 text-sm font-semibold text-avs-accent/60 transition-colors hover:text-avs-accent"
        >
          Annuler
        </button>
      </div>
    </motion.div>
  );
}
