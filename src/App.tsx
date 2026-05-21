// src/App.tsx
import { useCallback, useMemo, useState } from "react";
import {
  getChallengeById,
  pickCityChallenge,
  pickRandomChallenge,
} from "@/data/catalog";
import { getCampaign } from "@/data/campaigns";
import { getPack } from "@/data/packs";
import { recordDailyPlay } from "@/data/dailyChallenge";
import { groupForMode } from "@/data/playModes";
import { PlayNavigationProvider, type AppScreen } from "@/context/PlayNavigation";
import { Layout } from "@/components/Layout";
import { HomeScreen } from "@/components/HomeScreen";
import { ModeCategoryScreen } from "@/components/ModeCategoryScreen";
import { ChallengeSession } from "@/components/ChallengeSession";
import {
  SessionCompleteScreen,
  type SessionRoundSummary,
} from "@/components/SessionCompleteScreen";
import { PlayerProfileScreen } from "@/components/profile/PlayerProfileScreen";
import { CityPicker } from "@/components/play/CityPicker";
import { buildSessionQueue } from "@/lib/session/sessionQueue";
import type { ChallengeType, GameChallenge } from "@/types/game";

interface PlaySession {
  kind: "mode" | "campaign" | "daily" | "pack";
  campaignId?: string;
  packId?: string;
  modeType?: ChallengeType;
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<GameChallenge | null>(null);
  const [roundInSession, setRoundInSession] = useState(1);
  const [playSession, setPlaySession] = useState<PlaySession | null>(null);
  const [challengeQueue, setChallengeQueue] = useState<string[]>([]);
  const [sessionRounds, setSessionRounds] = useState<SessionRoundSummary[]>(
    [],
  );

  const goHome = useCallback(() => {
    setScreen("home");
    setActiveGroupId(null);
    setChallenge(null);
    setRoundInSession(1);
    setPlaySession(null);
    setChallengeQueue([]);
    setSessionRounds([]);
  }, []);

  const openCategory = useCallback((groupId: string) => {
    setScreen("category");
    setActiveGroupId(groupId);
    setChallenge(null);
  }, []);

  const openProfile = useCallback(() => {
    setScreen("profile");
    setChallenge(null);
  }, []);

  function startSession(
    first: GameChallenge,
    session: PlaySession,
    queue: string[],
  ) {
    setChallengeQueue(queue);
    setSessionRounds([]);
    setChallenge(first);
    setRoundInSession(1);
    setPlaySession(session);
    setScreen("play");
  }

  function startMode(type: ChallengeType) {
    const group = groupForMode(type);
    if (group) setActiveGroupId(group);

    if (type === "city_history") {
      setScreen("city_pick");
      setPlaySession({ kind: "mode", modeType: type });
      setChallengeQueue([]);
      return;
    }

    const queue = buildSessionQueue({ kind: "mode", challengeType: type });
    const first = getChallengeById(queue[0]) ?? pickRandomChallenge(type);
    startSession(first, { kind: "mode", modeType: type }, queue);
  }

  function startRandom() {
    const queue = buildSessionQueue({ kind: "mode" });
    const first = getChallengeById(queue[0]) ?? pickRandomChallenge();
    startSession(first, { kind: "mode" }, queue);
  }

  function startDaily() {
    const queue = buildSessionQueue({ kind: "daily" });
    const first = getChallengeById(queue[0]);
    if (!first) return;
    startSession(first, { kind: "daily" }, queue);
  }

  function startPack(packId: string) {
    const queue = buildSessionQueue({ kind: "pack", packId });
    const first = getChallengeById(queue[0]) ?? pickRandomChallenge();
    startSession(first, { kind: "pack", packId }, queue);
  }

  function startCampaign(campaignId: string) {
    const queue = buildSessionQueue({ kind: "campaign", campaignId });
    const first = getChallengeById(queue[0]);
    if (!first) return;
    startSession(first, { kind: "campaign", campaignId }, queue);
  }

  function handleCitySelect(city: string) {
    const picked = pickCityChallenge(city);
    if (!picked) return;
    const queue = buildSessionQueue({
      kind: "mode",
      challengeType: "city_history",
      cityChallengeId: picked.id,
    });
    startSession(picked, { kind: "mode", modeType: "city_history" }, queue);
  }

  function handleRoundComplete(round: SessionRoundSummary) {
    const nextRounds = [...sessionRounds, round];
    setSessionRounds(nextRounds);

    const nextIndex = nextRounds.length;
    if (nextIndex < challengeQueue.length) {
      const next = getChallengeById(challengeQueue[nextIndex]);
      if (next) {
        setChallenge(next);
        setRoundInSession(nextIndex + 1);
        return;
      }
    }

    if (playSession?.kind === "daily") {
      recordDailyPlay();
    }
    setScreen("session_complete");
  }

  const activeMode: ChallengeType | null =
    screen === "city_pick"
      ? "city_history"
      : challenge?.type ?? null;

  const navValue = useMemo(
    () => ({
      screen,
      activeGroupId,
      activeMode,
      goHome,
      openProfile,
      openCategory,
      startMode,
      startDaily,
      startRandom,
    }),
    [
      screen,
      activeGroupId,
      activeMode,
      goHome,
      openProfile,
      openCategory,
      challenge?.id,
    ],
  );

  const totalInSession = challengeQueue.length || 1;

  const sessionLabel =
    playSession?.kind === "campaign"
      ? getCampaign(playSession.campaignId!)?.title
      : playSession?.kind === "daily"
        ? "Daily"
        : playSession?.kind === "pack"
          ? getPack(playSession.packId!)?.name
          : undefined;

  return (
    <PlayNavigationProvider value={navValue}>
      <Layout>
        {screen === "home" && (
          <HomeScreen
            onStartCampaign={startCampaign}
            onPlayPack={startPack}
          />
        )}

        {screen === "profile" && <PlayerProfileScreen />}

        {screen === "category" && activeGroupId && (
          <ModeCategoryScreen
            groupId={activeGroupId}
            onPlayMode={startMode}
          />
        )}

        {screen === "city_pick" && (
          <div className="space-y-4">
            <button
              type="button"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--gold-soft)]"
              onClick={() => openCategory("map")}
            >
              ← Back to Map
            </button>
            <h2 className="font-display text-2xl text-[var(--text-primary)]">
              Cities
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Choose a city, then place the landmark on the map.
            </p>
            <CityPicker onSelect={handleCitySelect} />
          </div>
        )}

        {screen === "play" && challenge && (
          <ChallengeSession
            key={`${challenge.id}-${roundInSession}`}
            challenge={challenge}
            challengeNumber={roundInSession}
            totalInMode={totalInSession}
            sessionLabel={sessionLabel}
            onRoundComplete={handleRoundComplete}
          />
        )}

        {screen === "session_complete" && sessionRounds.length > 0 && (
          <SessionCompleteScreen
            sessionLabel={sessionLabel}
            rounds={sessionRounds}
            onHome={goHome}
          />
        )}
      </Layout>
    </PlayNavigationProvider>
  );
}
