'use client';

import type { Step1Data, Step2Data, Step3Data, FieldErrors } from '../../types';
import { REGIONS } from '../../constants/pattern.constants';
import { StepTitle } from '../Patternform.primitives';

interface Step4Props {
  step1: Partial<Step1Data>;
  step2: Partial<Step2Data>;
  step3: Partial<Step3Data>;
  errors: FieldErrors;
}

export function Step4({ step1, step2, step3, errors }: Step4Props) {
  const rows = [
    { label: 'Nom FR',    value: step1.nameFr },
    { label: 'Nom EN',    value: step1.nameEn },
    { label: 'Type',      value: step1.patternType?.toUpperCase() },
    { label: 'Région',    value: step1.region },
    { label: 'Pays',      value: step1.country },
    { label: 'Peuple',    value: step1.people },
    { label: 'Royaume',   value: step1.kingdom },
    { label: 'Époque',    value: step1.era },
    { label: 'Usage',     value: step2.symbolUsage },
    { label: 'Licence',   value: step1.license?.toUpperCase() },
    { label: 'Mots-clés', value: (step2.symbolKeywords ?? []).join(', ') },
  ].filter((r) => r.value);

  return (
    <div className="space-y-6">
      <StepTitle title="Révision finale" sub="Étape 4" />

      {/* Data rows */}
      <div className="space-y-1.5">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-avs-accent/10 bg-avs-secondary-dark px-4 py-2.5"
          >
            <span className="w-24 shrink-0 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-avs-accent/40">
              {label}
            </span>
            <span className="text-sm font-medium text-avs-accent">{value}</span>
          </div>
        ))}

        {/* Color swatches row */}
        {(step3.colors ?? []).length > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-avs-accent/10 bg-avs-secondary-dark px-4 py-2.5">
            <span className="w-24 shrink-0 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-avs-accent/40">
              Palette
            </span>
            <div className="flex gap-2">
              {(step3.colors ?? []).map((c) => (
                <span
                  key={c.hex}
                  className="h-5 w-5 rounded-lg ring-1 ring-black/10"
                  style={{ background: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Validation notice */}
      <div
        className="rounded-xl border border-avs-kente/20 bg-avs-kente/8 p-4 text-sm leading-relaxed"
        style={{ borderLeftWidth: 3, borderLeftColor: 'var(--color-avs-kente)' }}
      >
        <p className="mb-1.5 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-avs-kente">
          Processus de validation
        </p>
        <p className="text-avs-accent/60">
          Votre motif sera relu par un curateur AVS avant publication. Ce processus prend
          généralement{' '}
          <strong className="text-avs-accent">24–48h ouvrées</strong>.
        </p>
      </div>

      {/* Submit error */}
      {errors['submit'] && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {errors['submit']}
        </div>
      )}
    </div>
  );
}