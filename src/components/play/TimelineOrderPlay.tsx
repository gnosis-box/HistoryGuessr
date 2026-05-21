import { useState } from "react";
import type { TimelineOrderChallenge } from "@/types/game";

interface TimelineOrderPlayProps {
  challenge: TimelineOrderChallenge;
  disabled: boolean;
  onSubmit: (order: string[]) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function TimelineOrderPlay({
  challenge,
  disabled,
  onSubmit,
}: TimelineOrderPlayProps) {
  const [order, setOrder] = useState(() =>
    shuffle(challenge.events.map((e) => e.id)),
  );

  function move(id: string, direction: -1 | 1) {
    if (disabled) return;
    const idx = order.indexOf(id);
    const next = idx + direction;
    if (next < 0 || next >= order.length) return;
    const updated = [...order];
    [updated[idx], updated[next]] = [updated[next], updated[idx]];
    setOrder(updated);
  }

  return (
    <div className="glass-card space-y-4 rounded-2xl p-5">
      <p className="text-sm text-[var(--text-secondary)]">
        Use arrows to arrange events from earliest to latest.
      </p>
      <ul className="space-y-2">
        {order.map((id, index) => {
          const event = challenge.events.find((e) => e.id === id)!;
          return (
            <li
              key={id}
              className="flex items-center gap-2 rounded-xl bg-[var(--surface-soft)] px-3 py-3"
            >
              <span className="w-6 font-display text-lg text-[var(--accent)]">
                {index + 1}
              </span>
              <span className="flex-1 text-sm text-[var(--text-primary)]">
                {event.label}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="btn-secondary px-2 py-1 text-xs"
                  disabled={disabled || index === 0}
                  onClick={() => move(id, -1)}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="btn-secondary px-2 py-1 text-xs"
                  disabled={disabled || index === order.length - 1}
                  onClick={() => move(id, 1)}
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="btn-primary"
        disabled={disabled}
        onClick={() => onSubmit(order)}
      >
        Lock timeline
      </button>
    </div>
  );
}
