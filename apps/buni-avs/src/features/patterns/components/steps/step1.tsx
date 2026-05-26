'use client';

import type { Step1Data, FieldErrors } from '../../types';
import { PATTERN_TYPES, REGIONS, PATTERN_LICENSES,PatternType } from '@buni/patterns';
import { Field, PillBtn, SelectField, StepTitle } from '../Patternform.primitives';

interface Step1Props {
  data: Partial<Step1Data>;
  errors: FieldErrors;
  onChange: (patch: Partial<Step1Data>) => void;
}

export function Step1({ data, errors, onChange }: Step1Props) {
  return (
    <div className="space-y-6">
      <StepTitle title="Identité du motif" sub="Étape 1" />

      {/* Names */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom (français)" error={errors['nameFr']} required>
          <input
            className="avs-input"
            value={data.nameFr ?? ''}
            onChange={(e) => onChange({ nameFr: e.target.value })}
            placeholder="Ndop Royal Bamoum"
          />
        </Field>

        <Field label="Nom local" error={errors['nameLocal']} required>
          <input
            className="avs-input"
            value={data.nameLocal ?? ''}
            onChange={(e) => onChange({ nameLocal: e.target.value })}
            placeholder="Ndop (Ndoup)"
          />
        </Field>

        <Field label="Nom (anglais)" error={errors['nameEn']} required>
          <input
            className="avs-input"
            value={data.nameEn ?? ''}
            onChange={(e) => onChange({ nameEn: e.target.value })}
            placeholder="Bamoum Royal Ndop"
          />
        </Field>

        <Field label="Licence" error={errors['license']} required>
          <div className="mt-1 flex flex-wrap gap-2">
            {PATTERN_LICENSES.map((l) => (
              <PillBtn
                key={l}
                label={l}
                active={data.license === l}
                onClick={() => onChange({ license: l as Step1Data['license'] })}
              />
            ))}
          </div>
        </Field>
      </div>

      {/* Pattern type pills */}
      <Field label="Type de motif" error={errors['patternType']} required>
        <div className="mt-1 flex flex-wrap gap-2">
          {PATTERN_TYPES.map((t) => (
            <PillBtn
              key={t}
              label={t}
              active={data.patternType === t}
              onClick={() => onChange({ patternType: t })}
            />
          ))}
        </div>
      </Field>

      {/* Region + Country */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Région" error={errors['region']} required>
          <SelectField
            value={data.region ?? ''}
            onChange={(v) => onChange({ region: v as Step1Data['region'] })}
          >
            <option value="">Choisir…</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </SelectField>
        </Field>

        <Field
          label="Code pays (ISO 2)"
          error={errors['country']}
          required
          hint="Ex : CM pour Cameroun"
        >
          <input
            className="avs-input font-mono uppercase"
            maxLength={2}
            value={data.country ?? ''}
            onChange={(e) => onChange({ country: e.target.value.toUpperCase() })}
            placeholder="CM"
          />
        </Field>
      </div>

      {/* Optional fields */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Peuple / Ethnie">
          <input
            className="avs-input"
            value={data.people ?? ''}
            onChange={(e) => onChange({ people: e.target.value })}
            placeholder="Peuple Bamoum (Bamum)"
          />
        </Field>

        <Field label="Drapeau (emoji)">
          <input
            className="avs-input"
            value={data.flag ?? ''}
            onChange={(e) => onChange({ flag: e.target.value })}
            placeholder="🇨🇲"
            maxLength={8}
          />
        </Field>

        <Field label="Royaume">
          <input
            className="avs-input"
            value={data.kingdom ?? ''}
            onChange={(e) => onChange({ kingdom: e.target.value })}
            placeholder="Sultanat Bamoum"
          />
        </Field>

        <Field label="Époque">
          <input
            className="avs-input"
            value={data.era ?? ''}
            onChange={(e) => onChange({ era: e.target.value })}
            placeholder="XVIIe siècle — présent"
          />
        </Field>
      </div>

      {/* Coordinates */}
      <Field label="Coordonnées (latitude, longitude)">
        <div className="grid grid-cols-2 gap-2">
          <input
            className="avs-input"
            type="number"
            step="0.0001"
            value={data.coords?.[0] ?? ''}
            onChange={(e) =>
              onChange({ coords: [parseFloat(e.target.value) || 0, data.coords?.[1] ?? 0] })
            }
            placeholder="6.6885"
          />
          <input
            className="avs-input"
            type="number"
            step="0.0001"
            value={data.coords?.[1] ?? ''}
            onChange={(e) =>
              onChange({ coords: [data.coords?.[0] ?? 0, parseFloat(e.target.value) || 0] })
            }
            placeholder="11.1640"
          />
        </div>
      </Field>
    </div>
  );
}