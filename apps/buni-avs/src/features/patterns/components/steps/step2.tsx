'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import type { Step2Data, FieldErrors } from '../../types';
import { SYMBOL_USAGES, FIELD_LIMITS } from '../../constants/pattern.constants';
import { CharCount, Field, PillBtn, StepTitle } from '../Patternform.primitives';


interface Step2Props {
  data: Partial<Step2Data>;
  errors: FieldErrors;
  newKeyword: string;
  onChange: (patch: Partial<Step2Data>) => void;
  onNewKeywordChange: (val: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (kw: string) => void;
}

export function Step2({
  data, errors, newKeyword,
  onChange, onNewKeywordChange, onAddKeyword, onRemoveKeyword,
}: Step2Props) {
  return (
    <div className="space-y-6">
      <StepTitle title="Description & Symbolisme" sub="Étape 2" />

      <Field label="Résumé" error={errors['summary']} required>
        <textarea
          rows={2}
          className="avs-input resize-none"
          value={data.summary ?? ''}
          onChange={(e) => onChange({ summary: e.target.value })}
          placeholder="Brève description utilisée dans les listes et aperçus…"
        />
        <CharCount value={data.summary ?? ''} max={FIELD_LIMITS.summary} />
      </Field>

      <Field label="Histoire" error={errors['history']} required>
        <textarea
          rows={3}
          className="avs-input resize-none"
          value={data.history ?? ''}
          onChange={(e) => onChange({ history: e.target.value })}
          placeholder="Contexte historique détaillé, évolution au fil du temps…"
        />
        <CharCount value={data.history ?? ''} max={FIELD_LIMITS.history} />
      </Field>

      <Field label="Technique de fabrication" error={errors['technique']} required>
        <textarea
          rows={3}
          className="avs-input resize-none"
          value={data.technique ?? ''}
          onChange={(e) => onChange({ technique: e.target.value })}
          placeholder="Matériaux, savoir-faire, étapes de fabrication…"
        />
        <CharCount value={data.technique ?? ''} max={FIELD_LIMITS.technique} />
      </Field>

      <Field label="Signification symbolique" error={errors['symbolism.meaning']} required>
        <textarea
          rows={2}
          className="avs-input resize-none"
          value={data.symbolism?.meaning ?? ''}
          onChange={(e) => onChange({ symbolism: { meaning: e.target.value, usage: data.symbolism?.usage ?? '', keywords: data.symbolism?.keywords ?? [] } })}
          placeholder="Royauté, spiritualité, protection contre les mauvais esprits…"
        />
      </Field>

      <Field label="Usage principal" error={errors['symbolism.usage']} required>
        <textarea
          rows={2}
          className="avs-input resize-none"
          value={data.symbolism?.usage ?? ''}
          onChange={(e) => onChange({ symbolism: { meaning: data.symbolism?.meaning ?? '', usage: e.target.value, keywords: data.symbolism?.keywords ?? [] } })}
          placeholder="en quel evenement est-ce exactement utiliser…"
        />
      </Field>

      

      <Field label="Usage cérémoniel" error={errors['ceremonial']} required>
        <textarea
          rows={2}
          className="avs-input resize-none"
          value={data.ceremonial ?? ''}
          onChange={(e) => onChange({ ceremonial: e.target.value })}
          placeholder="Contextes cérémoniels où le motif est utilisé…"
        />
        <CharCount value={data.ceremonial ?? ''} max={FIELD_LIMITS.ceremonial} />
      </Field>

      {/* Keywords */}
      <Field label={`Mots-clés (1–${FIELD_LIMITS.keywordsMax})`} error={errors['symbolism.keywords']} required>
        <div className="flex gap-2">
          <input
            className="avs-input flex-1"
            value={newKeyword}
            onChange={(e) => onNewKeywordChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddKeyword(); } }}
            placeholder="Ajouter un mot-clé puis Entrée…"
          />
          <button
            type="button"
            onClick={onAddKeyword}
            className="avs-btn-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl p-0"
          >
            <Plus size={15} />
          </button>
        </div>

        <AnimatePresence>
          {(data.symbolism?.keywords ?? []).length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2.5 flex flex-wrap gap-1.5 overflow-hidden"
            >
              {(data.symbolism?.keywords ?? []).map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1.5 rounded-lg border border-avs-primary/20 bg-avs-primary/10 px-3 py-1.5 font-mono text-xs font-medium text-avs-primary"
                >
                  {kw}
                  <button
                    type="button"
                    aria-label={`Supprimer ${kw}`}
                    onClick={() => onRemoveKeyword(kw)}
                    className="text-avs-primary/60 transition-colors hover:text-red-500"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Field>
    </div>
  );
}