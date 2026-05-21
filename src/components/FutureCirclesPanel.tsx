import { useCircles } from "@/hooks/use-circles";

interface FutureCirclesPanelProps {
  variant?: "compact" | "full";
}

export function FutureCirclesPanel({ variant = "compact" }: FutureCirclesPanelProps) {
  const { isConnected, profile, isMiniappHost } = useCircles();
  const items = [
    "Challenge trusted friends from your trust graph",
    "Earn honorific badges — Archivist, Cartographer, Source Hunter (not for sale)",
    "Create local history Groups — e.g. Avignon, Paris, medieval Europe",
    "Reward contributors with HIST group currency",
    "Use Circles profiles as social identity in leaderboards",
  ];

  return (
    <section
      className={
        variant === "full"
          ? "glass-card rounded-2xl border-dashed p-6 sm:p-8"
          : "glass-card rounded-2xl border-dashed p-5"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
        Future Circles layer
      </p>
      <h2
        className={
          variant === "full"
            ? "mt-2 font-display text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl"
            : "mt-2 font-display text-lg font-semibold text-[var(--text-primary)]"
        }
      >
        History becomes social
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
        {isConnected ? (
          <>
            Connected as <strong className="text-[var(--text-primary)]">{profile.name ?? "Circles player"}</strong>
            {profile.crcBalance !== undefined && ` · ${profile.crcBalance} CRC`}
            {profile.trustConnections !== undefined &&
              ` · ${profile.trustConnections} trust links`}. Friend challenges and
            group quests will use your trust graph next.
          </>
        ) : (
          <>
            History becomes more interesting when played with people you trust.
            {isMiniappHost
              ? " Waiting for the Circles host wallet…"
              : " Open this app in the "}
            {!isMiniappHost && (
              <a
                href="https://circles.gnosis.io/playground"
                className="text-[var(--accent-soft)] underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Circles playground
              </a>
            )}
            {!isMiniappHost && " to inject your Safe address."}
          </>
        )}
      </p>
      <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-[var(--accent)]" aria-hidden>
              ◆
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {variant === "full" && (
        <p className="mt-5 border-t border-white/5 pt-4 font-display text-sm italic text-[var(--accent-soft)]">
          Talaria provides the historical memory. Circles provides the social
          trust. History Guessr provides the game.
        </p>
      )}
    </section>
  );
}
