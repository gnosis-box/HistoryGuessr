// src/components/hist/HistWalletTeaser.tsx
import { useCircles } from "@/hooks/use-circles";
import { historyGuessrGroup } from "@/lib/circles/config";
import { usePlayNavigation } from "@/context/PlayNavigation";
import { formatHist } from "@/utils/format";

export function HistWalletTeaser() {
  const { openHist } = usePlayNavigation();
  const { ledger } = useCircles();
  const total = ledger.pending + ledger.claimed;

  return (
    <button
      type="button"
      onClick={openHist}
      className="glass-card group w-full rounded-2xl border border-[var(--gold)]/20 p-4 text-left transition hover:border-[var(--gold)]/40"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
            {historyGuessrGroup.symbol} economy
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-[var(--gold-soft)]">
            {formatHist(total)} {historyGuessrGroup.symbol}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            How play → HIST → CRC works
          </p>
        </div>
        <span className="rounded-full border border-[var(--gold)]/30 px-3 py-1.5 text-xs font-medium text-[var(--gold-soft)] transition group-hover:bg-[var(--gold)]/10">
          Open →
        </span>
      </div>
    </button>
  );
}
