import { Combo } from '../data';
import { CULTURAL_CONTEXT } from '../data';
import { Sparkles } from 'lucide-react';

export function CulturalContext({ combo }: { combo: Combo }) {
  const context = combo.region ? CULTURAL_CONTEXT[combo.region] : null;
  
  if (!context) return null;

  return (
    <div className="rounded-xl border border-avs-accent/9 bg-avs-accent/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={13} className={combo.accentClass} aria-hidden />
        <h3 className="font-display text-sm font-bold text-avs-accent">Contexte Culturel</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-wide text-avs-accent/40 mb-1">
            Région
          </p>
          <p className="text-sm font-semibold text-avs-accent">{combo.region}</p>
          <p className="text-xs text-avs-accent/60 mt-1">{context.description}</p>
        </div>
        
        {combo.culture && (
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-wide text-avs-accent/40 mb-1">
              Culture
            </p>
            <p className="text-sm font-semibold text-avs-accent">{combo.culture}</p>
          </div>
        )}
        
        {combo.theme && (
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-wide text-avs-accent/40 mb-1">
              Thème
            </p>
            <p className="text-sm font-semibold text-avs-accent">{combo.theme}</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-avs-accent/9">
          <p className="text-xs italic text-avs-accent/55">{context.significance}</p>
        </div>
      </div>
    </div>
  );
}
