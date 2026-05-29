// src/components/circles/HistCurrencyCard.tsx
import { useState } from "react";
import { useCircles } from "@/hooks/use-circles";
import { historyGuessrGroup } from "@/lib/circles/config";
import { histCurrencyContent } from "@/lib/circles/histCurrencyContent";
import { formatHist } from "@/utils/format";

interface HistCurrencyCardProps {
  variant?: "wallet" | "compact";
  onClaim?: () => Promise<string>;
}

function statusLabel(
  isConnected: boolean,
  vouchStatus: string,
  trustsHistGroup: boolean,
): { text: string; tone: "success" | "warn" | "muted" } {
  if (!isConnected) return { text: "Guest", tone: "muted" };
  if (trustsHistGroup || vouchStatus === "member") {
    return { text: "Group linked", tone: "success" };
  }
  return { text: "Trust pending", tone: "warn" };
}

export function HistCurrencyCard({
  variant = "wallet",
  onClaim,
}: HistCurrencyCardProps) {
  const {
    isConnected,
    isMiniappHost,
    vouchStatus,
    trustsHistGroup,
    histTreasury,
    ledger,
    claimRewards,
  } = useCircles();

  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const groupAddr = historyGuessrGroup.groupAddress;
  const total = ledger.pending + ledger.claimed;
  const status = statusLabel(isConnected, vouchStatus, trustsHistGroup);
  const isCompact = variant === "compact";

  async function handleClaim() {
    setClaiming(true);
    setClaimMsg(null);
    try {
      const msg = onClaim ? await onClaim() : await claimRewards();
      setClaimMsg(msg);
      window.setTimeout(() => setClaimMsg(null), 5000);
    } finally {
      setClaiming(false);
    }
  }

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[var(--gold)]/20 bg-gradient-to-b from-[var(--gold)]/8 via-transparent to-transparent ${
        isCompact ? "p-4" : "p-5 sm:p-6"
      } glass-card`}
    >
      <header className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--gold)]/35 bg-[var(--bg-card)] font-display text-lg font-bold text-[var(--gold-soft)]"
          aria-hidden
        >
          {histCurrencyContent.symbol}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
              {histCurrencyContent.name}
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                status.tone === "success"
                  ? "bg-[var(--success)]/15 text-[var(--success)]"
                  : status.tone === "warn"
                    ? "bg-amber-500/15 text-amber-200"
                    : "bg-white/5 text-[var(--text-muted)]"
              }`}
            >
              {status.text}
            </span>
          </div>
          {!isCompact && (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {histCurrencyContent.tagline}
            </p>
          )}
        </div>
      </header>

      <dl
        className={`mt-5 grid gap-3 ${isCompact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}
      >
        <Metric label="Balance" value={formatHist(total)} highlight />
        <Metric label="Pending" value={formatHist(ledger.pending)} />
        <Metric label="Claimed" value={formatHist(ledger.claimed)} />
        {!isCompact && (
          <Metric
            label="Treasury"
            value={
              histTreasury?.hasTreasury && histTreasury.collateralCrc > 0
                ? `~${histTreasury.collateralCrc} CRC`
                : "—"
            }
          />
        )}
      </dl>

      {isCompact && (
        <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
          Open the HIST tab for the full economy guide (play → HIST → CRC).
        </p>
      )}

      {groupAddr && isConnected && !trustsHistGroup && !isCompact && (
        <div className="mt-4 rounded-xl border border-sky-400/25 bg-sky-950/30 px-4 py-3">
          <p className="text-sm text-sky-100">
            <span className="font-medium">Next step:</span> In Circles, open{" "}
            <strong>History Guessr</strong> and tap{" "}
            <strong>Supporter</strong>.
          </p>
        </div>
      )}

      {!groupAddr && !isCompact && (
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          On-chain group syncing — rewards are saved in your ledger until this
          deployment is fully configured.
        </p>
      )}

      {ledger.pending > 0 && isConnected && isMiniappHost && !isCompact && (
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] pt-4">
          <button
            type="button"
            className="btn-primary text-sm"
            disabled={claiming || !groupAddr}
            onClick={() => void handleClaim()}
          >
            {claiming ? "Claiming…" : `Claim ${formatHist(ledger.pending)} HIST`}
          </button>
        </div>
      )}

      {claimMsg && (
        <p className="mt-3 text-xs text-[var(--success)]" role="status">
          {claimMsg}
        </p>
      )}
    </section>
  );
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 px-3 py-2.5">
      <dt className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </dt>
      <dd
        className={`mt-0.5 font-display text-lg font-semibold tabular-nums ${
          highlight ? "text-[var(--gold-soft)]" : "text-[var(--text-primary)]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
