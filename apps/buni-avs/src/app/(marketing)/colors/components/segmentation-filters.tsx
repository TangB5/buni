'use client';

import { Combo, FilterType, FilterValue } from '../data';

export function SegmentationFilters({
  combos,
  activeFilters,
  onFilterChange,
}: {
  combos: Combo[];
  activeFilters: Partial<Record<FilterType, FilterValue>>;
  onFilterChange: (type: FilterType, value: FilterValue) => void;
}) {
  const regions = Array.from(new Set(combos.map((c) => c.region).filter((val): val is string => Boolean(val))));
  const cultures = Array.from(new Set(combos.map((c) => c.culture).filter((val): val is string => Boolean(val))));
  const themes = Array.from(new Set(combos.map((c) => c.theme).filter((val): val is string => Boolean(val))));

  const FilterGroup = ({
    type,
    options,
    label,
  }: {
    type: FilterType;
    options: string[];
    label: string;
  }) => (
    <label className="flex flex-col gap-2 text-sm text-avs-accent/70 sm:min-w-45">
      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-avs-accent/40">
        {label}
      </span>
      <select
        value={activeFilters[type] ?? ''}
        onChange={(e) => onFilterChange(type, e.target.value as FilterValue)}
        className="rounded-lg border border-avs-accent/10 bg-avs-secondary px-3 py-2.5 text-sm text-avs-accent outline-none transition focus:border-avs-primary focus:ring-2 focus:ring-avs-primary/10"
      >
        <option value="">Tous</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="rounded-xl border border-avs-accent/9 bg-avs-accent/2 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
        <FilterGroup type="region" options={regions} label="Région" />
        <FilterGroup type="culture" options={cultures} label="Culture" />
        <FilterGroup type="theme" options={themes} label="Thème" />
      </div>
    </div>
  );
}
