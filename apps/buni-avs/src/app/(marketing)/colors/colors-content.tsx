'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { 
  Combo, 
  COMBOS, 
  FilterType, 
  FilterValue 
} from './data';
import { 
  SegmentationFilters 
} from './components/segmentation-filters';
import { 
  RoleSwatch 
} from './components/role-swatch';
import { 
  UsageExamples 
} from './components/usage-examples';
import { 
  CulturalContext 
} from './components/cultural-context';
import { 
  ExportPanel 
} from './components/export-panel';
import { 
  CustomPaletteBuilder 
} from './components/custom-palette-builder';

export function ColorsContent() {
  const [activeCombo, setActiveCombo]   = useState(COMBOS[0]!.id);
  const [customCombos, setCustomCombos] = useState<Combo[]>([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Partial<Record<FilterType, FilterValue>>>({});

  const allCombos = [...COMBOS, ...customCombos];
  
  // Filter combos based on active filters
  const filteredCombos = allCombos.filter((combo) => {
    if (activeFilters.region && combo.region !== activeFilters.region) return false;
    if (activeFilters.culture && combo.culture !== activeFilters.culture) return false;
    if (activeFilters.theme && combo.theme !== activeFilters.theme) return false;
    return true;
  });
  
  const combo = filteredCombos.find((c) => c.id === activeCombo) ?? filteredCombos[0] ?? allCombos[0]!;

  const handleSaveCustomCombo = (created: Combo) => {
    setCustomCombos((prev) => [...prev, created]);
    setActiveCombo(created.id);
    setIsBuilderOpen(false);
  };

  const handleFilterChange = (type: FilterType, value: FilterValue) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value || undefined,
    }));
    setActiveCombo('');
  };

  return (
    <div className="min-h-screen bg-avs-secondary-dark">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 border-b border-avs-accent/9">
        <div className="avs-pattern-wax-dakar absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 80% at 5% 50%, rgba(192,87,62,0.06) 0%, transparent 65%)' }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-avs-primary" aria-hidden />
                <span className="font-mono text-[9px] font-bold tracking-[0.26em] uppercase text-avs-primary">Color Picker</span>
              </div>
              <h1
                className="font-display font-black leading-none text-avs-accent"
                style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.03em' }}
              >
                Combos de Couleurs Africaines
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-avs-accent/55">
                Choisissez une combinaison de couleurs inspirée de textiles et pigments africains,
                et voyez-la appliquée en direct sur des exemples d&apos;interface. Exportez en CSS, JSON ou Tailwind.
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              {[
                { v: `${allCombos.length}`,                                         l: 'combos'   },
                { v: `${allCombos.reduce((a, c) => a + c.colors.length, 0)}`,       l: 'couleurs' },
                { v: `${new Set(allCombos.map(c => c.region).filter(Boolean)).size}`, l: 'régions' },
                { v: `${new Set(allCombos.map(c => c.culture).filter(Boolean)).size}`, l: 'cultures' },
                { v: '3',                                                            l: 'formats'  },
              ].map(({ v, l }) => (
                <div key={l} className="rounded-xl px-4 py-3 text-center bg-avs-secondary border border-avs-accent/9">
                  <p className="font-display text-2xl font-black leading-none text-avs-accent" style={{ letterSpacing: '-0.02em' }}>{v}</p>
                  <p className="mt-1 font-mono text-[9px] tracking-wide uppercase text-avs-accent/35">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ COMBO PICKER ══════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ══ SEGMENTATION FILTERS ══════════════════════════════════════ */}
        <div className="mb-8">
          <p className="mb-3 font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-avs-accent/40">
            Filtrer par région, culture ou thème
          </p>
          <SegmentationFilters
            combos={allCombos}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-avs-accent/40">
              Choisir un combo {filteredCombos.length !== allCombos.length && `(${filteredCombos.length} filtrés)`}
            </p>
            {(activeFilters.region || activeFilters.culture || activeFilters.theme) && (
              <button
                onClick={() => setActiveFilters({})}
                className="font-mono text-[9px] font-bold uppercase tracking-wide text-avs-accent/40 hover:text-avs-accent"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {filteredCombos.map((c) => {
              const active = c.id === activeCombo && !isBuilderOpen;
              return (
                <button
                  key={c.id}
                  onClick={() => { setActiveCombo(c.id); setIsBuilderOpen(false); }}
                  className={`
                    group relative overflow-hidden rounded-xl border p-3 text-left transition-all duration-200
                    ${active ? 'border-transparent -translate-y-0.5' : 'border-avs-accent/9 hover:-translate-y-0.5 hover:border-avs-accent/20'}
                  `}
                  style={active ? { boxShadow: `0 8px 24px ${c.accentHex}30` } : {}}
                >
                  <div className="mb-2 flex h-8 overflow-hidden rounded-md">
                    {c.colors.map((col) => (
                      <div key={col.hex} className="flex-1" style={{ background: col.hex }} />
                    ))}
                  </div>
                  <p className={`text-[11px] font-bold ${active ? '' : 'text-avs-accent'}`} style={active ? { color: c.accentHex } : {}}>
                    {c.name}
                  </p>
                  <p className="text-[9px] text-avs-accent/40">{c.origin}</p>
                  {active && (
                    <motion.div
                      layoutId="combo-active-ring"
                      className="pointer-events-none absolute inset-0 rounded-xl border-2"
                      style={{ borderColor: c.accentHex }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              );
            })}

            {/* Carte "Créer un combo" */}
            <button
              onClick={() => setIsBuilderOpen(true)}
              className={`
                flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-3 transition-all duration-200
                ${isBuilderOpen ? 'border-avs-primary bg-avs-primary/5' : 'border-avs-accent/15 hover:border-avs-primary/40 hover:bg-avs-primary/5'}
              `}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-avs-primary/10">
                <Plus size={14} className="text-avs-primary" aria-hidden />
              </div>
              <p className="text-[11px] font-bold text-avs-accent/60">Créer un combo</p>
            </button>
          </div>
        </div>

        {/* ══ BUILDER (si ouvert) ════════════════════════════════════════ */}
        <AnimatePresence>
          {isBuilderOpen && (
            <div className="mb-8">
              <CustomPaletteBuilder onSave={handleSaveCustomCombo} onCancel={() => setIsBuilderOpen(false)} />
            </div>
          )}
        </AnimatePresence>

        {/* ══ COMBO DÉTAIL ════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {!isBuilderOpen && (
          <motion.div
            key={combo.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 lg:grid-cols-[1fr_320px]"
          >
            {/* Gauche — swatches + bannière */}
            <div>
              <div className={`${combo.patternCSS} relative mb-6 overflow-hidden rounded-2xl`}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.93) 0%, rgba(26,18,8,0.82) 100%)' }} />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `radial-gradient(ellipse 55% 80% at 0% 50%, ${combo.accentHex}22 0%, transparent 65%)` }}
                  aria-hidden
                />
                <div className="relative px-7 py-6">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="h-px w-6" style={{ background: combo.accentHex }} aria-hidden />
                    <p className={`font-mono text-[9px] font-bold tracking-[0.22em] uppercase ${combo.accentClass}`}>{combo.origin}</p>
                  </div>
                  <h2 className="font-display text-2xl font-black leading-tight text-avs-secondary" style={{ letterSpacing: '-0.02em' }}>{combo.name}</h2>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-avs-secondary/60">{combo.description}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {combo.colors.map((color, i) => (
                  <RoleSwatch key={color.name} color={color} index={i} combo={combo} />
                ))}
              </div>
            </div>

            {/* Droite — exemples d'usage + contexte culturel + export */}
            <div className="space-y-6">
              <CulturalContext combo={combo} />
              <div className="rounded-2xl border border-avs-accent/9 bg-avs-secondary p-5">
                <UsageExamples combo={combo} />
              </div>
              <ExportPanel combo={combo} />
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
