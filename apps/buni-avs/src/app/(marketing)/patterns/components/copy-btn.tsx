'use client';

import { useState, useCallback } from 'react';

export function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [text]);

  return (
    <button
      onClick={() => void copy()}
      className="border-avs-accent/10 text-avs-accent/50 hover:text-avs-primary hover:border-avs-primary/20 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[9px] font-semibold transition-all duration-150"
    >
      <i className={`pi ${copied ? 'pi-check' : 'pi-copy'}`} style={{ fontSize: '9px' }} />
      {copied ? 'Copié !' : (label ?? text)}
    </button>
  );
}
