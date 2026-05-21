import { useState } from "react";
import type { GameChallenge } from "@/types/game";
import { useCircles } from "@/hooks/use-circles";
import {
  getChallengeVouchCount,
  sourceVouchLevel,
  vouchChallenge,
  vouchLevelLabel,
} from "@/lib/sources/challengeVouch";

interface SourceVouchBadgeProps {
  challenge: GameChallenge;
}

export function SourceVouchBadge({ challenge }: SourceVouchBadgeProps) {
  const { address } = useCircles();
  const [count, setCount] = useState(() => getChallengeVouchCount(challenge.id));
  const [vouched, setVouched] = useState(false);
  const level = sourceVouchLevel(challenge.id, challenge.sourceConfidence);

  function handleVouch() {
    if (vouchChallenge(challenge.id, address)) {
      setCount(getChallengeVouchCount(challenge.id));
      setVouched(true);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
      <span className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-[var(--text-muted)]">
        {vouchLevelLabel(level)}
      </span>
      <span className="text-[var(--text-muted)]">
        {count} community vouch{count === 1 ? "" : "es"}
      </span>
      {address && !vouched && (
        <button
          type="button"
          className="rounded-full border border-sky-400/30 px-2 py-0.5 text-sky-300 hover:border-sky-400/60"
          onClick={handleVouch}
        >
          Vouch this source
        </button>
      )}
      {vouched && (
        <span className="text-[var(--success-soft)]">Thanks — vouched!</span>
      )}
    </div>
  );
}
