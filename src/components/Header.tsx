import { CirclesWalletBadge } from "./CirclesWalletBadge";
import { useCircles } from "@/hooks/use-circles";

export function Header() {
  const { isMiniappHost, isConnected } = useCircles();

  return (
    <header className="border-b border-white/5 bg-[var(--surface)]/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--surface-soft)] font-display text-lg text-[var(--accent)]"
            aria-hidden
          >
            H
          </div>
          <div>
            <p className="font-display text-xl font-semibold tracking-tight text-[var(--text-primary)]">
              History Guessr
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Guess where history happened.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={`hidden rounded-full border px-3 py-1 text-xs font-medium sm:inline ${
              isConnected
                ? "border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]"
                : "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent-soft)]"
            }`}
          >
            {isConnected
              ? isMiniappHost
                ? "Circles connected"
                : "Profile loaded"
              : "Guest · Circles-ready"}
          </span>
          <a
            href="https://circles.gnosis.io/playground"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary hidden text-xs sm:inline-flex"
          >
            Playground
          </a>
          <CirclesWalletBadge />
        </div>
      </div>
    </header>
  );
}
