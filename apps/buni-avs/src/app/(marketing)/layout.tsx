// src/app/(marketing)/layout.tsx
// Layout pour le groupe (marketing) — pages publiques
// Le Header/Footer sont déjà dans le RootLayout,
// ce layout ajoute uniquement la structure propre aux pages marketing.

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {children}
    </div>
  );
}