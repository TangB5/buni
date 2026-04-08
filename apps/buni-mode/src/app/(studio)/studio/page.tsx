'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Sparkles, Download, Share2,
  RotateCcw, ZoomIn, ZoomOut, Heart, Layers, Palette,
  User, Tag, Plus, X, Check, Settings2,
} from 'lucide-react';

// ── Types inline ──────────────────────────────────────────────────────────────
type MorphType  = 'feminin' | 'masculin' | 'non-binaire';
type SkinTone   = 'clair' | 'bronze' | 'hâlé' | 'brun' | 'ébène' | 'noir-profond';
type MorphSize  = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
type GarmentType= 'haut' | 'bas' | 'robe' | 'boubou' | 'wrapper' | 'headwrap' | 'accessoire';

interface Garment {
  id:      string;
  name:    string;
  type:    GarmentType;
  pattern: string;
  color:   string;
  fabric:  string;
}

interface MannequinState {
  morphType: MorphType;
  skinTone:  SkinTone;
  size:      MorphSize;
  height:    number;
}

// ── Données ───────────────────────────────────────────────────────────────────
const SKIN_TONES: { id: SkinTone; hex: string; label: string }[] = [
  { id:'clair',       hex:'#F5D5B8', label:'Clair'        },
  { id:'bronze',      hex:'#D4955A', label:'Bronze'       },
  { id:'hâlé',        hex:'#B07340', label:'Hâlé'         },
  { id:'brun',        hex:'#8B5A2B', label:'Brun'         },
  { id:'ébène',       hex:'#4A2910', label:'Ébène'        },
  { id:'noir-profond',hex:'#2A1506', label:'Nuit profonde'},
];

const MORPH_TYPES: { id: MorphType; label: string; icon: string }[] = [
  { id:'feminin',    label:'Féminin',     icon:'♀' },
  { id:'masculin',   label:'Masculin',    icon:'♂' },
  { id:'non-binaire',label:'Non-binaire', icon:'⚧' },
];

const SIZES: MorphSize[] = ['XS','S','M','L','XL','XXL'];

const GARMENT_LIBRARY: (Garment & { layerOrder: number })[] = [
  { id:'g1', name:'Boubou Wax',      type:'robe',     pattern:'avs-pattern-wax-dakar',     color:'#F0E0D0', fabric:'Wax',    layerOrder:1 },
  { id:'g2', name:'Kente Dashiki',   type:'haut',     pattern:'avs-pattern-kente-royale',  color:'#1A1208', fabric:'Kente',  layerOrder:2 },
  { id:'g3', name:'Ndop Wrapper',    type:'wrapper',  pattern:'avs-pattern-ndop-sultan',   color:'#060F1A', fabric:'Ndop',   layerOrder:1 },
  { id:'g4', name:'Bogolan Pantalon',type:'bas',      pattern:'avs-pattern-bogolan-fanga', color:'#2A1506', fabric:'Bogolan',layerOrder:3 },
  { id:'g5', name:'Headwrap Adinkra',type:'headwrap', pattern:'avs-pattern-adinkra-sankofa',color:'#1A0F00',fabric:'Coton',  layerOrder:5 },
  { id:'g6', name:'Kaftan Kuba',     type:'robe',     pattern:'avs-pattern-kuba-kasai',    color:'#1C1008', fabric:'Raphia', layerOrder:1 },
  { id:'g7', name:'Top Berber',      type:'haut',     pattern:'avs-pattern-berber-amazigh',color:'#2A1506', fabric:'Laine',  layerOrder:2 },
  { id:'g8', name:'Robe Ndebele',    type:'robe',     pattern:'avs-pattern-ndebele-amabhaxa',color:'#F5EBE0',fabric:'Coton', layerOrder:1 },
];

const PANEL_TABS = [
  { id:'mannequin', label:'Gabarit',    icon: User    },
  { id:'tenue',     label:'Tenue',      icon: Layers  },
  { id:'couleurs',  label:'Couleurs',   icon: Palette },
  { id:'details',   label:'Détails',    icon: Tag     },
];

// ── Composant Mannequin CSS (silhouette stylisée) ─────────────────────────────
function MannequinSilhouette({
  mannequin, wornGarments, zoom,
}: {
  mannequin: MannequinState;
  wornGarments: Garment[];
  zoom: number;
}) {
  const skinHex = SKIN_TONES.find(s => s.id === mannequin.skinTone)?.hex ?? '#B07340';
  const scaleH  = mannequin.height / 170;

  // Couche de vêtements triée par ordre
  const topGarment  = wornGarments.find(g => g.type === 'haut' || g.type === 'robe' || g.type === 'boubou' || g.type === 'kaftan');
  const bottomGarment = wornGarments.find(g => g.type === 'bas' || g.type === 'wrapper');
  const headwrap    = wornGarments.find(g => g.type === 'headwrap');

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center top', transition: 'transform .3s ease' }}
    >
      <div
        className="relative"
        style={{
          width: 180,
          height: 480 * scaleH,
          transition: 'height .4s ease',
        }}
      >
        {/* ── Tête ── */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full border border-avs-secondary/20 shadow-lg"
          style={{
            width: 70,
            height: 80,
            background: skinHex,
          }}
        >
          {/* Headwrap */}
          {headwrap && (
            <div
              className={`${headwrap.pattern} absolute -top-2 left-1/2 -translate-x-1/2 rounded-t-[50%] rounded-b-none opacity-90`}
              style={{ width: 76, height: 50 }}
            />
          )}
        </div>

        {/* ── Cou ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: 78 * scaleH, width: 28, height: 22 * scaleH, background: skinHex }}
        />

        {/* ── Torse / Haut ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-t-[30%_40%] rounded-b-[10%]"
          style={{
            top: 97 * scaleH,
            width: 140,
            height: 160 * scaleH,
            background: topGarment ? undefined : skinHex,
            overflow: 'hidden',
          }}
        >
          {topGarment && (
            <div className={`${topGarment.pattern} w-full h-full opacity-90`} />
          )}
        </div>

        {/* ── Bras gauche ── */}
        <div
          className="absolute rounded-full"
          style={{
            top: 100 * scaleH,
            left: -8,
            width: 36,
            height: 130 * scaleH,
            background: topGarment ? undefined : skinHex,
            overflow: 'hidden',
            transform: 'rotate(8deg)',
            transformOrigin: 'top center',
          }}
        >
          {topGarment && <div className={`${topGarment.pattern} w-full h-full opacity-90`} />}
        </div>

        {/* ── Bras droit ── */}
        <div
          className="absolute rounded-full"
          style={{
            top: 100 * scaleH,
            right: -8,
            width: 36,
            height: 130 * scaleH,
            background: topGarment ? undefined : skinHex,
            overflow: 'hidden',
            transform: 'rotate(-8deg)',
            transformOrigin: 'top center',
          }}
        >
          {topGarment && <div className={`${topGarment.pattern} w-full h-full opacity-90`} />}
        </div>

        {/* ── Bas / Jupe / Pantalon ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 252 * scaleH,
            width: mannequin.morphType === 'feminin' ? 148 : 134,
            height: 180 * scaleH,
            background: bottomGarment ? undefined : skinHex,
            overflow: 'hidden',
            clipPath: mannequin.morphType === 'feminin' ? 'polygon(10% 0,90% 0,100% 100%,0% 100%)' : 'none',
            borderRadius: '0 0 12px 12px',
          }}
        >
          {bottomGarment && <div className={`${bottomGarment.pattern} w-full h-full opacity-90`} />}
          {!bottomGarment && !topGarment?.type.includes('robe') && (
            <div style={{ background: skinHex, width:'100%', height:'100%' }} />
          )}
        </div>

        {/* ── Jambes ── */}
        {['left','right'].map((side, i) => (
          <div
            key={side}
            className="absolute"
            style={{
              top: 428 * scaleH,
              [side]: i === 0 ? '24%' : undefined,
              right: i === 1 ? '24%' : undefined,
              width: 40,
              height: 52 * scaleH,
              background: skinHex,
              borderRadius: '0 0 8px 8px',
            }}
          />
        ))}

        {/* Overlay dégradé discret pour la profondeur */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(135deg,rgba(255,255,255,.06) 0%,transparent 60%,rgba(0,0,0,.12) 100%)' }}
        />
      </div>
    </div>
  );
}

// ── Page principale Studio ────────────────────────────────────────────────────
export default function StudioPage() {
  const [mannequin,    setMannequin]    = useState<MannequinState>({
    morphType: 'feminin', skinTone: 'brun', size: 'M', height: 170,
  });
  const [wornGarments, setWornGarments] = useState<Garment[]>([]);
  const [activePanel,  setActivePanel]  = useState<string>('tenue');
  const [zoom,         setZoom]         = useState(1);
  const [liked,        setLiked]        = useState(false);
  const [outfitName,   setOutfitName]   = useState('Ma tenue africaine');
  const [showSaveModal,setShowSaveModal]= useState(false);

  const toggleGarment = useCallback((garment: Garment) => {
    setWornGarments(prev => {
      const exists = prev.find(g => g.id === garment.id);
      if (exists) return prev.filter(g => g.id !== garment.id);
      // Remplacer si même catégorie principale
      const sameSlot = prev.filter(g => {
        if (['robe','boubou','kaftan'].includes(garment.type)) return !['robe','boubou','kaftan'].includes(g.type);
        if (garment.type === 'haut') return g.type !== 'haut';
        if (garment.type === 'bas'  || garment.type === 'wrapper') return g.type !== 'bas' && g.type !== 'wrapper';
        return true;
      });
      return [...sameSlot, garment];
    });
  }, []);

  const removeGarment = (id: string) => setWornGarments(prev => prev.filter(g => g.id !== id));

  const resetOutfit = () => setWornGarments([]);

  const countBadge = wornGarments.length > 0 ? wornGarments.length : undefined;

  return (
    <div className="flex h-screen flex-col bg-[#0A0806] overflow-hidden">

      {/* ── TOPBAR ── */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-avs-secondary/8 bg-[#0A0806] px-4">
        <div className="flex items-center gap-3">
          <Link href="/"
            className="flex items-center gap-1.5 text-xs text-avs-secondary/40 hover:text-avs-secondary transition-colors">
            <ChevronLeft size={14} /> Accueil
          </Link>
          <div className="h-3.5 w-px bg-avs-secondary/10" />
          <div className="avs-pattern-wax-dakar h-5 w-5 rounded-sm" />
          <span className="font-display text-sm font-bold text-avs-secondary">Studio Buni Mode</span>
        </div>

        {/* Nom de la tenue */}
        <input
          value={outfitName}
          onChange={e => setOutfitName(e.target.value)}
          className="bg-transparent text-center text-sm font-semibold text-avs-secondary/70 outline-none hover:text-avs-secondary focus:text-avs-secondary w-56 border-b border-transparent hover:border-avs-secondary/20 focus:border-avs-primary transition-colors"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiked(l => !l)}
            className={`rounded-avs p-2 transition-all ${liked ? 'text-avs-primary' : 'text-avs-secondary/35 hover:text-avs-secondary'}`}
            aria-label="Ajouter aux favoris"
          >
            <Heart size={15} className={liked ? 'fill-current' : ''} />
          </button>
          <button className="rounded-avs p-2 text-avs-secondary/35 hover:text-avs-secondary transition-colors" aria-label="Télécharger">
            <Download size={15} />
          </button>
          <button className="rounded-avs p-2 text-avs-secondary/35 hover:text-avs-secondary transition-colors" aria-label="Partager">
            <Share2 size={15} />
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 rounded-avs bg-avs-earth px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0_rgba(139,69,19,.5)] hover:-translate-y-px transition-all"
          >
            <Sparkles size={12} /> Publier
          </button>
        </div>
      </header>

      {/* ── CORPS PRINCIPAL ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── PANNEAU GAUCHE — Canvas mannequin ── */}
        <div className="relative flex flex-1 flex-col items-center justify-start overflow-hidden border-r border-avs-secondary/8 bg-[#080604] pt-8">

          {/* Fond grille */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(245,235,224,1) 1px,transparent 1px),linear-gradient(90deg,rgba(245,235,224,1) 1px,transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Contrôles zoom */}
          <div className="absolute left-4 top-4 flex flex-col gap-1">
            <button onClick={() => setZoom(z => Math.min(z + .1, 1.5))}
              className="flex h-7 w-7 items-center justify-center rounded-avs border border-avs-secondary/10 bg-avs-secondary/5 text-avs-secondary/50 hover:text-avs-secondary hover:bg-avs-secondary/10 transition-colors"
              aria-label="Zoom avant"
            >
              <ZoomIn size={13} />
            </button>
            <button onClick={() => setZoom(z => Math.max(z - .1, .5))}
              className="flex h-7 w-7 items-center justify-center rounded-avs border border-avs-secondary/10 bg-avs-secondary/5 text-avs-secondary/50 hover:text-avs-secondary hover:bg-avs-secondary/10 transition-colors"
              aria-label="Zoom arrière"
            >
              <ZoomOut size={13} />
            </button>
            <button onClick={resetOutfit}
              className="flex h-7 w-7 items-center justify-center rounded-avs border border-avs-secondary/10 bg-avs-secondary/5 text-avs-secondary/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label="Réinitialiser"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Mannequin */}
          <div className="relative">
            <MannequinSilhouette mannequin={mannequin} wornGarments={wornGarments} zoom={zoom} />
          </div>

          {/* Info gabarit en bas */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <span className="rounded-full border border-avs-secondary/10 bg-avs-secondary/5 px-3 py-1 font-mono text-[10px] text-avs-secondary/40 capitalize">
              {mannequin.morphType} · {mannequin.size} · {mannequin.height}cm
            </span>
            {wornGarments.length > 0 && (
              <span className="rounded-full bg-avs-earth/20 border border-avs-earth/30 px-3 py-1 font-mono text-[10px] text-avs-earth">
                {wornGarments.length} pièce{wornGarments.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* ── PANNEAU DROIT — Contrôles ── */}
        <aside className="flex w-80 shrink-0 flex-col bg-[#0A0806]">

          {/* Tabs de navigation */}
          <div className="flex border-b border-avs-secondary/8">
            {PANEL_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActivePanel(id)}
                className={`relative flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  activePanel === id
                    ? 'text-avs-earth border-b-2 border-avs-earth -mb-px'
                    : 'text-avs-secondary/30 hover:text-avs-secondary/60'
                }`}
              >
                <Icon size={14} aria-hidden />
                {label}
                {id === 'tenue' && countBadge && (
                  <span className="absolute -right-0.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-avs-earth text-[8px] font-black text-white">
                    {countBadge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Contenu du panel */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <AnimatePresence mode="wait">

              {/* ── GABARIT ── */}
              {activePanel === 'mannequin' && (
                <motion.div key="mannequin" initial={{ opacity:0,x:8 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-8 }}
                  transition={{ duration:.2 }} className="p-4 space-y-6">

                  {/* Morphotype */}
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-avs-secondary/35">Morphotype</p>
                    <div className="grid grid-cols-3 gap-2">
                      {MORPH_TYPES.map(({ id, label, icon }) => (
                        <button key={id} onClick={() => setMannequin(m => ({ ...m, morphType: id }))}
                          className={`flex flex-col items-center gap-1.5 rounded-avs-xl border py-3 text-xs font-semibold transition-all ${
                            mannequin.morphType === id
                              ? 'border-avs-earth bg-avs-earth/10 text-avs-earth'
                              : 'border-avs-secondary/10 text-avs-secondary/40 hover:border-avs-secondary/25 hover:text-avs-secondary/70'
                          }`}
                        >
                          <span className="text-xl leading-none">{icon}</span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Teinte de peau */}
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-avs-secondary/35">Teinte de peau</p>
                    <div className="grid grid-cols-6 gap-1.5">
                      {SKIN_TONES.map(({ id, hex, label }) => (
                        <button key={id} onClick={() => setMannequin(m => ({ ...m, skinTone: id }))}
                          title={label}
                          className={`relative h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${
                            mannequin.skinTone === id
                              ? 'border-avs-secondary shadow-[0_0_0_2px_rgba(245,235,224,.2)]'
                              : 'border-transparent'
                          }`}
                          style={{ background: hex }}
                          aria-label={label}
                        >
                          {mannequin.skinTone === id && (
                            <Check size={11} className="absolute inset-0 m-auto text-avs-secondary drop-shadow" />
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[10px] text-avs-secondary/30 capitalize">
                      {SKIN_TONES.find(s => s.id === mannequin.skinTone)?.label}
                    </p>
                  </div>

                  {/* Taille EU */}
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-avs-secondary/35">Taille</p>
                    <div className="flex gap-1.5">
                      {SIZES.map(s => (
                        <button key={s} onClick={() => setMannequin(m => ({ ...m, size: s }))}
                          className={`flex-1 rounded-avs py-1.5 text-xs font-bold transition-all ${
                            mannequin.size === s
                              ? 'bg-avs-earth text-white'
                              : 'border border-avs-secondary/10 text-avs-secondary/35 hover:border-avs-earth/30 hover:text-avs-earth'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hauteur */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-avs-secondary/35">Hauteur</p>
                      <span className="font-mono text-[10px] text-avs-secondary/50">{mannequin.height} cm</span>
                    </div>
                    <input
                      type="range" min={150} max={200} step={1}
                      value={mannequin.height}
                      onChange={e => setMannequin(m => ({ ...m, height: Number(e.target.value) }))}
                      className="w-full accent-avs-earth"
                    />
                    <div className="mt-1 flex justify-between font-mono text-[9px] text-avs-secondary/25">
                      <span>150 cm</span><span>200 cm</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── TENUE ── */}
              {activePanel === 'tenue' && (
                <motion.div key="tenue" initial={{ opacity:0,x:8 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-8 }}
                  transition={{ duration:.2 }} className="p-4 space-y-4">

                  {/* Pièces portées */}
                  {wornGarments.length > 0 && (
                    <div>
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-avs-secondary/35">
                        Portés ({wornGarments.length})
                      </p>
                      <div className="space-y-2">
                        {wornGarments.map(g => (
                          <div key={g.id} className="flex items-center gap-2.5 rounded-avs-xl border border-avs-earth/20 bg-avs-earth/8 px-3 py-2.5">
                            <div className={`${g.pattern} h-8 w-8 shrink-0 rounded-avs border border-avs-secondary/10`} />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-avs-secondary">{g.name}</p>
                              <p className="text-[10px] text-avs-secondary/40 capitalize">{g.type} · {g.fabric}</p>
                            </div>
                            <button onClick={() => removeGarment(g.id)}
                              className="shrink-0 rounded-avs p-1 text-avs-secondary/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                              aria-label={`Retirer ${g.name}`}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bibliothèque */}
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-avs-secondary/35">
                      Bibliothèque
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {GARMENT_LIBRARY.map(garment => {
                        const isWorn = wornGarments.some(g => g.id === garment.id);
                        return (
                          <button key={garment.id}
                            onClick={() => toggleGarment(garment)}
                            className={`group relative overflow-hidden rounded-avs-xl border transition-all hover:-translate-y-0.5 ${
                              isWorn
                                ? 'border-avs-earth/50 ring-1 ring-avs-earth/30'
                                : 'border-avs-secondary/8 hover:border-avs-earth/25'
                            }`}
                          >
                            <div className={`${garment.pattern} h-16`} />
                            <div className={`px-2.5 py-2 ${isWorn ? 'bg-avs-earth/12' : 'bg-avs-secondary/3'} transition-colors`}>
                              <p className="text-[10px] font-bold text-avs-secondary/80 leading-tight">{garment.name}</p>
                              <p className="text-[9px] text-avs-secondary/35 mt-0.5 capitalize">{garment.type}</p>
                            </div>
                            {isWorn && (
                              <div className="absolute right-2 top-2 rounded-full bg-avs-earth p-0.5">
                                <Check size={9} className="text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── COULEURS ── */}
              {activePanel === 'couleurs' && (
                <motion.div key="couleurs" initial={{ opacity:0,x:8 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-8 }}
                  transition={{ duration:.2 }} className="p-4 space-y-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-avs-secondary/35">Palette AVS</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      '#C0573E','#F5EBE0','#1D1D1B','#D4A017',
                      '#4A6741','#2A4A6B','#8B4513','#C8A96E',
                      '#F0E0D0','#2A1506','#1A1208','#060F1A',
                    ].map(hex => (
                      <button key={hex}
                        className="group relative h-10 rounded-avs border border-avs-secondary/10 transition-all hover:scale-105 hover:shadow-avs"
                        style={{ background: hex }}
                        aria-label={`Couleur ${hex}`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[8px] text-white drop-shadow">
                          {hex}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-avs-secondary/25 text-center mt-4">
                    Sélectionnez une pièce portée pour changer sa couleur
                  </p>
                </motion.div>
              )}

              {/* ── DÉTAILS ── */}
              {activePanel === 'details' && (
                <motion.div key="details" initial={{ opacity:0,x:8 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-8 }}
                  transition={{ duration:.2 }} className="p-4 space-y-4">
                  <div>
                    <label className="avs-label text-avs-secondary/35">Nom de la tenue</label>
                    <input value={outfitName} onChange={e => setOutfitName(e.target.value)}
                      className="w-full rounded-avs border-2 border-avs-secondary/10 bg-avs-secondary/5 px-3 py-2 text-sm text-avs-secondary/80 placeholder:text-avs-secondary/25 outline-none focus:border-avs-earth/50 transition-colors"
                      placeholder="ex: Ensemble Ndop de soirée"
                    />
                  </div>
                  <div>
                    <label className="avs-label text-avs-secondary/35">Occasion</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['Quotidien','Cérémonie','Mariage','Soirée','Travail','Événement'].map(occ => (
                        <button key={occ}
                          className="rounded-avs border border-avs-secondary/10 px-3 py-2 text-xs text-avs-secondary/40 hover:border-avs-earth/30 hover:text-avs-earth hover:bg-avs-earth/8 transition-all">
                          {occ}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="avs-label text-avs-secondary/35">Tags</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['africain','wax','couture','contemporain'].map(t => (
                        <span key={t} className="rounded-avs border border-avs-earth/25 bg-avs-earth/10 px-2.5 py-1 text-[10px] text-avs-earth">
                          {t}
                        </span>
                      ))}
                      <button className="rounded-avs border border-dashed border-avs-secondary/15 px-2.5 py-1 text-[10px] text-avs-secondary/30 hover:border-avs-earth/30 hover:text-avs-earth transition-colors">
                        <Plus size={10} className="inline mr-1" />Ajouter
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer panel */}
          <div className="border-t border-avs-secondary/8 p-3">
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-avs-xl bg-avs-earth py-3 text-sm font-bold text-white shadow-[3px_3px_0_rgba(139,69,19,.4)] hover:-translate-y-px hover:shadow-[4px_4px_0_rgba(139,69,19,.4)] transition-all"
            >
              <Sparkles size={14} />
              Publier la tenue
            </button>
          </div>
        </aside>
      </div>

      {/* ── MODAL PUBLICATION ── */}
      <AnimatePresence>
        {showSaveModal && (
          <>
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-50 bg-avs-accent/70 backdrop-blur-sm"
              onClick={() => setShowSaveModal(false)}
            />
            <motion.div
              initial={{ opacity:0, scale:.95, y:10 }}
              animate={{ opacity:1, scale:1,   y:0  }}
              exit={{    opacity:0, scale:.95, y:10  }}
              transition={{ type:'spring', stiffness:280, damping:22 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-avs-xl border border-avs-secondary/10 bg-[#0A0806] shadow-avs-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-avs-secondary/8 px-5 py-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-avs-secondary">Publier la tenue</h3>
                  <p className="text-xs text-avs-secondary/40 mt-0.5">{outfitName}</p>
                </div>
                <button onClick={() => setShowSaveModal(false)}
                  className="rounded-avs p-1.5 text-avs-secondary/30 hover:bg-avs-secondary/8 hover:text-avs-secondary transition-colors">
                  <X size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 rounded-avs-xl border border-avs-earth/20 bg-avs-earth/8 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-avs bg-avs-earth/20">
                    <Sparkles size={20} className="text-avs-earth" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-avs-secondary">Tenue prête !</p>
                    <p className="text-xs text-avs-secondary/45 mt-0.5">
                      {wornGarments.length} pièce{wornGarments.length !== 1 ? 's' : ''} · {mannequin.morphType} · {mannequin.size}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { label:'Visible publiquement', checked:true  },
                    { label:'Autoriser les téléchargements', checked:false },
                    { label:'Ajouter à ma collection', checked:true  },
                  ].map(({ label, checked }) => (
                    <label key={label} className="flex cursor-pointer items-center gap-3">
                      <div className={`h-4 w-4 rounded-sm border-2 flex items-center justify-center transition-colors ${checked ? 'border-avs-earth bg-avs-earth' : 'border-avs-secondary/20'}`}>
                        {checked && <Check size={10} className="text-white" />}
                      </div>
                      <span className="text-sm text-avs-secondary/70">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 border-t border-avs-secondary/8 p-4">
                <button onClick={() => setShowSaveModal(false)}
                  className="flex-1 rounded-avs-xl border border-avs-secondary/12 py-2.5 text-sm font-semibold text-avs-secondary/50 hover:text-avs-secondary transition-colors">
                  Annuler
                </button>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-avs-xl bg-avs-earth py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_rgba(139,69,19,.4)] hover:-translate-y-px transition-all"
                >
                  <Check size={14} /> Publier
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}