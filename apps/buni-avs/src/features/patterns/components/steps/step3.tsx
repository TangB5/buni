'use client';

import { Check, Upload, X } from 'lucide-react';
import type { Step3Data, PatternColor, PatternSymbol, ArtisanQuote, FieldErrors } from '../../types';
import { Field, StepTitle, AddRowBtn } from '../Patternform.primitives';

interface Step3Props {
  data: Partial<Step3Data>;
  errors: FieldErrors;
  svgFile: File | null;
  onChange: (patch: Partial<Step3Data>) => void;
  onSvgFileChange: (file: File | null) => void;
  onUpdateColor: (i: number, patch: Partial<PatternColor>) => void;
  onAddColor: () => void;
  onRemoveColor: (i: number) => void;
  onUpdateSource: (i: number, val: string) => void;
  onAddSource: () => void;
  onRemoveSource: (i: number) => void;
  onUpdateSymbol: (i: number, patch: Partial<PatternSymbol>) => void;
  onAddSymbol: () => void;
  onRemoveSymbol: (i: number) => void;
}

export function Step3({
  data, errors, svgFile,
  onChange, onSvgFileChange,
  onUpdateColor, onAddColor, onRemoveColor,
  onUpdateSource, onAddSource, onRemoveSource,
  onUpdateSymbol, onAddSymbol, onRemoveSymbol,
}: Step3Props) {
  return (
    <div className="space-y-6">
      <StepTitle title="Couleurs & Assets" sub="Étape 3" />

      {/* ── Color Palette ─────────────────────────────────────────────────── */}
      <Field label="Palette de couleurs" required error={errors['colors']}>
        <div className="space-y-3">
          {(data.colors ?? []).map((color, i) => (
            <div
              key={i}
              className="avs-card flex flex-col gap-3 p-2 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-3">
                <label className="relative shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => onUpdateColor(i, { hex: e.target.value })}
                    className="sr-only"
                  />
                  <div
                    className="h-10 w-10 rounded-xl ring-1 ring-black/10 transition-transform hover:scale-105"
                    style={{ background: color.hex, boxShadow: `0 2px 8px ${color.hex}40` }}
                  />
                </label>
                <input
                  className="avs-input w-30 font-mono text-sm uppercase"
                  maxLength={7}
                  value={color.hex}
                  onChange={(e) => onUpdateColor(i, { hex: e.target.value })}
                  placeholder="#C0573E"
                />
              </div>

              <div className="flex min-w-0 flex-1 gap-3">
                <input
                  className="avs-input min-w-0 flex-1"
                  value={color.name}
                  onChange={(e) => onUpdateColor(i, { name: e.target.value })}
                  placeholder="Nom de la couleur"
                />
                <input
                  className="avs-input min-w-0 flex-1"
                  value={color.meaning}
                  onChange={(e) => onUpdateColor(i, { meaning: e.target.value })}
                  placeholder="Signification"
                />
              </div>

              <button
                type="button"
                onClick={() => onRemoveColor(i)}
                className="shrink-0 rounded-lg p-2 text-avs-accent/30 transition-colors hover:bg-red-50 hover:text-red-500 sm:self-start"
              >
                <X size={15} />
              </button>
            </div>
          ))}

          {/* Palette bar preview */}
          {(data.colors ?? []).length > 0 && (
            <div className="flex h-2.5 overflow-hidden rounded-full">
              {(data.colors ?? []).map((c) => (
                <div key={c.hex} className="flex-1" style={{ background: c.hex }} title={c.name} />
              ))}
            </div>
          )}

          <AddRowBtn label="+ Ajouter une couleur" onClick={onAddColor} />
        </div>
      </Field>

      {/* ── CSS class ─────────────────────────────────────────────────────── */}
      <Field label="Classe CSS du pattern" hint="Ex : avs-pattern-ndop-sultan">
        <input
          className="avs-input font-mono"
          value={data.svgPattern ?? ''}
          onChange={(e) => onChange({ svgPattern: e.target.value })}
          placeholder="avs-pattern-ndop-sultan"
        />
      </Field>

      {/* ── SVG upload ────────────────────────────────────────────────────── */}
      <Field label="Fichier SVG du motif" hint="SVG uniquement · max 2 Mo · Optionnel">
        <label
          className={`
            group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition-all duration-200
            ${svgFile
              ? 'border-avs-primary/40 bg-avs-primary/5'
              : 'border-avs-accent/15 bg-avs-secondary hover:border-avs-primary/25'
            }
          `}
        >
          <div
            className={`
              flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105
              ${svgFile
                ? 'border-avs-primary/20 bg-avs-primary/10 text-avs-primary'
                : 'border-avs-accent/10 bg-avs-secondary text-avs-accent/30'
              }
            `}
          >
            {svgFile ? <Check size={22} /> : <Upload size={22} />}
          </div>

          {svgFile ? (
            <div className="text-center">
              <p className="text-sm font-semibold text-avs-primary">{svgFile.name}</p>
              <p className="mt-0.5 text-xs text-avs-accent/40">
                {(svgFile.size / 1024).toFixed(1)} Ko
              </p>
            </div>
          ) : (
            <p className="text-sm text-avs-accent/40">
              Glisser-déposer ou{' '}
              <span className="font-semibold text-avs-primary">parcourir</span>
            </p>
          )}
          <input
            type="file"
            accept=".svg"
            className="sr-only"
            onChange={(e) => onSvgFileChange(e.target.files?.[0] ?? null)}
          />
        </label>

        {svgFile && (
          <button
            type="button"
            onClick={() => onSvgFileChange(null)}
            className="mt-2 flex items-center gap-1.5 text-xs text-avs-accent/40 transition-colors hover:text-red-500"
          >
            <X size={11} /> Supprimer le fichier
          </button>
        )}
      </Field>

      {/* ── Artisan quote ─────────────────────────────────────────────────── */}
      <Field label="Citation d'artisan (optionnel)">
        <div className="space-y-3">
          <textarea
            rows={2}
            className="avs-input resize-none"
            value={data.artisanQuote?.text ?? ''}
            onChange={(e) =>
              onChange({
                artisanQuote: {
                  ...(data.artisanQuote ?? { author: '', role: '', country: '' }),
                  text: e.target.value,
                },
              })
            }
            placeholder="Le Kente ne se porte pas, il se lit. Chaque fil est une lettre…"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {(['author', 'role', 'country'] as const).map((field) => (
              <input
                key={field}
                className="avs-input"
                value={data.artisanQuote?.[field] ?? ''}
                onChange={(e) =>
                  onChange({
                    artisanQuote: {
                      text: data.artisanQuote?.text ?? '',
                      author: data.artisanQuote?.author ?? '',
                      role: data.artisanQuote?.role ?? '',
                      country: data.artisanQuote?.country ?? '',
                      [field]: e.target.value,
                    },
                  })
                }
                placeholder={
                  field === 'author' ? "Nom de l'artisan"
                  : field === 'role'  ? 'Rôle'
                  : 'Pays'
                }
              />
            ))}
          </div>
        </div>
      </Field>

      {/* ── Sources ───────────────────────────────────────────────────────── */}
      <Field label="Sources et références" required error={errors['sources']}>
        <div className="space-y-2">
          {(data.sources ?? []).map((src, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="avs-input flex-1"
                value={src}
                onChange={(e) => onUpdateSource(i, e.target.value)}
                placeholder="Livre, article, site web…"
              />
              <button
                type="button"
                onClick={() => onRemoveSource(i)}
                className="shrink-0 rounded-lg p-2 text-avs-accent/30 transition-colors hover:text-red-500"
              >
                <X size={15} />
              </button>
            </div>
          ))}
          <AddRowBtn label="+ Ajouter une source" onClick={onAddSource} />
        </div>
      </Field>

      {/* ── Symbols ───────────────────────────────────────────────────────── */}
      <Field label="Symboles constitutifs" required error={errors['symbols']}>
        <div className="space-y-4">
          {(data.symbols ?? []).map((sym, i) => (
            <SymbolCard
              key={i}
              index={i}
              symbol={sym}
              onChange={(patch) => onUpdateSymbol(i, patch)}
              onRemove={() => onRemoveSymbol(i)}
            />
          ))}
          <AddRowBtn label="+ Ajouter un symbole" onClick={onAddSymbol} />
        </div>
      </Field>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SYMBOL CARD — sub-component
// ─────────────────────────────────────────────────────────────────────────────

function SymbolCard({
  index, symbol, onChange, onRemove,
}: {
  index: number;
  symbol: PatternSymbol;
  onChange: (patch: Partial<PatternSymbol>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="avs-card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-avs-accent/40">
          Symbole {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-1.5 text-avs-accent/30 transition-colors hover:text-red-500"
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="avs-input"
          value={symbol.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Symbol name (en)"
        />
        <input
          className="avs-input"
          value={symbol.nameFr}
          onChange={(e) => onChange({ nameFr: e.target.value })}
          placeholder="Nom français"
        />
      </div>

      <input
        className="avs-input font-mono"
        value={symbol.cssPreview}
        onChange={(e) => onChange({ cssPreview: e.target.value })}
        placeholder="Couleur HEX ou classe CSS (#D4A017)"
      />

      <textarea
        rows={2}
        className="avs-input resize-none"
        value={symbol.meaning}
        onChange={(e) => onChange({ meaning: e.target.value })}
        placeholder="Signification du symbole…"
      />

      <textarea
        rows={2}
        className="avs-input resize-none"
        value={symbol.usage}
        onChange={(e) => onChange({ usage: e.target.value })}
        placeholder="Usage du symbole…"
      />

      <label className="flex cursor-pointer items-center gap-2 text-sm text-avs-accent/70">
        <input
          type="checkbox"
          checked={symbol.sacred}
          onChange={(e) => onChange({ sacred: e.target.checked })}
          className="rounded accent-avs-primary"
        />
        Symbole sacré
      </label>

      {/* Symbol image upload */}
      <div>
        <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-avs-accent/40">
          Image du symbole
        </p>
        <label
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-avs-accent/20 p-4 transition-colors hover:border-avs-primary/40 hover:bg-avs-accent/5"
          htmlFor={`symbol-image-${index}`}
        >
          {symbol.image ? (
            <div className="flex items-center gap-2">
              <img
                src={URL.createObjectURL(symbol.image)}
                alt=""
                className="h-8 w-8 rounded object-cover"
              />
              <span className="text-xs text-avs-accent/60">{symbol.image.name}</span>
            </div>
          ) : (
            <>
              <Upload size={16} className="text-avs-accent/40" />
              <span className="text-xs text-avs-accent/40">Cliquer pour uploader</span>
            </>
          )}
        </label>
        <input
          id={`symbol-image-${index}`}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange({ image: file });
          }}
        />
      </div>
    </div>
  );
}