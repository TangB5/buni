# SVG Pattern Migration Guide

## Overview

This guide explains how to replace **CSS patterns** with **SVG patterns** in the buni-avs pattern page.

### Why migrate to SVG patterns?
- **Better visual quality** - SVG provides crisp, scalable graphics
- **File efficiency** - Reusable SVG files vs. inline CSS
- **Easier management** - Edit patterns once, use everywhere
- **Performance** - Smaller bundle sizes with optimized SVGs

---

## Available SVG Patterns

Your SVG files are located in `/public/patterns/`:

| SVG File | Description |
|----------|-------------|
| `ndop1.svg` | Ndop pattern variant 1 |
| `ndop2.svg` | Ndop pattern variant 2 |
| `ndop3.svg` | Ndop pattern variant 3 |
| `ndop4.svg` | Ndop pattern variant 4 |
| `ndop5.svg` | Ndop pattern variant 5 |
| `ndop6.svg` | Ndop pattern variant 6 |
| `ndop-bamoum.svg` | Ndop Bamoum (Cameroon) |
| `toghu-bamileke.svg` | Toghu Bamiléké (Cameroon) |
| `toghu-bamenda.svg` | Toghu Bamenda (Cameroon) |

---

## CSS to SVG Pattern Mapping

The new `SvgPatternDisplay` component automatically maps CSS classes to SVG files:

```typescript
export const PATTERN_CSS_TO_SVG: Record<string, string> = {
  'avs-pattern-kente-royale': 'ndop1',
  'avs-pattern-kente-etoile': 'ndop2',
  'avs-pattern-ndop-ceremoniel': 'ndop3',
  'avs-pattern-ndop-sultan': 'ndop-bamoum',
  'avs-pattern-bogolan-terre': 'ndop4',
  'avs-pattern-bogolan-fanga': 'ndop5',
  'avs-pattern-adinkra-sankofa': 'ndop6',
  'avs-pattern-wax-dakar': 'toghu-bamileke',
  'avs-pattern-wax-lagos': 'toghu-bamenda',
  // ... more mappings
};
```

---

## How to Use SVG Patterns in Your Components

### Step 1: Import the Component

```tsx
import { PatternReplacer } from '@/features/patterns/components/SvgPatternDisplay';
```

### Step 2: Replace CSS Class with PatternReplacer

**Before (CSS Pattern):**
```tsx
<div className="avs-pattern-ndop-sultan h-64 w-64">
  Content here
</div>
```

**After (SVG Pattern):**
```tsx
<PatternReplacer 
  cssClass="avs-pattern-ndop-sultan" 
  className="h-64 w-64"
>
  Content here
</PatternReplacer>
```

---

## Migration Steps for Pattern Page

### Location: `src/app/(marketing)/patterns/page.tsx`

### 1. **Add Import**
At the top of the file, add:
```tsx
import { PatternReplacer } from '@/features/patterns/components/SvgPatternDisplay';
```

### 2. **Replace Pattern Cover (Line ~221)**

**Before:**
```tsx
<div className={`${pattern.cssClass} relative h-52`}>
  {/* Layered overlay */}
  <div className="absolute inset-0" style={{ ... }} />
</div>
```

**After:**
```tsx
<div className="relative h-52" style={{ background: 'var(--enc-surface)' }}>
  <PatternReplacer cssClass={pattern.cssClass} className="absolute inset-0" />
  {/* Layered overlay */}
  <div className="absolute inset-0" style={{ ... }} />
</div>
```

### 3. **Replace Sidebar Pattern Swatch (Line ~669)**

**Before:**
```tsx
<div className={`${p.cssClass} relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10 transition-transform duration-300 group-hover:scale-105`} />
```

**After:**
```tsx
<PatternReplacer 
  cssClass={p.cssClass} 
  className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10 transition-transform duration-300 group-hover:scale-105" 
/>
```

### 4. **Replace Topbar Background (Line ~543)**

**Before:**
```tsx
<div className="avs-pattern-wax-dakar pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden />
```

**After:**
```tsx
<PatternReplacer 
  cssClass="avs-pattern-wax-dakar" 
  className="pointer-events-none absolute inset-0 opacity-[0.03]" 
/>
```

### 5. **Replace Empty State Pattern (Line ~645)**

**Before:**
```tsx
<div className="avs-pattern-wax-dakar h-12 w-12 rounded-full opacity-30" aria-hidden />
```

**After:**
```tsx
<PatternReplacer 
  cssClass="avs-pattern-wax-dakar" 
  className="h-12 w-12 rounded-full opacity-30" 
/>
```

### 6. **Replace Artisan Quote Pattern (Line ~428)**

**Before:**
```tsx
<div className={`${pattern.cssClass} relative h-9 w-9 shrink-0 overflow-hidden rounded-full`}
  style={{ border: '1.5px solid var(--enc-border)' }}>
  {/* Content */}
</div>
```

**After:**
```tsx
<PatternReplacer 
  cssClass={pattern.cssClass} 
  className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full" 
  style={{ border: '1.5px solid var(--enc-border)' }}
>
  {/* Content */}
</PatternReplacer>
```

---

## Component API Reference

### `PatternReplacer`
The easiest way to migrate - automatically converts CSS classes to SVG.

```tsx
<PatternReplacer 
  cssClass="avs-pattern-ndop-sultan"    // Required: CSS class name
  className="h-64 w-64"                 // Optional: Tailwind classes
  children={/* ... */}                  // Optional: Child elements
/>
```

### `SvgPatternBackground`
For advanced usage - directly use SVG file names.

```tsx
<SvgPatternBackground 
  patternKey="ndop-bamoum"              // Required: SVG filename (without .svg)
  className="h-64 w-64"                 // Optional: Tailwind classes
>
  Content here
</SvgPatternBackground>
```

### `SvgPatternDisplay`
Low-level component for full control.

```tsx
<SvgPatternDisplay 
  patternKey="ndop-bamoum"              // Required: SVG filename
  className="h-64 w-64"                 // Optional: Tailwind classes
  alt="Ndop Bamoum pattern"             // Optional: Accessibility text
  priority={false}                      // Optional: Prioritize loading
/>
```

---

## Adding New SVG Patterns

### 1. **Add SVG File**
Place your SVG file in `/public/patterns/`:
```
/public/patterns/my-new-pattern.svg
```

### 2. **Update Mapping (Optional)**
If you want to map a CSS class to this new SVG, update the mapping in `SvgPatternDisplay.tsx`:

```typescript
export const PATTERN_CSS_TO_SVG: Record<string, string> = {
  // ... existing mappings
  'avs-pattern-my-custom': 'my-new-pattern',
};
```

### 3. **Use in Component**
```tsx
// Using direct SVG key
<SvgPatternBackground patternKey="my-new-pattern" className="h-64" />

// Or using CSS class mapping
<PatternReplacer cssClass="avs-pattern-my-custom" className="h-64" />
```

---

## Fallback Behavior

If a CSS class has no SVG mapping defined, `PatternReplacer` will:
1. Log a warning to console
2. Fall back to the original CSS class
3. Render normally with CSS pattern

This means **migration is non-breaking** - old code continues to work!

---

## Performance Tips

### 1. **Lazy Load Patterns**
SVG patterns are loaded on-demand via fetch. They're automatically cached by the browser.

### 2. **Optimize SVG Files**
Before adding SVGs to `/public/patterns/`:
```bash
# Using SVGO (recommended)
npx svgo input.svg --output optimized.svg

# Or online: https://jakearchibald.github.io/svgomg/
```

### 3. **Use Background Images for Repeating Patterns**
```tsx
<SvgPatternBackground patternKey="ndop-bamoum" className="h-96">
  Content will repeat the pattern in background
</SvgPatternBackground>
```

---

## Troubleshooting

### SVG Not Loading?

1. **Check filename**: Make sure your SVG file exists in `/public/patterns/`
2. **Check console**: Look for error messages about fetch failures
3. **Check mapping**: If using `PatternReplacer`, verify CSS class is mapped

### SVG Looks Wrong?

1. **Check SVG dimensions**: Ensure the SVG viewBox is set correctly
2. **Check size attributes**: Remove hardcoded width/height from SVG
3. **Use inspect element**: Check if `backgroundImage` URL is correct

### Performance Issues?

1. **Optimize SVG size**: Run through SVGO
2. **Reduce number of patterns**: Limit how many patterns load simultaneously
3. **Use `priority` prop**: For above-the-fold patterns

---

## Complete Example: Before and After

### Before (Pure CSS)
```tsx
'use client';

export default function PatternPage() {
  return (
    <div>
      <div className="avs-pattern-ndop-sultan h-64 w-full">
        Header
      </div>
      <div className="grid grid-cols-3 gap-4 p-8">
        {patterns.map(p => (
          <div key={p.id} className={`${p.cssClass} h-40 rounded-lg`}>
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### After (Using SVG)
```tsx
'use client';
import { PatternReplacer } from '@/features/patterns/components/SvgPatternDisplay';

export default function PatternPage() {
  return (
    <div>
      <PatternReplacer 
        cssClass="avs-pattern-ndop-sultan" 
        className="h-64 w-full"
      >
        Header
      </PatternReplacer>
      <div className="grid grid-cols-3 gap-4 p-8">
        {patterns.map(p => (
          <PatternReplacer 
            key={p.id}
            cssClass={p.cssClass} 
            className="h-40 rounded-lg"
          >
            {p.name}
          </PatternReplacer>
        ))}
      </div>
    </div>
  );
}
```

---

## Summary

| Aspect | CSS Pattern | SVG Pattern |
|--------|-------------|------------|
| **Import** | None | `SvgPatternDisplay` |
| **Usage** | `className="avs-pattern-x"` | `<PatternReplacer cssClass="avs-pattern-x" />` |
| **File size** | Inline CSS (kilobytes) | External SVG (optimized) |
| **Quality** | Rasterized | Vector (scalable) |
| **Maintainability** | Edit CSS file | Edit SVG file |
| **Reusability** | Browser renders each time | Browser caches SVG |

**Next step:** Run the migration on your pattern pages and test responsiveness across devices! 🎨
