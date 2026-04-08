'use client';

import { useState } from 'react';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Slot } from '@radix-ui/react-slot';
import { X, MapPin, Palette, Eye, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...i: Parameters<typeof clsx>) => twMerge(clsx(...i));

// ── Types ─────────────────────────────────────────────────────────────────────
interface CulturalVisual {
  id:          string;
  title:       string;
  origin:      string;
  kingdom?:    string;
  description: string;
  patternCSS:  string;
  palette:     string[];
  significance:string;
}

// ── Données démo — Patrimoine Camerounais ─────────────────────────────────────
const CAMEROON_HERITAGE: CulturalVisual[] = [
  {
    id:          'ndop-bamoum',
    title:       'Ndop Royal Bamoum',
    origin:      'Foumban, Cameroun',
    kingdom:     'Sultanat Bamoum',
    description: 'Tissu sacré tissé pour les cérémonies royales du Sultanat Bamoum. Chaque motif géométrique encode un message spirituel transmis de génération en génération.',
    patternCSS:  'avs-pattern-ndop-royal',
    palette:     ['#0D2340', '#C8A96E', '#F5EBE0', '#D4A017'],
    significance:'Royauté · Spiritualité · Transmission',
  },
  {
    id:          'kaba-ngondo',
    title:       'Kaba Ngondo Sawa',
    origin:      'Douala, Cameroun',
    kingdom:     'Peuple Sawa',
    description: 'Vêtement festif des peuples côtiers Sawa, porté lors du festival Ngondo. Les motifs bleus représentent les eaux sacrées du Wouri.',
    patternCSS:  'avs-pattern-ndop',
    palette:     ['#1E3A5F', '#F5EBE0', '#C0573E', '#4A6741'],
    significance:'Eau · Ancêtres · Communauté',
  },
  {
    id:          'raphia-bamileke',
    title:       'Raphia Bamiléké',
    origin:      'Bafoussam, Cameroun',
    kingdom:     'Chefferies Bamiléké',
    description: 'Tissu de raphia tressé à la main dans les chefferies des Hautes Terres. Symbole de richesse et de fierté culturelle des Grassfields.',
    patternCSS:  'avs-pattern-wax',
    palette:     ['#F5EBE0', '#C0573E', '#1D1D1B', '#C8A96E'],
    significance:'Fertilité · Richesse · Artisanat',
  },
];

// ── Animations ────────────────────────────────────────────────────────────────
const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: cubicBezier(0.22, 1, 0.36, 1) },
  }),
  hover: { y: -6, transition: { duration: 0.25 } },
};

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden:  { opacity: 0, scale: 0.96, y: 16 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.3, ease: cubicBezier(0.22, 1, 0.36, 1) } },
  exit:    { opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.2 } },
};

// ── Sous-composant : Carte Patrimoine ─────────────────────────────────────────
function HeritageCard({ visual, index, onPreview }: {
  visual:    CulturalVisual;
  index:     number;
  onPreview: (v: CulturalVisual) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative overflow-hidden rounded-avs-lg border border-avs-accent/10 bg-avs-secondary shadow-avs cursor-pointer"
      onClick={() => onPreview(visual)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { onPreview(visual); } }}
      aria-label={`Voir ${visual.title}`}
    >
      {/* Visuel du motif */}
      <div className={cn('h-48 w-full relative overflow-hidden', visual.patternCSS)}>
        <motion.div
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          aria-hidden
        />

        {/* Badge origine */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-avs bg-avs-accent/80 px-2 py-1 backdrop-blur-sm">
          <MapPin size={11} className="text-avs-secondary" aria-hidden />
          <span className="text-xs font-semibold text-avs-secondary">{visual.origin}</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-avs-accent leading-tight">
          {visual.title}
        </h3>
        {visual.kingdom && (
          <p className="mt-0.5 text-xs font-medium text-avs-primary uppercase tracking-wider">
            {visual.kingdom}
          </p>
        )}
        <p className="mt-2 text-sm text-avs-accent/60 line-clamp-2 leading-relaxed">
          {visual.description}
        </p>

        {/* Palette */}
        <div className="mt-3 flex items-center gap-2">
          <Palette size={13} className="text-avs-accent/40" aria-hidden />
          <div className="flex gap-1.5" role="list" aria-label="Palette de couleurs">
            {visual.palette.map(color => (
              <Tooltip.Provider key={color} delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span
                      role="listitem"
                      className="h-4 w-4 rounded-full border border-avs-accent/15 shadow-sm cursor-default"
                      style={{ backgroundColor: color }}
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="rounded-avs bg-avs-accent px-2 py-1 text-xs text-avs-secondary shadow-avs z-50"
                      sideOffset={5}
                    >
                      {color}
                      <Tooltip.Arrow className="fill-avs-accent" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            ))}
          </div>
        </div>

        {/* Bouton prévisualisation */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-avs bg-avs-primary px-4 py-2.5 text-sm font-semibold text-avs-secondary shadow-avs transition-colors hover:bg-avs-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-primary focus-visible:ring-offset-2"
          onClick={e => { e.stopPropagation(); onPreview(visual); }}
          aria-label={`Prévisualiser ${visual.title}`}
        >
          <Eye size={15} aria-hidden />
          Prévisualiser
        </motion.button>
      </div>
    </motion.article>
  );
}

// ── Composant Principal ───────────────────────────────────────────────────────
export function HeritagePreview(): React.JSX.Element {
  const [selected, setSelected] = useState<CulturalVisual | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreview = (visual: CulturalVisual) => {
    setIsLoading(true);
    // Simule un chargement asynchrone
    setTimeout(() => { setSelected(visual); setIsLoading(false); }, 300);
  };

  return (
    <section aria-labelledby="heritage-title" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="inline-block rounded-avs bg-avs-primary/12 px-3 py-1 text-xs font-bold uppercase tracking-widest text-avs-primary mb-4">
            Patrimoine Camerounais
          </span>
          <h2 id="heritage-title" className="font-display text-4xl font-bold text-avs-accent">
            Tisser l&apos;<span className="text-avs-primary">Histoire</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-avs-accent/60 leading-relaxed">
            Motifs ancestraux du Cameroun — du Sultanat Bamoum aux Grassfields Bamiléké,
            chaque tissu est un livre ouvert.
          </p>
        </motion.div>

        {/* Grille de cartes */}
        {isLoading ? (
          <div className="flex h-48 items-center justify-center" aria-live="polite">
            <Loader2 size={32} className="animate-spin text-avs-primary" aria-label="Chargement…" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAMEROON_HERITAGE.map((visual, i) => (
              <HeritageCard key={visual.id} visual={visual} index={i} onPreview={handlePreview} />
            ))}
          </div>
        )}
      </div>

      {/* ── Dialog Radix UI — Détail du motif ───────────────────────────── */}
      <Dialog.Root open={!!selected} onOpenChange={open => { if (!open) { setSelected(null); } }}>
        <AnimatePresence>
          {selected && (
            <Dialog.Portal forceMount>
              {/* Overlay */}
              <Dialog.Overlay asChild>
                <motion.div
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="fixed inset-0 z-40 bg-avs-accent/70 backdrop-blur-sm"
                />
              </Dialog.Overlay>

              {/* Panel */}
              <Dialog.Content asChild aria-describedby="heritage-desc">
                <motion.div
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-avs-lg bg-avs-secondary shadow-avs-lg focus:outline-none"
                >
                  {/* Visuel */}
                  <div className={cn('h-52 w-full avs-pattern-animated', selected.patternCSS)} aria-hidden />

                  {/* Contenu */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Dialog.Title className="font-display text-2xl font-bold text-avs-accent">
                          {selected.title}
                        </Dialog.Title>
                        {selected.kingdom && (
                          <p className="text-xs font-semibold uppercase tracking-widest text-avs-primary mt-0.5">
                            {selected.kingdom}
                          </p>
                        )}
                      </div>
                      <Dialog.Close asChild>
                        <Slot>
                          <button
                            className="rounded-avs p-1.5 text-avs-accent/50 hover:bg-avs-primary/10 hover:text-avs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-primary"
                            aria-label="Fermer"
                          >
                            <X size={18} />
                          </button>
                        </Slot>
                      </Dialog.Close>
                    </div>

                    <p id="heritage-desc" className="mt-4 text-sm text-avs-accent/70 leading-relaxed">
                      {selected.description}
                    </p>

                    {/* Signification */}
                    <div className="mt-5 rounded-avs bg-avs-primary/8 border border-avs-primary/20 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-avs-primary mb-1">
                        Signification
                      </p>
                      <p className="text-sm font-medium text-avs-accent">{selected.significance}</p>
                    </div>

                    {/* Palette */}
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-xs text-avs-accent/50 font-medium">Palette :</span>
                      {selected.palette.map(c => (
                        <span
                          key={c}
                          title={c}
                          className="h-6 w-6 rounded-full border-2 border-white shadow-avs"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 rounded-avs bg-avs-primary px-4 py-2.5 text-sm font-semibold text-avs-secondary shadow-avs hover:bg-avs-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-primary"
                      >
                        Télécharger SVG
                      </motion.button>
                      <Dialog.Close asChild>
                        <Slot>
                          <button className="rounded-avs border-2 border-avs-accent/20 px-4 py-2.5 text-sm font-semibold text-avs-accent hover:bg-avs-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-accent">
                            Fermer
                          </button>
                        </Slot>
                      </Dialog.Close>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </section>
  );
}

export default HeritagePreview;
