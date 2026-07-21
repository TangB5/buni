import { Combo } from '../data';
import { colorByRole, readableOn } from '../utils';
import { Sparkles } from 'lucide-react';

export function UsageExamples({ combo }: { combo: Combo }) {
  const primary   = colorByRole(combo, 'primary');
  const secondary = colorByRole(combo, 'secondary');
  const accent    = colorByRole(combo, 'accent');
  const neutral   = colorByRole(combo, 'neutral');

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles size={13} className={combo.accentClass} aria-hidden />
        <h3 className="font-display text-sm font-bold text-avs-accent">Exemples d&apos;usage</h3>
      </div>

      {/* Bannière dégradée */}
      <div
        className="relative overflow-hidden rounded-xl px-5 py-6"
        style={{ background: `linear-gradient(120deg, ${primary.hex} 0%, ${accent.hex} 100%)` }}
      >
        <p className="font-display text-lg font-black leading-tight" style={{ color: readableOn(primary.hex) }}>
          {combo.name}
        </p>
        <p className="mt-1 text-xs" style={{ color: readableOn(primary.hex), opacity: 0.75 }}>
          {combo.origin}
        </p>
      </div>

      {/* Bouton + Badge côte à côte */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-lg px-4 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
          style={{ background: primary.hex, color: readableOn(primary.hex) }}
        >
          Bouton principal
        </button>
        <button
          className="rounded-lg border px-4 py-2.5 text-sm font-bold transition-colors"
          style={{ borderColor: primary.hex, color: primary.hex, background: 'transparent' }}
        >
          Bouton secondaire
        </button>
        <span
          className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
          style={{ background: `${accent.hex}20`, color: accent.hex, border: `1px solid ${accent.hex}40` }}
        >
          Badge
        </span>
      </div>

      {/* Carte */}
      <div
        className="rounded-xl p-4"
        style={{ background: secondary.hex, border: `1px solid ${primary.hex}30` }}
      >
        <p className="text-sm font-bold" style={{ color: accent.hex }}>Titre de carte</p>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: readableOn(secondary.hex), opacity: 0.7 }}>
          Un aperçu de texte de corps sur fond secondaire, avec un titre en couleur d&apos;accent.
        </p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: `${accent.hex}20` }}>
          <div className="h-full w-2/3 rounded-full" style={{ background: primary.hex }} />
        </div>
      </div>

      {/* Alerte / bannière fine */}
      <div
        className="flex items-center gap-3 rounded-lg px-4 py-3 text-xs"
        style={{ background: `${neutral.hex}22`, borderLeft: `3px solid ${neutral.hex}` }}
      >
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: neutral.hex }} aria-hidden />
        <p className="text-avs-accent/70">Notification ou message d&apos;état utilisant la couleur neutre.</p>
      </div>

      {/* Tags multiples */}
      <div className="flex flex-wrap gap-2">
        {combo.colors.map((c) => (
          <span
            key={c.role}
            className="rounded-md px-2.5 py-1 text-[10px] font-semibold"
            style={{ background: c.hex, color: readableOn(c.hex) }}
          >
            #{c.role}
          </span>
        ))}
      </div>
    </div>
  );
}
