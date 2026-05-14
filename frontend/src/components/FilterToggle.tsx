import type { FilterOptions } from '../types/index';

interface FilterToggleProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export default function FilterToggle({ filters, onFilterChange }: FilterToggleProps) {
  const toggleFilter = (key: keyof FilterOptions) => {
    onFilterChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  const filterButtons = [
    { key: 'freeOnly' as keyof FilterOptions, label: 'Free Only', icon: '💰' },
    { key: 'evCharging' as keyof FilterOptions, label: 'EV Charging', icon: '⚡' },
    { key: 'coveredParking' as keyof FilterOptions, label: 'Covered', icon: '🏠' },
    { key: 'handicapAccessible' as keyof FilterOptions, label: 'Accessible', icon: '♿' },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {filterButtons.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => toggleFilter(key)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            flex items-center gap-2 shadow-md
            ${
              filters[key]
                ? 'bg-primary text-white scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
