# @buni/i18n

Package de gestion de l'internationalisation (i18n) pour le projet Buni, basé sur `next-intl`.

## Installation

```bash
pnpm install @buni/i18n
```

## Utilisation

### 1. Configuration du provider

Dans votre app root layout (`app/layout.tsx`):

```tsx
import { I18nProvider, messages, defaultLocale } from '@buni/i18n';
import { getLocale } from 'next-intl/server';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <I18nProvider messages={messages[locale as keyof typeof messages]} locale={locale}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
```

### 2. Utilisation du hook

Dans vos composants:

```tsx
'use client';

import { useTranslations } from '@buni/i18n';

export function MyComponent() {
  const t = useTranslations('common');
  
  return (
    <div>
      <h1>{t('loading')}</h1>
      <button>{t('save')}</button>
    </div>
  );
}
```

### 3. Utilisation avec namespace

```tsx
const t = useTranslations('auth');
t('login'); // "Connexion" (fr) / "Login" (en)
```

## Locales disponibles

- `fr` (Français) - locale par défaut
- `en` (Anglais)

## Structure des traductions

Les traductions sont organisées par namespace dans `src/locales/`:

- `common`: Textes communs (boutons, actions)
- `nav`: Navigation
- `auth`: Authentification
- `theme`: Thème
- `errors`: Messages d'erreur

## API

### `I18nProvider`

Provider React pour envelopper votre application.

```tsx
<I18nProvider messages={messages} locale="fr">
  {children}
</I18nProvider>
```

### `useTranslations(namespace?)`

Hook pour accéder aux traductions.

```tsx
const t = useTranslations('common');
t('save'); // "Enregistrer"
```

### `locales`

Tableau des locales disponibles: `['fr', 'en']`

### `defaultLocale`

Locale par défaut: `'fr'`

### `messages`

Objet contenant toutes les traductions.

## Ajouter une nouvelle locale

1. Créez un fichier `src/locales/[locale].json`
2. Ajoutez la locale au tableau `locales` dans `src/config.ts`
3. Ajoutez les traductions correspondantes
