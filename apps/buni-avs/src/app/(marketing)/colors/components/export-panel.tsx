'use client';

import { useState } from 'react';
import { Copy, Check, Download, ArrowUpRight } from 'lucide-react';
import { Combo, ExportFormat } from '../data';
import { generateExport } from '../utils';

export function ExportPanel({ combo }: { combo: Combo }) {
  const [format, setFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);
  const code = generateExport(combo, format);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const ext  = format === 'json' ? 'json' : format === 'tailwind' ? 'ts' : 'css';
    const blob = new Blob([code], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `avs-combo-${combo.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary">
      <div className="flex items-center justify-between px-5 py-4 border-b border-avs-accent/9">
        <h3 className="font-display text-sm font-bold text-avs-accent" style={{ letterSpacing: '-0.01em' }}>Exporter</h3>
        <div className="flex items-center gap-0.5 rounded-xl p-0.5 bg-avs-accent/4 border border-avs-accent/9">
          {(['css', 'json', 'tailwind'] as ExportFormat[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`rounded-lg px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.14em] uppercase transition-all duration-150 ${format === fmt ? 'bg-avs-primary text-avs-secondary' : 'text-avs-accent/35'}`}
            >{fmt}</button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between px-4 py-2.5 bg-avs-accent/90">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/65" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/65" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/65" />
          </div>
          <button
            onClick={() => void copyCode()}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[9px] font-semibold text-avs-secondary/40 transition-all hover:bg-avs-secondary/10 hover:text-avs-secondary/75"
          >
            {copied ? <><Check size={9} className="text-emerald-400" /> Copié</> : <><Copy size={9} /> Copier</>}
          </button>
        </div>
        <pre className="overflow-x-auto px-5 py-5 font-mono text-[11px] leading-[1.8] bg-avs-accent text-avs-secondary/80">
          <code>{code}</code>
        </pre>
      </div>

      <div className="p-4">
        <button
          onClick={download}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-sm font-bold text-avs-secondary transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: combo.accentHex, boxShadow: `0 4px 16px ${combo.accentHex}30` }}
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
          <Download size={14} aria-hidden />
          Télécharger le combo
          <ArrowUpRight size={12} className="opacity-60" aria-hidden />
        </button>
      </div>
    </div>
  );
}
