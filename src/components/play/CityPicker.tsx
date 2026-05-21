import { cityList } from "@/data/catalog";

interface CityPickerProps {
  onSelect: (city: string) => void;
}

export function CityPicker({ onSelect }: CityPickerProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
        Choose a city
      </h3>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Local history quests — ideal for Circles Groups later.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {cityList.map((city) => (
          <button
            key={city}
            type="button"
            className="btn-secondary justify-start py-4 text-left font-display text-lg"
            onClick={() => onSelect(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
