import type { GuessCoordinates } from "@/types/game";
import { GameMap } from "@/components/GameMap";

interface MapPointPickerProps {
  label: string;
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export function MapPointPicker({
  label,
  lat,
  lng,
  onChange,
}: MapPointPickerProps) {
  const point: GuessCoordinates = { lat, lng };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-[var(--text-muted)]">{label}</p>
      <p className="text-[10px] text-[var(--text-secondary)]">
        Click the map to set the point · {lat.toFixed(4)}, {lng.toFixed(4)}
      </p>
      <GameMap
        answerLat={lat}
        answerLng={lng}
        guess={point}
        showAnswer={false}
        onGuess={(c) => onChange(c.lat, c.lng)}
        onValidate={() => {}}
        canValidate={false}
      />
      <div className="grid grid-cols-2 gap-2 text-sm">
        <label>
          Lat
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => onChange(Number(e.target.value), lng)}
            className="mt-0.5 w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-1"
          />
        </label>
        <label>
          Lng
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => onChange(lat, Number(e.target.value))}
            className="mt-0.5 w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-1"
          />
        </label>
      </div>
    </div>
  );
}
