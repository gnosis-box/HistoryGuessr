import type { HonorificBadge } from "@/lib/reputation/types";

/** Badge & reputation tier chips */
export const badgeTierStyles: Record<HonorificBadge["tier"], string> = {
  bronze: "border-amber-700/40 bg-amber-900/20 text-amber-200",
  silver: "border-slate-400/40 bg-slate-500/15 text-slate-200",
  gold: "border-[var(--accent)]/50 bg-[var(--accent)]/15 text-[var(--accent-soft)]",
  legendary:
    "border-[var(--honor-ring)] bg-[var(--honor-fill)] text-[var(--honor-soft)] shadow-[0_0_24px_var(--honor-glow)]",
};

export const honorPanelClass =
  "rounded-xl border border-[var(--honor-ring)] bg-[var(--honor-fill)]";

export const honorLabelClass =
  "text-xs font-semibold uppercase tracking-wider text-[var(--honor)]";

export const expertDifficultyStyle =
  "border-[var(--steel-ring)] bg-[var(--steel-fill)] text-[var(--steel-soft)]";

export const criticalCardBorder =
  "border-[var(--steel-ring)] hover:border-[color-mix(in_srgb,var(--steel)_50%,transparent)]";

export const criticalCardBorderStatic = "border-[var(--steel-ring)]";

export const steelHintSurface =
  "rounded-lg border border-[var(--steel-ring)] bg-[var(--steel-fill)] px-3 py-2 text-sm text-[var(--steel-soft)]";

export const signatureModeText = "text-[var(--honor)]";
