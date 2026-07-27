import { Combo, ComboColor } from '../data';
import { colorByRole, hexToHsl, hexToRgb, getContrastRatio, getAccessibilityLevel } from '../utils';

export function ColorInfoPanel({ color, combo }: { color: ComboColor; combo: Combo }) {
  const hsl = hexToHsl(color.hex);
  const rgb = hexToRgb(color.hex);
  const primary = colorByRole(combo, 'primary');
  const secondary = colorByRole(combo, 'secondary');
  
  const contrastWithPrimary = getContrastRatio(color.hex, primary.hex);
  const contrastWithSecondary = getContrastRatio(color.hex, secondary.hex);
  const contrastWithBlack = getContrastRatio(color.hex, '#1D1D1B');
  const contrastWithWhite = getContrastRatio(color.hex, '#F5EBE0');
  
  const accPrimary = getAccessibilityLevel(contrastWithPrimary);
  const accSecondary = getAccessibilityLevel(contrastWithSecondary);
  const accBlack = getAccessibilityLevel(contrastWithBlack);
  const accWhite = getAccessibilityLevel(contrastWithWhite);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-avs-accent/5 p-2">
          <p className="font-mono text-[8px] uppercase tracking-wide text-avs-accent/40">HSL</p>
          <p className="font-mono text-[10px] text-avs-accent">
            {hsl.h}° {hsl.s}% {hsl.l}%
          </p>
        </div>
        <div className="rounded-lg bg-avs-accent/5 p-2">
          <p className="font-mono text-[8px] uppercase tracking-wide text-avs-accent/40">RGB</p>
          <p className="font-mono text-[10px] text-avs-accent">
            {rgb.r} {rgb.g} {rgb.b}
          </p>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <p className="font-mono text-[8px] uppercase tracking-wide text-avs-accent/40">Contraste & Accessibilité</p>
        
        <div className="flex items-center justify-between text-[9px]">
          <span className="text-avs-accent/60">vs Primary</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-avs-accent">{contrastWithPrimary.toFixed(2)}:1</span>
            <span className={`font-bold ${accPrimary.color}`}>{accPrimary.level}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-[9px]">
          <span className="text-avs-accent/60">vs Secondary</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-avs-accent">{contrastWithSecondary.toFixed(2)}:1</span>
            <span className={`font-bold ${accSecondary.color}`}>{accSecondary.level}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-[9px]">
          <span className="text-avs-accent/60">vs Noir</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-avs-accent">{contrastWithBlack.toFixed(2)}:1</span>
            <span className={`font-bold ${accBlack.color}`}>{accBlack.level}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-[9px]">
          <span className="text-avs-accent/60">vs Blanc</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-avs-accent">{contrastWithWhite.toFixed(2)}:1</span>
            <span className={`font-bold ${accWhite.color}`}>{accWhite.level}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
