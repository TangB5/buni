# Pattern Management System Documentation

## Overview

This document describes the backend-driven pattern management system for the Buni project. The system follows clean architecture principles with Supabase backend storage and unified API services.

## Architecture

The system is organized into two main layers:

### 📦 Centralized Package: `@buni/patterns`

**Location:** `/packages/patterns/src/`

The `@buni/patterns` package provides types, transformers, and utilities for backend-driven pattern management.

#### Key Files:
- `registry.ts` - Backend pattern types, transformers, and utilities
- `index.ts` - Public exports and CSS pattern mappings

#### Exports:
```typescript
// Backend pattern types
export type { PatternDoc, PatternType, PatternColor, PatternSymbol, PatternOrigin }

// Frontend utilities
export { toSvgPatternMeta, getPatternsByType, searchPatterns, getPatternPalette }

// CSS pattern mappings
export const CSS_PATTERN_MAP: Record<string, string>
```

### 🎯 Feature Module: `/apps/buni-avs/src/features/patterns/`

#### Structure:
```
features/patterns/
├── services/
│   └── pattern.service.ts     # Unified API service
├── hooks/
│   └── usePatterns.ts         # React Query hooks
├── components/
│   ├── PatternCard.tsx        # Pattern display component
│   └── SvgPatternDisplay.tsx  # SVG pattern utilities
├── types/
│   └── index.ts               # TypeScript definitions
```

## Backend Integration

### Supabase Storage

Patterns are stored in Supabase with the following schema:

```sql
patterns (
  id uuid PRIMARY KEY,
  slug text UNIQUE,
  name_fr text,
  name_local text,
  type text CHECK (type IN ('NDOP','KENTE','BOGOLAN','ADINKRA','TOGHU','MUDCLOTH','BARKCLOTH')),
  svg_url text,
  storage_path text,
  origin jsonb, -- {people, region, country, flag, coords}
  era text,
  license text CHECK (license IN ('cc0','cc-by','cc-by-sa')),
  colors jsonb, -- [{hex, name, meaning}]
  summary text,
  history text,
  technique text,
  symbolism text,
  ceremonial text,
  symbols jsonb, -- [{name, nameFr, cssPreview, meaning, usage, sacred}]
  artisan_quote jsonb, -- {text, author, role, country}
  sources text[],
  downloads integer DEFAULT 0,
  views integer DEFAULT 0,
  created_at timestamp,
  updated_at timestamp
)
```

### API Service (`pattern.service.ts`)

The main API service connects to backend endpoints:

```typescript
export const patternService = {
  list: (filters: PatternFilters = {}) =>
    get<PatternsApiResponse>('/api/patterns', filters),
  
  bySlug: (slug: string) =>
    get<PatternApiResponse>(`/api/patterns/${slug}`),
  
  featured: () =>
    get<PatternsApiResponse>('/api/patterns?featured=true&limit=6'),
  
  create: (data: Partial<PatternDoc>) =>
    post<PatternDoc>('/api/patterns', data),
  
  update: (id: string, data: Partial<PatternDoc>) =>
    put<PatternDoc>(`/api/patterns/${id}`, data),
  
  remove: (id: string) =>
    del<void>(`/api/patterns/${id}`),
  
  trackView: (id: string): void => {
    void post(`/api/patterns/${id}/view`).catch(() => {/* silencieux */});
  },
};
```

### React Query Hooks (`usePatterns.ts`)

Standardized hooks for data fetching and caching:

```typescript
export function usePatterns(filters: PatternFilters = {})
export function usePattern(slug: string)
export function useFeaturedPatterns()
export function useCreatePattern()
```

## Pattern Types

### Backend Pattern (`PatternDoc`)

Complete pattern document returned by backend and stored in Supabase:

```typescript
export interface PatternDoc {
  id: string;
  slug: string;
  nameFr: string;
  nameLocal: string;
  type: PatternType;
  svgPattern?: string;
  cssClass: string;
  storagePath?: string;
  svgUrl?: string;
  origin: PatternOrigin;
  era: string;
  license: PatternLicense;
  colors: PatternColor[];
  summary: string;
  history: string;
  technique: string;
  symbolism: string;
  ceremonial: string;
  symbols: PatternSymbol[];
  artisanQuote?: ArtisanQuote;
  sources: string[];
  downloads: number;
  views: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### Frontend View Model (`SvgPatternMeta`)

Lightweight structure for UI components, transformed from `PatternDoc`:

```typescript
export interface SvgPatternMeta {
  id: string;
  slug: string;
  name: string;
  localName: string;
  type: PatternType;
  svgUrl: string;
  origin: string;
  region: string;
  country: string;
  colors: string[];
  description: string;
  license: PatternLicense;
  downloads: number;
  views: number;
}
```

## Components

### SvgPattern Component

**Location:** `/apps/buni-avs/src/components/ui/SvgPattern.tsx`

Universal component for displaying SVG patterns from backend URLs:

```typescript
<SvgPattern 
  name="ndop-bamoum" 
  size={256}
  animated={true}
  showDownload={true}
  showInfo={true}
/>
```

#### Props:
- `name: string` - Pattern slug or key
- `size?: number` - Size in pixels (default: 256)
- `asBackground?: boolean` - Display as background
- `animated?: boolean` - Enable Framer Motion animations
- `showDownload?: boolean` - Show download button
- `showInfo?: boolean` - Show cultural info on hover

### PatternCard Component

**Location:** `/apps/buni-avs/src/features/patterns/components/PatternCard.tsx`

Card component for pattern listings with backend data:

```typescript
<PatternCard 
  pattern={toSvgPatternMeta(pattern)} // Transform backend data
  index={0}
  featured={false}
  className="custom-class"
/>
```

### Data Transformation

Backend `PatternDoc` data is transformed for frontend display:

```typescript
import { toSvgPatternMeta } from '@buni/patterns';

// Transform backend data for UI components
const uiPattern = toSvgPatternMeta(backendPattern);
```

## Adding New Patterns

### 1. Backend Pattern Management

Patterns are now managed through the backend and stored in Supabase:

#### Step 1: Upload SVG to Supabase Storage
```bash
# Upload SVG file to patterns bucket
supabase storage upload patterns/my-pattern.svg
```

#### Step 2: Create Pattern Record in Database
```typescript
const { mutate: createPattern } = useCreatePattern();

createPattern({
  nameFr: 'Nom du motif',
  nameLocal: 'Pattern Name',
  type: 'KENTE',
  svgUrl: 'https://your-supabase-url.storage/v1/patterns/my-pattern.svg',
  storagePath: 'patterns/my-pattern.svg',
  origin: {
    people: 'People Name',
    region: 'Region Name',
    country: 'Country',
    flag: '🇨🇲',
    coords: [latitude, longitude],
  },
  colors: [
    { hex: '#D4A017', name: 'Or', meaning: 'Royauté' },
    { hex: '#1D1D1B', name: 'Noir', meaning: 'Maturité' },
    { hex: '#C0573E', name: 'Rouge', meaning: 'Bravoure' },
  ],
  summary: 'Description du motif',
  history: 'Histoire du motif',
  technique: 'Technique de fabrication',
  symbolism: 'Symbolisme culturel',
  ceremonial: 'Usage cérémoniel',
  symbols: [
    {
      name: 'Symbol Name',
      nameFr: 'Nom du symbole',
      cssPreview: '#D4A017',
      meaning: 'Signification',
      usage: 'Usage',
      sacred: false,
    },
  ],
  sources: ['Source 1', 'Source 2'],
  license: 'cc-by',
});
```

#### Step 3: Backend Returns PatternDoc
The backend returns a complete `PatternDoc` object with all metadata.

### 2. Frontend Usage

```typescript
import { toSvgPatternMeta } from '@buni/patterns';

// Transform backend data for UI components
const { data: pattern } = usePattern('my-pattern');
const uiPattern = toSvgPatternMeta(pattern);

// Use in components
<PatternCard pattern={uiPattern} />
<SvgPattern name={pattern.slug} svgUrl={pattern.svgUrl} />
```

## CSS Pattern Classes

The system uses standardized CSS classes for patterns:

```css
.avs-pattern-kente-royale
.avs-pattern-ndop-sultan
.avs-pattern-bogolan-fanga
.avs-pattern-wax-dakar
.avs-pattern-adinkra-sankofa
.avs-pattern-kuba-kasai
.avs-pattern-berber-amazigh
.avs-pattern-ndebele-amabhaxa
```

## Data Flow

```
1. SVG Registry (@buni/patterns)
   ↓
2. SvgPattern Component (UI)
   ↓
3. Pattern Service (API)
   ↓
4. React Query Hooks (State)
   ↓
5. Pattern Components (Display)
```

## Migration Guide

### From Old System

The old system had:
- ❌ Duplicate pattern registries
- ❌ Static data files
- ❌ Multiple conflicting services
- ❌ Inconsistent types

### To New System

The new system provides:
- ✅ Single centralized registry
- ✅ Unified API service
- ✅ Consistent TypeScript types
- ✅ Clean architecture

### Breaking Changes

1. **Import Changes:**
   ```typescript
   // Old
   import { PATTERNS_DOCS } from './data/patterns-data';
   
   // New
   import { SVG_REGISTRY } from '@buni/patterns';
   ```

2. **Service Usage:**
   ```typescript
   // Old
   import { patternService } from './hooks/usePatterns';
   
   // New
   import { patternService } from './services/pattern.service';
   ```

3. **Pattern Types:**
   ```typescript
   // Old
   type Pattern = PatternDoc;
   
   // New
   type Pattern = DatabasePattern | SvgPatternMeta;
   ```

## Best Practices

### 1. Pattern Registration
- Always add new patterns to the centralized `@buni/patterns` package
- Use consistent naming conventions
- Include proper metadata (origin, colors, license)

### 2. Component Usage
- Use `SvgPattern` component for all SVG displays
- Use `PatternCard` for pattern listings
- Leverage React Query hooks for data fetching

### 3. API Integration
- Use the unified `patternService` for all API calls
- Implement proper error handling
- Use TypeScript types for type safety

### 4. CSS Classes
- Use the standardized CSS pattern classes
- Follow the naming convention: `avs-pattern-{type}-{style}`
- Ensure consistency across the application

## Troubleshooting

### Common Issues

1. **Import Errors:**
   - Ensure `@buni/patterns` is built: `cd packages/patterns && npx tsc`
   - Check package.json dependencies

2. **Type Errors:**
   - Use proper TypeScript types from the centralized package
   - Ensure pattern registry is properly typed

3. **Missing Patterns:**
   - Verify SVG files exist in `/public/patterns/`
   - Check pattern registration in `registry.ts`

4. **CSS Issues:**
   - Verify CSS pattern classes are defined
   - Check CSS pattern mappings in `@buni/patterns`

## Performance Considerations

- SVG patterns are loaded via Next.js Image optimization
- React Query provides intelligent caching
- Pattern registry is statically compiled
- CSS patterns use efficient background rendering

## Future Enhancements

1. **Pattern Generator:** Interactive pattern creation tools
2. **Advanced Search:** Full-text search across pattern metadata
3. **Pattern Editor:** Visual editor for pattern customization
4. **Export Options:** Multiple format exports (SVG, PNG, JSON)
5. **Pattern Analytics:** Usage tracking and popular patterns

---

**Last Updated:** May 2026  
**Version:** 2.0 (Clean Architecture)  
**Maintainer:** Buni Development Team
