// src/components/ChallengeSession.tsx
import { useCallback, useState } from "react";
import { challengeModes } from "@/data/challengeModes";
import { ChallengeCard } from "@/components/ChallengeCard";
import { GameMap } from "@/components/GameMap";
import { ResultPanel } from "@/components/ResultPanel";
import { FutureCirclesPanel } from "@/components/FutureCirclesPanel";
import { DateGuessPlay } from "@/components/play/DateGuessPlay";
import { TimelineOrderPlay } from "@/components/play/TimelineOrderPlay";
import { WhoIsItPlay } from "@/components/play/WhoIsItPlay";
import { McqPlay } from "@/components/play/McqPlay";
import { SourceDetectivePlay } from "@/components/play/SourceDetectivePlay";
import { calculateScore, haversineDistanceKm, formatDistanceKm } from "@/utils/distance";
import {
  matchWhoIsIt,
  scoreDateGuess,
  scoreMapPath,
  scoreMcq,
  scoreTimelineOrder,
  scoreWhoIsIt,
} from "@/utils/scoring";
import { useCircles } from "@/hooks/use-circles";
import type {
  GameChallenge,
  GuessCoordinates,
  PlayResult,
} from "@/types/game";

interface ChallengeSessionProps {
  challenge: GameChallenge;
  challengeIndex: number;
  totalInMode: number;
  onHome: () => void;
  onNext: () => void;
}

export function ChallengeSession({
  challenge,
  challengeIndex,
  totalInMode,
  onHome,
  onNext,
}: ChallengeSessionProps) {
  const [phase, setPhase] = useState<"playing" | "result">("playing");
  const [result, setResult] = useState<PlayResult | null>(null);
  const [guess, setGuess] = useState<GuessCoordinates | null>(null);
  const [pathPoints, setPathPoints] = useState<GuessCoordinates[]>([]);
  const [mcqId, setMcqId] = useState<string | null>(null);
  const { profile, isConnected } = useCircles();

  const modeName =
    challengeModes.find((m) => m.type === challenge.type)?.name ?? challenge.type;

  const finish = useCallback((playResult: PlayResult) => {
    setResult(playResult);
    setPhase("result");
  }, []);

  function handlePlaceValidate() {
    if (!guess || !("latitude" in challenge && "longitude" in challenge)) return;
    const lat = challenge.latitude as number;
    const lng = challenge.longitude as number;
    const dist = haversineDistanceKm(guess.lat, guess.lng, lat, lng);
    finish({
      score: calculateScore(dist),
      summary: `Your guess was ${formatDistanceKm(dist)} away.`,
    });
  }

  function renderPlay() {
    switch (challenge.type) {
      case "place_guess":
      case "friend_challenge":
      case "city_history":
        return (
          <>
            {challenge.type === "friend_challenge" && (
              <div className="glass-card rounded-2xl border-sky-400/30 bg-sky-400/5 p-4 text-sm text-sky-200">
                <strong>
                  {isConnected ? profile.name ?? "You" : "You"}
                </strong>{" "}
                vs <strong>{challenge.opponentName}</strong> — they scored{" "}
                <strong>{challenge.opponentScore}/1000</strong>
                {isConnected
                  ? " on Circles. Beat them on the map."
                  : ". Connect in Circles host to sync trust challenges."}
              </div>
            )}
            {challenge.type === "city_history" && (
              <p className="text-sm text-[var(--accent-soft)]">
                City quest · {challenge.city}
              </p>
            )}
            <GameMap
              key={challenge.id}
              answerLat={challenge.latitude}
              answerLng={challenge.longitude}
              guess={guess}
              showAnswer={false}
              onGuess={setGuess}
              onValidate={handlePlaceValidate}
              canValidate={guess !== null}
            />
          </>
        );

      case "date_guess":
        return (
          <DateGuessPlay
            challenge={challenge}
            disabled={phase === "result"}
            onSubmit={(year) => {
              const diff = Math.abs(year - challenge.correctYear);
              finish({
                score: scoreDateGuess(year, challenge.correctYear),
                summary: `You guessed ${year}. Off by ${diff} year${diff === 1 ? "" : "s"}.`,
              });
            }}
          />
        );

      case "timeline_order": {
        const correctOrder = [...challenge.events]
          .sort((a, b) => a.year - b.year)
          .map((e) => e.id);
        return (
          <TimelineOrderPlay
            challenge={challenge}
            disabled={phase === "result"}
            onSubmit={(order) => {
              const score = scoreTimelineOrder(order, correctOrder);
              const correct = order.filter((id, i) => id === correctOrder[i]).length;
              finish({
                score,
                summary: `${correct} of ${correctOrder.length} events in the correct position.`,
              });
            }}
          />
        );
      }

      case "who_is_it":
        return (
          <WhoIsItPlay
            challenge={challenge}
            disabled={phase === "result"}
            onSubmit={(answer, cluesUsed) => {
              const ok = matchWhoIsIt(answer, challenge.acceptedAnswers);
              finish({
                score: ok ? scoreWhoIsIt(cluesUsed, challenge.clues.length) : 0,
                summary: ok
                  ? `Correct after ${cluesUsed + 1} clue(s).`
                  : `Not quite — answer was ${challenge.answerLabel}.`,
              });
            }}
          />
        );

      case "quote_guess":
        return (
          <McqPlay
            prompt={challenge.quote}
            options={challenge.options}
            selectedId={mcqId}
            disabled={phase === "result"}
            onSelect={setMcqId}
            onSubmit={() => {
              const ok = mcqId === challenge.correctOptionId;
              finish({
                score: scoreMcq(ok),
                summary: ok ? "Correct attribution." : `Answer: ${challenge.answerLabel}.`,
              });
            }}
            extra={
              challenge.sourceConfidence ? (
                <p className="text-xs text-[var(--text-secondary)]">
                  Source confidence:{" "}
                  <span className="capitalize text-[var(--accent-soft)]">
                    {challenge.sourceConfidence}
                  </span>
                </p>
              ) : null
            }
          />
        );

      case "battle_guess":
      case "image_guess":
        return (
          <McqPlay
            prompt={challenge.clue}
            options={challenge.options}
            selectedId={mcqId}
            disabled={phase === "result"}
            onSelect={setMcqId}
            onSubmit={() => {
              const ok = mcqId === challenge.correctOptionId;
              finish({
                score: scoreMcq(ok),
                summary: ok ? "Correct." : `Answer: ${challenge.answerLabel}.`,
              });
            }}
            extra={
              challenge.type === "image_guess" ? (
                <img
                  src={challenge.imageUrl}
                  alt={challenge.imageAlt}
                  className="max-h-56 w-full rounded-xl object-cover"
                />
              ) : null
            }
          />
        );

      case "map_path":
        return (
          <>
            <p className="text-sm text-[var(--text-secondary)]">
              Click the map to place {challenge.steps.length} points in order (
              {pathPoints.length}/{challenge.steps.length}).
            </p>
            <GameMap
              key={`path-${challenge.id}`}
              answerLat={challenge.steps[0]?.lat ?? 0}
              answerLng={challenge.steps[0]?.lng ?? 0}
              guess={pathPoints[pathPoints.length - 1] ?? null}
              showAnswer={false}
              multiPoint={{
                maxPoints: challenge.steps.length,
                points: pathPoints,
                onPointsChange: setPathPoints,
              }}
              onGuess={() => {}}
              onValidate={() => {
                if (pathPoints.length < challenge.steps.length) return;
                const score = scoreMapPath(pathPoints, challenge.steps);
                finish({
                  score,
                  summary: `Average location score across ${challenge.steps.length} waypoints.`,
                });
              }}
              canValidate={pathPoints.length >= challenge.steps.length}
            />
          </>
        );

      case "source_detective":
        return (
          <SourceDetectivePlay
            challenge={challenge}
            disabled={phase === "result"}
            onSubmit={(id) => {
              const picked = challenge.statements.find((s) => s.id === id);
              const ok = picked?.verdict === challenge.targetVerdict;
              finish({
                score: scoreMcq(ok),
                summary: ok
                  ? "You spotted the right kind of claim."
                  : `Target was: ${challenge.answerLabel}.`,
              });
            }}
          />
        );

      default:
        return null;
    }
  }

  function handleNext() {
    setPhase("playing");
    setResult(null);
    setGuess(null);
    setPathPoints([]);
    setMcqId(null);
    onNext();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="space-y-6">
        <ChallengeCard
          challenge={challenge}
          challengeNumber={challengeIndex + 1}
          totalChallenges={totalInMode}
          modeName={modeName}
        />
        {phase === "playing" && renderPlay()}
        {phase === "result" && result && (
          <ResultPanel
            challenge={challenge}
            score={result.score}
            summary={result.summary}
            modeName={modeName}
            playerName={isConnected ? profile.name : undefined}
            opponentScore={
              challenge.type === "friend_challenge"
                ? challenge.opponentScore
                : undefined
            }
            onNext={handleNext}
          />
        )}
        {phase === "playing" && (
          <button type="button" className="btn-secondary text-sm" onClick={onHome}>
            ← Back to home
          </button>
        )}
      </div>
      <div className="hidden lg:block">
        <FutureCirclesPanel />
      </div>
    </div>
  );
}
