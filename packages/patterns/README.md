# @buni/patterns - Universal Pattern System

Easy-to-use African patterns for any React project.

## 🚀 Quick Start

### Installation

```bash
npm install @buni/patterns
```

### Basic Usage

```jsx
import { UniversalPattern } from '@buni/patterns';

function App() {
  return (
    <div>
      {/* Simple pattern background */}
      <UniversalPattern type="KENTE" className="h-64" />
      
      {/* Pattern as section */}
      <UniversalPattern type="NDOP" as="section" className="py-8">
        <h1>Content with Ndop pattern</h1>
      </UniversalPattern>
      
      {/* Pattern with custom styles */}
      <UniversalPattern 
        type="BOGOLAN" 
        style={{ opacity: 0.3, borderRadius: '8px' }}
        className="p-4"
      >
        <p>Overlay content</p>
      </UniversalPattern>
    </div>
  );
}
```

## 🎨 Available Pattern Types

- `KENTE` - Kente patterns (Ghana)
- `NDOP` - Ndop patterns (Cameroon)
- `BOGOLAN` - Bogolan patterns (Mali)
- `ADINKRA` - Adinkra symbols (Ghana)
- `TOGHU` - Toghu patterns (Cameroon)
- `MUDCLOTH` - Mud cloth patterns
- `BARKCLOTH` - Bark cloth patterns
- `KUBA` - Kuba patterns (DRC)
- `BERBER` - Berber patterns (North Africa)
- `NDEBELE` - Ndebele patterns (Zimbabwe)

## 📋 Props API

### UniversalPattern Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | **Required** - Pattern type from the list above |
| `className` | `string` | `''` - Additional CSS classes |
| `style` | `React.CSSProperties` | `{}` - Inline styles |
| `children` | `React.ReactNode` | `undefined` - Content to render inside |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` - HTML tag to render |
| `onClick` | `() => void` | `undefined` - Click handler |

## 🎯 Advanced Examples

### Interactive Pattern Cards

```jsx
function PatternCard({ pattern, onClick }) {
  return (
    <UniversalPattern 
      type={pattern.type}
      className="p-6 rounded-lg cursor-pointer hover:scale-105 transition-transform"
      onClick={onClick}
    >
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded">
        <h3 className="font-bold text-lg">{pattern.name}</h3>
        <p className="text-sm opacity-75">{pattern.description}</p>
      </div>
    </UniversalPattern>
  );
}
```

### Pattern Sections

```jsx
function PatternSection({ title, type, children }) {
  return (
    <section className="py-16">
      <UniversalPattern 
        type={type}
        as="header"
        className="h-32 flex items-center justify-center"
      >
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          {title}
        </h1>
      </UniversalPattern>
      
      <main className="container mx-auto px-4">
        {children}
      </main>
    </section>
  );
}

// Usage
<PatternSection 
  title="African Patterns" 
  type="KENTE"
>
  <p>Your content here...</p>
</PatternSection>
```

### Pattern Overlays

```jsx
function PatternOverlay({ type, children }) {
  return (
    <div className="relative">
      <UniversalPattern 
        type={type}
        style={{ opacity: 0.15 }}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
```

## 🎨 CSS Classes

Each pattern type automatically maps to a specific CSS class:

```css
.avs-pattern-kente-royale      /* Kente patterns */
.avs-pattern-ndop-sultan       /* Ndop patterns */
.avs-pattern-bogolan-fanga     /* Bogolan patterns */
.avs-pattern-wax-dakar         /* Wax patterns */
.avs-pattern-adinkra-sankofa   /* Adinkra patterns */
.avs-pattern-toghu-bamileke    /* Toghu patterns */
.avs-pattern-mudcloth          /* Mud cloth patterns */
.avs-pattern-barkcloth         /* Bark cloth patterns */
.avs-pattern-kuba-kasai        /* Kuba patterns */
.avs-pattern-berber-amazigh    /* Berber patterns */
.avs-pattern-ndebele-amabhaxa  /* Ndebele patterns */
```

## 🔄 TypeScript Support

Full TypeScript support with proper type definitions:

```typescript
import { UniversalPattern } from '@buni/patterns';

// Fully typed props
<UniversalPattern 
  type="KENTE" // Autocomplete shows all pattern types
  className="p-4"
  onClick={() => console.log('clicked')}
/>
```

## 📦 Distribution

This package is designed for easy distribution:

- **Zero dependencies** - Works with any React project
- **Tree-shakable** - Only imports what you use
- **TypeScript first** - Full type safety
- **Framework agnostic** - Works with Next.js, Vite, Create React App

## 🌍 Cultural Context

These patterns represent authentic African textile traditions:

- **Kente**: Ghanaian royal weaving tradition
- **Ndop**: Cameroonian Bamoum sacred textiles
- **Bogolan**: Malian mud-dyed cloth tradition
- **Adinkra**: Ghanaian symbolic stamping tradition
- **Toghu**: Cameroonian Bamiléké prestige textiles

Each pattern includes cultural context and historical significance.

## 🤝 Contributing

To add new patterns:

1. Design the pattern with cultural authenticity
2. Add CSS class to the pattern system
3. Update the type definitions
4. Document the cultural significance

## 📄 License

All patterns are available under Creative Commons licenses (CC-BY, CC0, CC-BY-SA).

Please respect the cultural origins and attribute appropriately when using these patterns.
