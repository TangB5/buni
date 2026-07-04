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
      style={{ scaleX, background: 'var(--doc-primary, #C0573E)' }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left"
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
    <div className="group my-5 overflow-hidden rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'var(--doc-code-header, #1a1a18)' }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-white/30">
            {title ?? lang.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => void copy(code, id)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[10px] font-semibold text-white/35 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white/10 hover:text-white/70"
        >
          {copied === id
            ? <><i className="pi pi-check" style={{ fontSize: '10px', color: '#34d399' }} /> Copié</>
            : <><i className="pi pi-copy" style={{ fontSize: '10px' }} /> Copier</>}
        </button>
      </div>
      <pre
        className="doc-scroll overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.8]"
        style={{ background: 'var(--doc-code-bg, #141412)', color: 'var(--doc-code-text, #d4d0c8)' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALLOUT
// ─────────────────────────────────────────────────────────────────────────────

const CALLOUT_CONF = {
  info:    { bg: 'rgba(42,74,107,0.08)', border: 'var(--doc-indigo, #2A4A6B)',  icon: 'pi-info-circle',         tc: 'var(--doc-indigo, #2A4A6B)',  label: 'Info' },
  tip:     { bg: 'rgba(74,103,65,0.08)', border: 'var(--doc-ndop, #4A6741)',    icon: 'pi-lightbulb',            tc: 'var(--doc-ndop, #4A6741)',    label: 'Astuce' },
  warning: { bg: 'rgba(212,160,23,0.08)', border: 'var(--doc-kente, #D4A017)',   icon: 'pi-exclamation-triangle', tc: 'var(--doc-kente, #D4A017)',   label: 'Attention' },
  danger:  { bg: 'rgba(192,87,62,0.09)',  border: 'var(--doc-primary, #C0573E)', icon: 'pi-exclamation-circle',   tc: 'var(--doc-primary, #C0573E)', label: 'Important' },
} as const;

export function Callout({ type = 'info', title, children }: { type?: keyof typeof CALLOUT_CONF; title?: string; children: React.ReactNode }) {
  const { bg, border, icon, tc, label } = CALLOUT_CONF[type];
  return (
    <div
      className="my-5 flex gap-3.5 rounded-r-xl px-4 py-4"
      style={{ background: bg, borderLeft: `3px solid ${border}`, border: `1px solid ${border}33`, borderLeftWidth: 3 }}
    >
      <i className={`${icon} mt-0.5 shrink-0`} style={{ fontSize: '15px', color: tc }} aria-hidden />
      <div>
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: tc }}>{title ?? label}</p>
        <div className="text-sm leading-relaxed" style={{ color: 'var(--doc-muted, rgba(29,29,27,0.52))' }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROP TABLE
// ─────────────────────────────────────────────────────────────────────────────

export function PropTable({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))' }}>
      <table className="w-full min-w-[560px] text-xs">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-primary-10, rgba(192,87,62,0.10))' }}>
            {['Prop', 'Type', 'Défaut', 'Description'].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-bold tracking-wider uppercase" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))', fontSize: '9px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([prop, type, def, desc], i) => (
            <tr key={prop} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--doc-border, rgba(29,29,27,0.09))' : 'none' }}
              className="transition-colors hover:bg-[var(--doc-primary-10,rgba(192,87,62,0.10))]">
              <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--doc-primary, #C0573E)' }}>{prop}</td>
              <td className="px-4 py-3 font-mono text-[11px]" style={{ color: 'var(--doc-indigo, #2A4A6B)' }}>{type}</td>
              <td className="px-4 py-3 font-mono text-[11px]" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>{def}</td>
              <td className="px-4 py-3 text-[12px] leading-snug" style={{ color: 'var(--doc-muted, rgba(29,29,27,0.52))' }}>{desc}</td>
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
    <div className="my-5 overflow-hidden rounded-xl" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))' }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'var(--doc-primary-10, rgba(192,87,62,0.10))', borderBottom: '1px solid var(--doc-border, rgba(29,29,27,0.09))' }}>
        <span className="h-2 w-2 rounded-full" style={{ background: 'var(--doc-primary, #C0573E)' }} aria-hidden />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>{label}</span>
      </div>
      <div
        className="p-8"
        style={{
          background: 'var(--doc-surface, #ffffff)',
          backgroundImage: 'radial-gradient(circle, var(--doc-border) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
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
      <a
        href={`#${id}`}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}
        aria-label={`Lien vers ${id}`}
      >
        <i className="pi pi-hashtag" style={{ fontSize: '13px' }} />
      </a>
    </div>
  );
}