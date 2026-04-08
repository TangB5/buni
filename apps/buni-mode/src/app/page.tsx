'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Users, Layers } from 'lucide-react';
import { Button } from '@buni/ui';
 
const FEATURED_DESIGNERS = [
  { name:'Awa Touré',    city:'Dakar 🇸🇳',    outfits:42, css:'avs-pattern-wax-dakar',    specialty:'Wax haute couture' },
  { name:'Brice Koffi',  city:'Abidjan 🇨🇮',   outfits:28, css:'avs-pattern-kente-royale', specialty:'Kente contemporain' },
  { name:'Amina Njoya',  city:'Yaoundé 🇨🇲',   outfits:61, css:'avs-pattern-ndop-sultan',  specialty:'Ndop & Toghu' },
  { name:'Seun Adeyemi', city:'Lagos 🇳🇬',     outfits:37, css:'avs-pattern-bogolan-fanga',specialty:'Streetwear Yoruba' },
];
 
const STATS = [
  { value:'2 400+', label:'Tenues créées' },
  { value:'186',    label:'Stylistes actifs' },
  { value:'34',     label:'Pays représentés' },
  { value:'12k',    label:'Téléchargements' },
];
 
const GARMENT_TYPES = [
  { name:'Boubou', css:'avs-pattern-wax-dakar',    icon:'👘' },
  { name:'Kente',  css:'avs-pattern-kente-royale', icon:'🧵' },
  { name:'Ndop',   css:'avs-pattern-ndop-sultan',  icon:'👔' },
  { name:'Kaftan', css:'avs-pattern-bogolan-fanga', icon:'🩱' },
];
 
export default function BuniModePage() {
  return (
    <div className="min-h-screen  overflow-x-hidden">
 
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-avs-secondary/6 bg-[#0C0806]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="avs-pattern-wax-dakar h-7 w-7 rounded-full border border-avs-secondary/20" />
            <span className="font-display text-lg font-black text-avs-secondary">Buni Mode</span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            {['Stylistes','Collections','Studio','Marketplace'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`}
                className="text-sm text-avs-secondary/50 hover:text-avs-secondary transition-colors">
                {l}
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Connexion</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/studio">
                <Sparkles size={13} /> Créer
              </Link>
            </Button>
          </div>
        </div>
      </nav>
 
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Fond motif subtle */}
        <div className="avs-pattern-bogolan-fanga pointer-events-none absolute inset-0 opacity-[.07]" />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 30% 50%,rgba(139,69,19,.12) 0%,transparent 70%)' }} />
 
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:.7 }}>
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-avs-earth/40 bg-avs-earth/10 px-4 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-avs-earth animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-[.22em] text-avs-earth">
                    Mode Africaine Digitale · Beta
                  </span>
                </div>
 
                <h1 className="font-display font-black text-avs-secondary leading-[.9] tracking-[-0.03em]"
                    style={{ fontSize: 'clamp(3rem,8vw,6.5rem)' }}>
                  Stylez sur<br />
                  <span className="text-avs-earth">mannequin</span><br />
                  virtuel
                </h1>
 
                <p className="mt-8 max-w-md text-lg text-avs-secondary/50 leading-relaxed">
                  Créez des tenues africaines — Wax, Kente, Ndop, Bogolan — sur un mannequin 3D.
                  Publiez, vendez, inspirez.
                </p>
 
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button size="lg" asChild
                    className="bg-avs-earth hover:bg-avs-earth/90 text-white shadow-[3px_3px_0_rgba(139,69,19,.5)]">
                    <Link href="/studio">
                      <Sparkles size={15} /> Ouvrir le studio
                    </Link>
                  </Button>
                  <Button variant="ghost" size="lg" asChild
                    className="text-avs-secondary/55 border border-avs-secondary/12 hover:text-avs-secondary hover:border-avs-secondary/25">
                    <Link href="/stylistes">
                      Voir les stylistes <ArrowRight size={14} />
                    </Link>
                  </Button>
                </div>
 
                <div className="mt-14 grid grid-cols-4 gap-0 border-t border-avs-secondary/8">
                  {STATS.map(({ value, label }, i) => (
                    <div key={label} className={`pt-5 ${i > 0 ? 'border-l border-avs-secondary/8 pl-4' : ''}`}>
                      <p className="font-display text-2xl font-black text-avs-secondary">{value}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-avs-earth">{label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
 
            {/* Mannequin preview (CSS) */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1, delay:.3 }}
              className="hidden lg:flex items-center justify-center">
              <div className="relative">
                {/* Silhouette mannequin en CSS */}
                <div className="relative h-[500px] w-[280px]">
                  {/* Corps */}
                  <div className="avs-pattern-wax-dakar absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full rounded-[40%_40%_30%_30%/20%_20%_10%_10%] opacity-90 border border-avs-secondary/10 shadow-[0_32px_80px_rgba(0,0,0,.6)]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0C0806]/80 rounded-[40%_40%_30%_30%/20%_20%_10%_10%]" />
 
                  {/* Étiquettes flottantes */}
                  {[
                    { label:'Wax Sénégalais', top:'15%', right:'-30%', css:'avs-pattern-wax-dakar' },
                    { label:'Ndop Sultan',    top:'45%', left:'-35%',  css:'avs-pattern-ndop-sultan' },
                    { label:'Kente Royale',   top:'70%', right:'-28%', css:'avs-pattern-kente-royale' },
                  ].map(({ label, top, right, left, css }, i) => (
                    <motion.div key={label}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease:'easeInOut', delay: i * 0.8 }}
                      className="absolute flex items-center gap-2 rounded-avs-xl border border-avs-secondary/10 bg-[#0C0806]/80 px-3 py-2 backdrop-blur-sm"
                      style={{ top, right, left }}
                    >
                      <div className={`${css} h-6 w-6 rounded-sm`} />
                      <span className="font-mono text-[10px] text-avs-secondary/70 whitespace-nowrap">{label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
 
      {/* ── TYPES DE VÊTEMENTS ── */}
      <section className="border-y border-avs-secondary/6 bg-avs-secondary/3 px-6 py-5">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-4 justify-center">
          {GARMENT_TYPES.map(({ name, css, icon }) => (
            <Link key={name} href={`/collections?type=${name.toLowerCase()}`}
              className="flex items-center gap-2.5 rounded-avs-xl border border-avs-secondary/8 bg-avs-secondary/5 px-4 py-2.5 transition-all hover:border-avs-earth/30 hover:bg-avs-earth/8">
              <div className={`${css} h-5 w-5 rounded-sm`} />
              <span className="text-sm font-semibold text-avs-secondary/65">{icon} {name}</span>
            </Link>
          ))}
          <Link href="/collections"
            className="text-xs font-semibold text-avs-secondary/35 hover:text-avs-earth transition-colors flex items-center gap-1">
            Tout voir <ArrowRight size={11} />
          </Link>
        </div>
      </section>
 
      {/* ── STYLISTES EN VEDETTE ── */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-avs-earth/50" />
                <span className="font-mono text-[10px] uppercase tracking-[.22em] text-avs-earth/60">Stylistes en vedette</span>
              </div>
              <h2 className="font-display font-black text-avs-secondary leading-tight"
                  style={{ fontSize:'clamp(1.8rem,3vw,2.8rem)' }}>
                Créateurs<br />africains
              </h2>
            </div>
            <Button variant="ghost" size="sm" asChild
              className="text-avs-secondary/40 border border-avs-secondary/10 hover:text-avs-secondary hidden sm:flex">
              <Link href="/stylistes">Tous les stylistes <ArrowRight size={13} /></Link>
            </Button>
          </div>
 
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_DESIGNERS.map(({ name, city, outfits, css, specialty }, i) => (
              <motion.div key={name}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i * .07, duration:.5 }}
                whileHover={{ y:-3 }}
              >
                <Link href={`/stylistes/${name.toLowerCase().replace(/\s+/g,'-')}`}
                  className="group block rounded-avs-xl border border-avs-secondary/8 bg-avs-secondary/3 overflow-hidden hover:border-avs-earth/25 transition-all">
                  {/* Cover */}
                  <div className={`${css} relative h-32`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0806]/80 to-transparent" />
                    {/* Avatar */}
                    <div className={`${css} absolute bottom-3 left-3 h-12 w-12 rounded-full border-2 border-[#0C0806] flex items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 bg-avs-accent/30" />
                      <span className="relative font-display text-lg font-black text-avs-secondary drop-shadow">
                        {name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  {/* Infos */}
                  <div className="p-4">
                    <p className="font-display font-bold text-avs-secondary">{name}</p>
                    <p className="text-xs text-avs-secondary/40 mt-0.5">{city}</p>
                    <p className="text-xs text-avs-earth/70 mt-1.5 font-medium">{specialty}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-avs-secondary/35">{outfits} tenues</span>
                      <div className="flex items-center gap-1 text-avs-kente">
                        <Star size={10} className="fill-current" />
                        <span className="font-mono text-[10px]">4.9</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  
      {/* ── STUDIO CTA ── */}
      <section className="avs-pattern-bogolan-fanga relative overflow-hidden px-6 py-24 lg:px-8">
        <div className="absolute inset-0 bg-[#0C0806]/90" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display font-black text-avs-secondary leading-tight"
              style={{ fontSize:'clamp(2rem,5vw,4rem)' }}>
            Votre vision,<br />
            <span className="text-avs-earth">sur mannequin</span>
          </h2>
          <p className="mt-6 text-avs-secondary/45 text-lg leading-relaxed max-w-lg mx-auto">
            Choisissez le gabarit, le teint, la silhouette. Habillez-le avec vos créations.
            Publiez en un clic.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Button size="xl" asChild
              className="bg-avs-earth text-white shadow-[4px_4px_0_rgba(139,69,19,.5)] hover:bg-avs-earth/90 hover:-translate-y-0.5">
              <Link href="/studio">
                <Sparkles size={16} /> Ouvrir le studio gratuit
              </Link>
            </Button>
          </div>
        </div>
      </section>
 
    </div>
  );
}
