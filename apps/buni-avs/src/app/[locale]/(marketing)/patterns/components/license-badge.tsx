export function LicenseBadge({ license }: { license: string }) {
  const variants: Record<string, string> = {
    cc0: 'bg-avs-primary/10 text-avs-primary   border border-avs-primary/20',
    'cc-by': 'bg-avs-primary/10 text-avs-primary   border border-avs-primary/20',
    'cc-by-sa': 'bg-avs-indigo/10  text-avs-indigo    border border-avs-indigo/20',
  };

  const labels: Record<string, string> = {
    cc0: 'CC0',
    'cc-by': 'CC BY',
    'cc-by-sa': 'CC BY-SA',
  };

  return (
    <span
      className={`rounded-lg px-2.5 py-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase backdrop-blur-sm ${variants[license]}`}
    >
      {labels[license]}
    </span>
  );
}
