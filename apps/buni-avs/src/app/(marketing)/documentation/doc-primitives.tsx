'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback(async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2200);
  }, []);
  return { copied, copy };
}

interface TocEntry { id: string; label: string; level: 1 | 2 | 3 }

export function useActiveHeading(toc: TocEntry[]) {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    if (!toc.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-10% 0% -80% 0%' },
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [toc]);
  return activeId;
}

// ─────────────────────────────────────────────────────────────────────────────
// READING PROGRESS — thin bar pinned under the topbar, tracks page scroll
// ─────────────────────────────────────────────────────────────────────────────

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 280, damping: 32, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-avs-primary"
      aria-hidden
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CODE BLOCK — copyable, tabbed header
// ─────────────────────────────────────────────────────────────────────────────

export function CodeBlock({ code, lang = 'tsx', id, title }: { code: string; lang?: string; id: string; title?: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="group my-5 overflow-hidden rounded-xl border border-avs-secondary/6 shadow-avs-md">
      <div className="flex items-center justify-between bg-avs-accent px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-avs-secondary/30">{title ?? lang.toUpperCase()}</span>
        </div>
        <button
          onClick={() => void copy(code, id)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[10px] font-semibold text-avs-secondary/35 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-avs-secondary/10 hover:text-avs-secondary/70"
        >
          {copied === id ? (
            <><i className="pi pi-check" style={{ fontSize: '10px', color: '#34d399' }} /> Copié</>
          ) : (
            <><i className="pi pi-copy" style={{ fontSize: '10px' }} /> Copier</>
          )}
        </button>
      </div>
      <pre className="doc-scroll overflow-x-auto bg-avs-accent px-5 py-5 font-mono text-[12.5px] leading-[1.8] text-avs-secondary/80">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALLOUT
// ─────────────────────────────────────────────────────────────────────────────

const CALLOUT_CONF = {
  info:    { bg: 'bg-avs-indigo/8',  border: 'border-avs-indigo',  icon: 'pi pi-info-circle',          text: 'text-avs-indigo',  label: 'Info' },
  tip:     { bg: 'bg-avs-ndop/8',    border: 'border-avs-ndop',    icon: 'pi pi-lightbulb',            text: 'text-avs-ndop',    label: 'Astuce' },
  warning: { bg: 'bg-avs-kente/8',   border: 'border-avs-kente',   icon: 'pi pi-exclamation-triangle', text: 'text-avs-kente',   label: 'Attention' },
  danger:  { bg: 'bg-avs-primary/9', border: 'border-avs-primary', icon: 'pi pi-exclamation-circle',   text: 'text-avs-primary', label: 'Important' },
} as const;

export function Callout({ type = 'info', title, children }: { type?: keyof typeof CALLOUT_CONF; title?: string; children: React.ReactNode }) {
  const { bg, border, icon, text, label } = CALLOUT_CONF[type];
  return (
    <div className={`my-5 flex gap-3.5 rounded-r-xl px-4 py-4 ${bg} border border-l-[3px] ${border}`}>
      <i className={`${icon} mt-0.5 shrink-0 ${text}`} style={{ fontSize: '15px' }} aria-hidden />
      <div>
        <p className={`mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] ${text}`}>{title ?? label}</p>
        <div className="text-sm leading-relaxed text-avs-accent/52">{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROP TABLE
// ─────────────────────────────────────────────────────────────────────────────

export function PropTable({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl border border-avs-accent/9">
      <table className="w-full min-w-[560px] text-xs">
        <thead>
          <tr className="border-b border-avs-accent/9 bg-avs-primary/10">
            {['Prop', 'Type', 'Défaut', 'Description'].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-wider text-avs-accent/32">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([prop, type, def, desc], i) => (
            <tr key={prop} className={`transition-colors hover:bg-avs-primary/10 ${i < rows.length - 1 ? 'border-b border-avs-accent/9' : ''}`}>
              <td className="px-4 py-3 font-mono font-bold text-avs-primary">{prop}</td>
              <td className="px-4 py-3 font-mono text-[11px] text-avs-indigo">{type}</td>
              <td className="px-4 py-3 font-mono text-[11px] text-avs-accent/32">{def}</td>
              <td className="px-4 py-3 text-[12px] leading-snug text-avs-accent/52">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE DEMO — interactive playground shell
// ─────────────────────────────────────────────────────────────────────────────

export function LiveDemo({ children, label = 'Démonstration live' }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-avs-accent/9">
      <div className="flex items-center gap-2 border-b border-avs-accent/9 bg-avs-primary/10 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-avs-primary" aria-hidden />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-avs-accent/32">{label}</span>
      </div>
      <div
        className="bg-avs-secondary p-8"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(29,29,27,0.09) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
      >
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION ANCHOR — deep-linkable heading wrapper
// ─────────────────────────────────────────────────────────────────────────────

export function SectionAnchor({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={id} className="group flex scroll-mt-28 items-center gap-2">
      {children}
      <a href={`#${id}`} className="text-avs-accent/32 opacity-0 transition-opacity group-hover:opacity-100" aria-label={`Lien vers ${id}`}>
        <i className="pi pi-hashtag" style={{ fontSize: '13px' }} />
      </a>
    </div>
  );
}