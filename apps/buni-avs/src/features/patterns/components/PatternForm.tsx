'use client';

import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles, CheckCircle2, FileText, Hourglass } from 'lucide-react';
import { useEffect } from 'react';

import { BuniLoader } from '@buni/ui';
import {CSS_PATTERN_MAP, FALLBACK_PATTERN_CSS } from '@buni/patterns';
import {  FORM_STEPS } from '../constants/pattern.constants';
import type { Pattern } from '@buni/patterns';

import { Step1 } from './steps/step1';
import { Step2 } from './steps/step2';
import { Step3 } from './steps/step3';
import { Step4 } from './steps/step4';
import { LivePreviewSidebar } from './Patternform.preview';
import { usePatternForm } from '../hooks/Usepatternform';

// ─────────────────────────────────────────────────────────────────────────────
// STEPPER
// ─────────────────────────────────────────────────────────────────────────────

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-10 flex items-center">
      {FORM_STEPS.map(({ label }, i) => (
        <div key={label} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={i <= currentStep ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={`
                flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300
                ${i < currentStep
                  ? 'bg-avs-primary text-avs-secondary'
                  : i === currentStep
                    ? 'bg-avs-primary text-avs-secondary ring-4 ring-avs-primary/15'
                    : 'border border-avs-accent/15 bg-avs-secondary text-avs-accent/30'
                }
              `}
            >
              {i < currentStep ? <Check size={13} strokeWidth={3} /> : <span>{i + 1}</span>}
            </motion.div>
            <span
              className={`
                hidden sm:block font-mono text-[9px] font-bold uppercase tracking-[0.14em] whitespace-nowrap
                ${i === currentStep ? 'text-avs-primary' : 'text-avs-accent/30'}
              `}
            >
              {label}
            </span>
          </div>

          {i < FORM_STEPS.length - 1 && (
            <div className="relative mx-3 h-px flex-1 overflow-hidden bg-avs-accent/15">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-avs-primary"
                animate={{ width: i < currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FORM
// ─────────────────────────────────────────────────────────────────────────────

interface PatternFormProps {
  initialPattern?: Pattern;
}

export function PatternForm({ initialPattern }: PatternFormProps) {
  const router = useRouter();
  const form   = usePatternForm(initialPattern);

  const {
    currentStep, loading, errors,
    step1, step2, step3,
    svgFile, newKeyword,
    setStep1, setStep2, setStep3,
    setSvgFile, setNewKeyword,
    goNext, goPrev,
    addKeyword, removeKeyword,
    updateColor, addColor, removeColor,
    updateSource, addSource, removeSource,
    updateSymbol, addSymbol, removeSymbol,
    submit,
  } = form;

  const previewCSS =
  step1.patternType ? CSS_PATTERN_MAP[(step1.patternType.toLowerCase()) as keyof typeof CSS_PATTERN_MAP] : CSS_PATTERN_MAP.ndop ??
  FALLBACK_PATTERN_CSS;
  const progress   = (currentStep / (FORM_STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-avs-secondary">

      {/* ── Loading overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-avs-accent/60 backdrop-blur-sm"
          >
            <BuniLoader size={80} showText={false} theme="dark" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky header ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-avs-accent/10 bg-avs-secondary/95 backdrop-blur-xl">
        {/* Progress bar */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-avs-accent/10">
          <motion.div
            className="h-full rounded-full bg-avs-primary"
            style={{ originX: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            aria-label="Retour"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-avs-accent/15 text-avs-accent/40 transition-all duration-150 hover:border-avs-accent/25 hover:text-avs-accent"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-black tracking-tight text-avs-accent">
                {initialPattern ? 'Modifier Motif' : 'Nouveau Motif'}
              </h1>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentStep}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-lg border border-avs-primary/20 bg-avs-primary/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-avs-primary"
                >
                  {FORM_STEPS[currentStep]?.label}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="mt-0.5 text-[11px] text-avs-accent/40">
              Étape {currentStep + 1} / {FORM_STEPS.length} — {FORM_STEPS[currentStep]?.desc}
            </p>
          </div>

        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Stepper currentStep={currentStep} />

        <div className="grid gap-6 lg:grid-cols-[1fr_272px]">

          {/* ── Form panel ──────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="avs-card overflow-hidden"
            >
              <div className="avs-pattern-ndop-sultan h-1 w-full" aria-hidden />

              <div className="space-y-6 p-7">

                {currentStep === 0 && (
                  <Step1
                    data={step1}
                    errors={errors}
                    onChange={(patch) => setStep1((f) => ({ ...f, ...patch }))}
                  />
                )}

                {currentStep === 1 && (
                  <Step2
                    data={step2}
                    errors={errors}
                    newKeyword={newKeyword}
                    onChange={(patch) => setStep2((f) => ({ ...f, ...patch }))}
                    onNewKeywordChange={setNewKeyword}
                    onAddKeyword={addKeyword}
                    onRemoveKeyword={removeKeyword}
                  />
                )}

                {currentStep === 2 && (
                  <Step3
                    data={step3}
                    errors={errors}
                    svgFile={svgFile}
                    onChange={(patch) => setStep3((f) => ({ ...f, ...patch }))}
                    onSvgFileChange={setSvgFile}
                    onUpdateColor={updateColor}
                    onAddColor={addColor}
                    onRemoveColor={removeColor}
                    onUpdateSource={updateSource}
                    onAddSource={addSource}
                    onRemoveSource={removeSource}
                    onUpdateSymbol={updateSymbol}
                    onAddSymbol={addSymbol}
                    onRemoveSymbol={removeSymbol}
                  />
                )}

                {currentStep === 3 && (
                  <Step4 step1={step1} step2={step2} step3={step3} errors={errors} />
                )}

                {/* ── Navigation ──────────────────────────────────────── */}
                <div className="flex items-center justify-between border-t border-avs-accent/10 pt-5">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={currentStep === 0}
                    className="avs-btn-secondary flex items-center gap-2 disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowLeft size={13} /> Précédent
                  </button>

                  {currentStep < FORM_STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="avs-btn-primary group relative flex items-center gap-2 overflow-hidden"
                    >
                      <span
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                        aria-hidden
                      />
                      Suivant <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void submit()}
                      disabled={loading}
                      aria-busy={loading}
                      className="avs-btn-primary group relative flex items-center gap-2 overflow-hidden disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                        aria-hidden
                      />
                      {loading ? (
                        <>
                          <BuniLoader size={16} showText={false} theme="dark" />
                          <span className="animate-pulse">Envoi en cours…</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} /> {initialPattern ? 'Mettre à jour le motif' : 'Soumettre pour révision'}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Sidebar preview ─────────────────────────────────────────── */}
          <LivePreviewSidebar
            currentStep={currentStep}
            step1={step1}
            step2={step2}
            step3={step3}
            previewCSS={previewCSS}
            svgFile={svgFile}
            initialPattern={initialPattern}
          />
        </div>
      </div>
    </div>
  );
}