import { CirclesWalletBadge } from "./CirclesWalletBadge";
import { useCircles } from "@/hooks/use-circles";
import { usePlayNavigation } from "@/context/PlayNavigation";

export function Header() {
  const { isMiniappHost, isConnected } = useCircles();
  const { goHome, openProfile, screen } = usePlayNavigation();

  return (
    <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-panel)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-3 text-left transition hover:opacity-90"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[var(--bg-card)] font-display text-lg text-[var(--gold)]"
            aria-hidden
          >
            H
          </div>
          <div>
            <p className="font-display text-xl font-semibold tracking-tight text-[var(--text-primary)]">
              History Guessr
            </p>
            <p className="hidden text-xs text-[var(--text-muted)] sm:block">
              Map · Timeline · Figures · Sources
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openProfile}
            className={`hidden rounded-full border px-3 py-1.5 text-xs font-medium sm:inline ${
              screen === "profile"
                ? "border-[var(--honor-ring)] bg-[var(--honor-fill)] text-[var(--honor-soft)]"
                : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--gold)]/40 hover:text-[var(--gold-soft)]"
            }`}
          >
            Profile
          </button>
          <span
            className={`hidden rounded-full border px-2.5 py-0.5 text-[10px] font-medium lg:inline ${
              isConnected
                ? "border-[var(--success-soft)]/40 text-[var(--success-soft)]"
                : "border-[var(--gold)]/30 text-[var(--gold-soft)]"
            }`}
          >
            {isConnected
              ? isMiniappHost
                ? "Circles"
                : "Connected"
              : "Guest"}
          </span>
          <CirclesWalletBadge />
        </div>
      </div>
    </header>
  );
}
