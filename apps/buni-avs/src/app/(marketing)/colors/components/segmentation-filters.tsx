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
    <div className="flex flex-wrap gap-1.5">
      <span className="font-mono text-[9px] font-bold uppercase tracking-wide text-avs-accent/40 self-center mr-1">
        {label}
      </span>
      <button
        onClick={() => onFilterChange(type, '')}
        className={`rounded-md px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide transition-colors ${
          !activeFilters[type] ? 'bg-avs-primary text-avs-secondary' : 'text-avs-accent/40 hover:text-avs-accent/70'
        }`}
      >
        Tous
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onFilterChange(type, opt)}
          className={`rounded-md px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide transition-colors ${
            activeFilters[type] === opt ? 'bg-avs-primary text-avs-secondary' : 'text-avs-accent/40 hover:text-avs-accent/70'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="rounded-xl border border-avs-accent/9 bg-avs-accent/[0.02] p-4 space-y-3">
      <FilterGroup type="region" options={regions} label="Région" />
      <FilterGroup type="culture" options={cultures} label="Culture" />
      <FilterGroup type="theme" options={themes} label="Thème" />
    </div>
  );
}
