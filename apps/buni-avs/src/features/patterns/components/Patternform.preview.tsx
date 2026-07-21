'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FORM_STEPS } from '../constants/pattern.constants';
import type { Step1Data, Step2Data, Step3Data } from '../types';

interface LivePreviewSidebarProps {
  currentStep: number;
  step1: Partial<Step1Data>;
  step2: Partial<Step2Data>;
  step3: Partial<Step3Data>;
  previewCSS: string;
  svgFile?: File | null;
  initialPattern?: any;
}

export function LivePreviewSidebar({
  currentStep, step1, step2, step3, previewCSS, svgFile, initialPattern,
}: LivePreviewSidebarProps) {
  return (
    <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">

      {/* Pattern card preview */}
      <div className="avs-card overflow-hidden">
        {/* Pattern thumbnail */}
        <div className="relative h-36 overflow-hidden bg-avs-secondary-dark">
          <AnimatePresence mode="wait">
            {svgFile ? (
              <motion.img
                key="new-file"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                src={URL.createObjectURL(svgFile)}
                alt="Pattern preview"
                className="absolute inset-0 object-cover"
              />
            ) : initialPattern?.imgUrl ? (
              <motion.img
                key="existing-image"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                src={initialPattern.imgUrl}
                alt="Pattern preview"
                className="absolute inset-0 object-cover"
              />
            ) : (
              <motion.div
                key={previewCSS}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`${previewCSS} absolute inset-0`}
                aria-hidden
              />
            )}
          </AnimatePresence>

          {/* Color swatches */}
          {(step3.colors ?? []).length > 0 && (
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              {(step3.colors ?? []).slice(0, 3).map((c) => (
                <span
                  key={c.hex}
                  className="h-5 w-5 rounded-lg shadow-sm ring-1 ring-black/20"
                  style={{ background: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Card info */}
        <div className="p-4">
          {step1.patternType && (
            <div className="mb-2">
              <span className="avs-badge border border-avs-primary/20 bg-avs-primary/10 text-avs-primary">
                {step1.patternType}
              </span>
            </div>
          )}

          <p className="font-display text-sm font-bold leading-tight tracking-tight text-avs-accent">
            {step1.nameEn || (
              <span className="text-avs-accent/30">Nom du motif</span>
            )}
          </p>

          <p className="mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-avs-primary">
            {step1.patternType ?? '—'} · {step1.country ?? '??'}
          </p>

          {step1.kingdom && (
            <p className="mt-0.5 text-[11px] text-avs-accent/40">{step1.kingdom}</p>
          )}

          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-avs-accent/60">
            {step2.summary || (
              <span className="text-avs-accent/25">Description apparaîtra ici…</span>
            )}
          </p>

          {(step2.symbolism?.keywords ?? []).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {(step2.symbolism?.keywords ?? []).slice(0, 4).map((kw) => (
                <span
                  key={kw}
                  className="rounded-md bg-avs-primary/10 px-2 py-0.5 font-mono text-[9px] font-medium text-avs-primary"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-avs-accent/30">
        Aperçu en temps réel
      </p>

      {/* Step progress mini */}
      <div className="avs-card p-4">
        <p className="avs-label mb-3">Progression</p>
        <div className="space-y-2">
          {FORM_STEPS.map(({ label }, i) => (
            <div key={label} className="flex items-center gap-2.5">
              <div
                className={`
                  flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold
                  ${i < currentStep
                    ? 'bg-avs-primary text-avs-secondary'
                    : i === currentStep
                      ? 'border border-avs-primary/20 bg-avs-primary/10 text-avs-primary'
                      : 'border border-avs-accent/15 bg-avs-secondary text-avs-accent/30'
                  }
                `}
              >
                {i < currentStep ? <Check size={10} strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-medium ${i === currentStep ? 'text-avs-accent' : 'text-avs-accent/40'}`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}