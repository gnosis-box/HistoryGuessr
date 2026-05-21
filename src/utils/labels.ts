import type { ChallengeDifficulty, ChallengeStatus } from "@/types/game";

export const statusLabels: Record<ChallengeStatus, string> = {
  mvp: "MVP",
  playable_soon: "Playable soon",
  advanced: "Advanced",
  circles_ready: "Circles-ready",
};

export const statusStyles: Record<ChallengeStatus, string> = {
  mvp: "border-[var(--success)]/40 bg-[var(--success)]/15 text-[var(--success)]",
  playable_soon:
    "border-[var(--accent)]/40 bg-[var(--accent)]/15 text-[var(--accent-soft)]",
  advanced:
    "border-[var(--text-secondary)]/30 bg-[var(--surface-soft)] text-[var(--text-secondary)]",
  circles_ready:
    "border-sky-400/40 bg-sky-400/10 text-sky-300",
};

export const difficultyStyles: Record<ChallengeDifficulty, string> = {
  easy: "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]",
  medium:
    "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent-soft)]",
  hard: "border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]",
  expert:
    "border-purple-400/30 bg-purple-400/10 text-purple-300",
};
