'use client';

interface TeamCardProps {
  name:    string;
  role:    string;
  origin:  string;
  pattern: string;
}

export function TeamCard({ name, role, origin, pattern }: TeamCardProps) {
  return (
    <div className="team-card group overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary transition-all duration-300 hover:-translate-y-1 hover:border-avs-primary/20 hover:shadow-avs-md">
      {/* Pattern preview */}
      <div className="relative h-28 overflow-hidden">
        <div className={`${pattern} team-pattern absolute inset-0`} />
        {/* Bottom fade — justified inline: gradient to transparent */}
        <div
          className="absolute inset-x-0 bottom-0 h-10"
          style={{ background: 'linear-gradient(to top, var(--avs-secondary), transparent)' }}
          aria-hidden
        />
        {/* Floating initial */}
        <div className="absolute bottom-3 left-4 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-avs-secondary/20">
          <div className={`${pattern} absolute inset-0`} />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="font-display text-sm font-black text-avs-secondary drop-shadow">
              {name.charAt(0)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-2">
        <p className="font-display text-sm font-bold leading-tight text-avs-accent" style={{ letterSpacing: '-0.01em' }}>
          {name}
        </p>
        <p className="mt-1 text-[11px] font-semibold leading-snug text-avs-primary">
          {role}
        </p>
        <p className="mt-2 text-[11px] text-avs-accent/35">
          {origin}
        </p>
      </div>
    </div>
  );
}