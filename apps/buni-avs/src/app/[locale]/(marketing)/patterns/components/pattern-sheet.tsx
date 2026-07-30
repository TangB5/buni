'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyBtn } from './copy-btn';
import { ShareMenu } from './share-menu';
import { LicenseBadge } from './license-badge';
import { MetaChip } from './meta-chip';
import { downloadPattern } from '@/features/patterns/usecases/download-pattern.usecase';
import { useToast, BuniLoader } from '@buni/ui';
import { formatNumber } from '@buni/utils';

const SECTIONS = [
  { id: 'histoire', label: 'Histoire' },
  { id: 'technique', label: 'Technique' },
  { id: 'symbolisme', label: 'Symbolisme' },
  { id: 'ceremoniel', label: 'Cérémoniel' },
  { id: 'sources', label: 'Sources' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

export function PatternSheet({ pattern }: { pattern: any }) {
  const [activeSymbol, setActiveSymbol] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('histoire');
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { add } = useToast();

  const handleDownload = async (id: string, slug: string) => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await downloadPattern(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}.svg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      add({
        variant: 'success',
        title: 'Téléchargement réussi',
        message: `Le pattern ${pattern.name} a été téléchargé avec succès.`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      add({
        variant: 'error',
        title: 'Échec du téléchargement',
        message: 'Une erreur est survenue lors du téléchargement. Veuillez réessayer.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSymbol(null);
    setActiveSection('histoire');
  }, [pattern.id]);

  return (
    <div
      ref={contentRef}
      className="border-avs-accent/10 h-full overflow-y-auto border [scrollbar-width:thin]"
    >
      {/* Cover - Pattern Preview */}
      <div className="bg-avs-secondary-dark relative h-64 overflow-hidden sm:h-96">
        {pattern.imgUrl ? (
          <img
            src={pattern.imgUrl}
            alt={pattern.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className={`${pattern.cssClass} absolute inset-0 scale-150`} />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/10" />

        {/* Top-left badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 sm:top-6 sm:left-6">
          <span className="bg-avs-primary/90 text-avs-secondary rounded-lg px-2.5 py-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase shadow-lg backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-[9px]">
            {pattern.type}
          </span>
          <LicenseBadge license={pattern.license} />
        </div>

        {/* Top-right stats */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 sm:top-6 sm:right-6 sm:gap-2">
          <span className="text-avs-secondary flex items-center gap-1.5 rounded-lg bg-black/30 px-2.5 py-1 font-mono text-[9px] font-semibold backdrop-blur-md sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[10px]">
            <i className="pi pi-download" style={{ fontSize: '9px' }} />{' '}
            {formatNumber(pattern.downloads)}
          </span>
          <span className="text-avs-secondary flex items-center gap-1.5 rounded-lg bg-black/30 px-2.5 py-1 font-mono text-[9px] font-semibold backdrop-blur-md sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[10px]">
            <i className="pi pi-eye" style={{ fontSize: '9px' }} /> {formatNumber(pattern.views)}{' '}
            vues
          </span>
        </div>

        {/* Bottom pattern info overlay */}
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-16 sm:p-6 sm:pt-20">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div className="flex-1">
              <h1 className="font-display text-avs-secondary text-2xl font-black tracking-tight drop-shadow-lg sm:text-4xl">
                {pattern.name}
              </h1>
              <p className="text-avs-secondary/80 mt-1 font-mono text-xs italic drop-shadow sm:text-sm">
                {pattern.localName}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(pattern.id, pattern.slug)}
                disabled={isDownloading}
                className="group bg-avs-primary text-avs-secondary relative flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-xs font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-3 sm:text-sm"
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  aria-hidden
                />
                {isDownloading ? (
                  <>
                    <BuniLoader size={18} showText={false} theme="dark" />
                    <span>Téléchargement...</span>
                  </>
                ) : (
                  <>
                    <i className="pi pi-download" style={{ fontSize: '13px' }} /> Télécharger SVG
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-avs-secondary px-5 pt-6 pb-14 sm:px-7 sm:pt-8">
        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <CopyBtn text={`.${pattern.cssClass}`} label="Copier classe CSS" />
            <ShareMenu pattern={pattern} />
          </div>
        </div>

        {/* Meta chips */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
          <MetaChip icon="pi-users" label="Peuple" value={pattern.origin.people} />
          <MetaChip icon="pi-map-marker" label="Région" value={pattern.origin.region} />
          <MetaChip
            icon="pi-map-marker"
            label="Pays"
            value={`${pattern.origin.flag} ${pattern.origin.country}`}
          />
          <MetaChip icon="pi-calendar" label="Époque" value={pattern.era} />
        </div>

        {/* Summary */}
        <p className="text-avs-accent/70 mb-8 text-sm leading-[1.85]">{pattern.summary}</p>
      </div>

      {/* Interactive Pattern Viewer */}
      <div className="border-avs-accent/10 mb-7 border-b px-6 pb-7">
        <h3 className="font-display text-avs-accent mb-4 flex items-center gap-2 text-base font-bold">
          <span className="bg-avs-primary/10 text-avs-primary flex h-5 w-5 items-center justify-center rounded-lg">
            <i className="pi pi-layer-group" style={{ fontSize: '11px' }} />
          </span>
          Palette culturelle
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {pattern.colors.map(({ hex, name, meaning }: any) => (
            <div
              key={hex}
              className="bg-avs-secondary-dark border-avs-accent/10 hover:border-avs-primary/20 flex items-start gap-4 rounded-xl border p-4 transition-all"
            >
              <div
                className="h-12 w-12 shrink-0 rounded-xl ring-1 ring-black/10 transition-transform hover:scale-105 dark:ring-white/10"
                style={{ background: hex, boxShadow: `0 4px 12px ${hex}40` }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-avs-accent text-sm font-bold">{name}</p>
                  <span className="text-avs-accent/40 font-mono text-[10px]">{hex}</span>
                </div>
                <p className="text-avs-accent/60 mt-1 text-xs leading-snug">{meaning}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Symbols */}

      <div className="border-avs-accent/10 mb-8 border-b px-6 pb-8">
        <h3 className="font-display text-avs-accent mb-2 flex items-center gap-2 text-lg font-bold">
          <span className="bg-avs-primary/10 text-avs-primary flex h-6 w-6 items-center justify-center rounded-lg">
            <i className="pi pi-star" style={{ fontSize: '12px' }} />
          </span>
          Symboles constitutifs
        </h3>
        <p className="text-avs-accent/40 mb-5 text-sm leading-relaxed">
          Cliquez sur un symbole pour voir sa signification complète et son contexte d&apos;usage.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {pattern.symbols.map((sym: any) => {
            const isOpen = activeSymbol?.name === sym.name;
            return (
              <button
                key={sym.name}
                type="button"
                onClick={() => setActiveSymbol(isOpen ? null : sym)}
                className={`group overflow-hidden rounded-2xl border text-left transition-all duration-200 ${
                  isOpen
                    ? 'border-avs-primary/20 bg-avs-primary/5'
                    : 'border-avs-accent/10 bg-avs-secondary hover:border-avs-primary/20'
                } `}
              >
                <div className="flex items-start gap-3 p-3.5">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10">
                    {sym.imageUrl ? (
                      <img
                        src={sym.imageUrl}
                        alt={sym.name}
                        className="h-full w-full object-containt"
                      />
                    ) : (
                      <div className="h-full w-full" style={{ background: sym.cssPreview }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                    
                      <p
                        className={`font-display text-sm leading-tight font-bold ${isOpen ? 'text-avs-primary' : 'text-avs-accent'}`}
                      >
                        {sym.name}
                      </p>
                      {sym.sacred && (
                        <span className="bg-avs-kente/15 text-avs-kente border-avs-kente/25 rounded-md border px-1.5 py-0.5 font-mono text-[7px] font-black tracking-wider uppercase">
                          Sacré
                        </span>
                      )}
                    </div>
                    <p className="text-avs-accent/40 mt-0.5 font-mono text-[9px] italic">
                      {sym.name}
                    </p>
                  </div>
                  <i
                    className={`pi pi-chevron-right mt-0.5 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'text-avs-primary rotate-90' : 'text-avs-accent/30'
                    }`}
                    style={{ fontSize: '13px' }}
                  />
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-avs-primary/20  border-t px-3.5 pt-1  flex items-center md:space-x-10 space-x-2">
                        <div className="">
                          <div className="w-40 h-40 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10">
                    {sym.imageUrl ? (
                      <img
                        src={sym.imageUrl}
                        alt={sym.name}
                        className="h-full w-full object-containt"
                      />
                    ) : (
                      <div className="h-full w-full" style={{ background: sym.cssPreview }} />
                    )}
                  </div>
                        </div>
                        <div className="space-y-3">
                          <div className="pt-3">
                          
                          <p className="text-avs-primary mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase">
                            Signification
                          </p>
                          <p className="text-avs-accent/70 text-xs leading-relaxed">
                            {sym.meaning}
                          </p>
                        </div>
                        <div>
                          <p className="text-avs-primary mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase">
                            Usage cérémoniel
                          </p>
                          <p className="text-avs-accent/70 text-xs leading-relaxed">{sym.usage}</p>
                        </div>
                        
                        </div>
                        
                      </div>
                      {sym.sacred && (
                          <div className="bg-avs-kente/8 border-avs-kente/20 flex items-start gap-2 rounded-xl border p-3 m-5">
                            <i
                              className="pi pi-info-circle text-avs-kente  shrink-0"
                              style={{ fontSize: '11px' }}
                            />
                            <p className="text-avs-kente/85 text-[10px] leading-relaxed">
                              Ce symbole est sacré ou réservé à certaines fonctions sociales. Son
                              usage hors contexte traditionnel est considéré comme une transgression
                              culturelle.
                            </p>
                          </div>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
      {/* Documentary sections */}
      <div className="mb-8 px-6">
        {/* Tab bar */}
        <div className="border-avs-accent/10 mb-6 flex flex-wrap gap-0 border-b">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`-mb-px border-b-2 px-5 py-3 text-sm font-semibold transition-all duration-150 ${
                activeSection === id
                  ? 'border-avs-primary text-avs-primary'
                  : 'text-avs-accent/40 hover:text-avs-accent border-transparent'
              } `}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeSection === 'sources' ? (
              <div className="space-y-3">
                {pattern.sources?.map((s: string, i: number) => (
                  <div
                    key={i}
                    className="bg-avs-secondary-dark border-avs-accent/10 flex items-start gap-3 rounded-xl border px-5 py-4"
                  >
                    <span className="text-avs-primary mt-0.5 shrink-0 font-mono text-[10px] font-black">
                      [{i + 1}]
                    </span>
                    <p className="text-avs-accent/70 text-sm leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            ) : activeSection === 'symbolisme' ? (
              <div className="space-y-5">
                <p className="text-avs-accent/70 text-base leading-[1.85]">
                  {pattern.symbolism?.meaning}
                </p>

                <div className="flex flex-wrap gap-2">
                  {pattern.symbolism?.keywords?.map((k: string) => (
                    <span
                      key={k}
                      className="border-avs-primary/30 text-avs-primary rounded-full border px-3 py-1.5 text-sm"
                    >
                      {k}
                    </span>
                  ))}
                </div>

                <p className="text-avs-accent/70 text-base leading-[1.85]">
                  {pattern.symbolism?.usage}
                </p>
              </div>
            ) : (
              <p className="text-avs-accent/70 text-base leading-[1.85]">
                {(
                  {
                    histoire: pattern.history,
                    technique: pattern.technique,
                    ceremoniel: pattern.ceremonial,
                  } as Record<string, any>
                )[activeSection] ?? 'Aucune donnée disponible'}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Artisan quote */}
      {pattern.artisanQuote && (
        <div className="border-avs-accent/10 mx-6 mb-8 overflow-hidden rounded-2xl border pb-8">
          <div className={`${pattern.cssClass} h-1`} aria-hidden />
          <div className="bg-avs-secondary px-6 py-5">
            <p
              className="font-display text-avs-primary/25 text-5xl leading-none select-none"
              style={{ fontFamily: 'Georgia, serif' }}
              aria-hidden
            >
              &ldquo;
            </p>
            <blockquote className="font-display text-avs-accent/70 -mt-2 text-base leading-relaxed italic">
              {pattern.artisanQuote.text}
            </blockquote>
            <div className="mt-4 flex items-center gap-3">
              <div
                className={`${pattern.cssClass} border-avs-accent/15 relative h-9 w-9 shrink-0 overflow-hidden rounded-full border`}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <span className="font-display text-avs-secondary text-sm font-black drop-shadow">
                    {pattern.artisanQuote.author.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-avs-accent text-xs font-bold">{pattern.artisanQuote.author}</p>
                <p className="text-avs-accent/50 text-[10px]">{pattern.artisanQuote.role}</p>
                <p className="text-avs-accent/40 text-[10px]">{pattern.artisanQuote.country}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
