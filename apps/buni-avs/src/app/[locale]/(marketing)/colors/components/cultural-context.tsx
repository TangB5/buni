import { Combo } from '../data';
import { Sparkles } from 'lucide-react';
import { useTranslations } from '@/i18n';

export function CulturalContext({ combo, culturalContext }: { combo: Combo; culturalContext: any }) {
  const t = useTranslations('colors');
  const context = combo.region ? culturalContext[combo.region] : null;
  
  if (!context) return null;

  return (
    <div className="rounded-xl border border-avs-accent/9 bg-avs-accent/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={13} className={combo.accentClass} aria-hidden />
        <h3 className="font-display text-sm font-bold text-avs-accent">{t('culturalContextLabel', { defaultValue: 'Contexte Culturel' })}</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-wide text-avs-accent/40 mb-1">
            {t('region', { defaultValue: 'Région' })}
          </p>
          <p className="text-sm font-semibold text-avs-accent">{combo.region}</p>
          <p className="text-xs text-avs-accent/60 mt-1">{context.description}</p>
        </div>
        
        {combo.culture && (
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-wide text-avs-accent/40 mb-1">
              {t('culture', { defaultValue: 'Culture' })}
            </p>
            <p className="text-sm font-semibold text-avs-accent">{combo.culture}</p>
          </div>
        )}
        
        {combo.theme && (
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-wide text-avs-accent/40 mb-1">
              {t('theme', { defaultValue: 'Thème' })}
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
