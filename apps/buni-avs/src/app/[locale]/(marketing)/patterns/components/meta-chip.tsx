export function MetaChip({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-avs-secondary-dark border-avs-accent/10 rounded-xl border px-3 py-2.5">
      <p className="text-avs-accent/40 mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase">
        {label}
      </p>
      <p className="text-avs-accent flex items-center gap-1 text-xs font-semibold">
        <i className={`pi ${icon} text-avs-primary shrink-0`} style={{ fontSize: '10px' }} />
        {value}
      </p>
    </div>
  );
}
