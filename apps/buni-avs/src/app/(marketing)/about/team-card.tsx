'use client';

interface TeamCardProps {
  name: string;
  role: string;
  origin: string;
  pattern: string;
}

export function TeamCard({ name, role, origin, pattern }: TeamCardProps) {
  return (
    <div
      className="team-card group overflow-hidden rounded-2xl transition-all duration-300"
      style={{ background: 'var(--about-surface)', border: '1px solid var(--about-border)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--about-primary-20)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(192,87,62,0.10)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--about-border)';
        (e.currentTarget as HTMLElement).style.transform = 'none';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Pattern preview — clipped, scales on hover */}
      <div className="relative h-28 overflow-hidden">
        <div className={`${pattern} team-pattern absolute inset-0`} />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-10" style={{ background: 'linear-gradient(to top, var(--about-surface), transparent)' }} aria-hidden />
        {/* Floating initial */}
        <div className="absolute bottom-3 left-4 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/20">
          <div className={`${pattern} absolute inset-0`} />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="font-display text-sm font-black text-white drop-shadow">{name.charAt(0)}</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-2">
        <p
          className="font-display text-sm font-bold leading-tight"
          style={{ color: 'var(--about-text)', letterSpacing: '-0.01em' }}
        >
          {name}
        </p>
        <p className="mt-1 text-[11px] font-semibold leading-snug" style={{ color: 'var(--about-primary)' }}>
          {role}
        </p>
        <p className="mt-2 text-[11px]" style={{ color: 'var(--about-hint)' }}>
          {origin}
        </p>
      </div>
    </div>
  );
}
