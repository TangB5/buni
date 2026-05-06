# Patterns Data Management

## Quick Start: Add a New Pattern

1. Open `patterns-data.ts`
2. Add a new object to the `PATTERNS_DOCS` array:

```typescript
{
  id: 'unique-id',
  slug: 'unique-slug',
  nameFr: 'Pattern Name in French',
  nameLocal: 'Pattern Name in Local Language',
  type: 'NDOP', // or KENTE, BOGOLAN, etc.
  svgPattern: 'avs-svg-pattern-ndop6', // CSS class for SVG pattern
  origin: {
    people: 'Ethnic Group',
    region: 'Region Name',
    country: 'Country Name',
    flag: '🇨🇲',
    coords: [latitude, longitude],
  },
  era: 'Time Period',
  license: 'cc-by',
  colors: [
    { hex: '#HEXCODE', name: 'Color Name', meaning: 'Symbolic meaning' },
  ],
  summary: 'Brief description',
  history: 'Historical background',
  technique: 'How it is made',
  symbolism: 'What it symbolizes',
  ceremonial: 'When/how it is used',
  symbols: [
    {
      name: 'Symbol Name',
      nameFr: 'French Name',
      cssPreview: '#HEXCODE',
      meaning: 'What it means',
      usage: 'How it is used',
      sacred: true,
    },
  ],
  sources: ['Source 1', 'Source 2'],
  downloads: 0,
  views: 0,
}
```

## Available SVG Patterns

Use one of these for the `svgPattern` field:

- `avs-svg-pattern-ndop6`
- `avs-svg-pattern-ndop-bamoum`
- `avs-svg-pattern-ndop-symbol-1` through `5`
- `avs-svg-pattern-toghu-bamenda`
- `avs-svg-pattern-toghu-bamileke`

## Using in Your Page

```typescript
import { PATTERNS_DOCS } from '@/features/patterns/data/patterns-data';

// In your component:
{PATTERNS_DOCS.map(pattern => (
  <div key={pattern.id} className={pattern.svgPattern}>
    {/* Your content */}
  </div>
))}
```

That's it! No setup needed. 🎨
