// src/App.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { CommunitiesScreen } from "@/components/communities/CommunitiesScreen";
import { CityPicker } from "@/components/play/CityPicker";
import { canAccessCommunity } from "@/lib/communities/access";
import { getCommunity, getQuiz } from "@/lib/communities/storage";
import { parseQuizShareParams } from "@/lib/communities/share";
import { buildSessionQueue } from "@/lib/session/sessionQueue";
import { useCircles } from "@/hooks/use-circles";
import type { ChallengeType, GameChallenge } from "@/types/game";

interface PlaySession {
  kind: "mode" | "campaign" | "daily" | "pack" | "community";
  campaignId?: string;
  packId?: string;
  modeType?: ChallengeType;
  communityId?: string;
  quizId?: string;
  quizTitle?: string;
  communityName?: string;
}

export default function App() {
  const { address } = useCircles();
  const [screen, setScreen] = useState<AppScreen>("home");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<GameChallenge | null>(null);
  const [roundInSession, setRoundInSession] = useState(1);
  const [playSession, setPlaySession] = useState<PlaySession | null>(null);
  const [challengeQueue, setChallengeQueue] = useState<string[]>([]);
  const [sessionRounds, setSessionRounds] = useState<SessionRoundSummary[]>(
    [],
  );
  const [shareError, setShareError] = useState<string | null>(null);
  const [pendingShare, setPendingShare] = useState<{
    communityId: string;
    quizId: string;
  } | null>(() => parseQuizShareParams(window.location.search));

  const goHome = useCallback(() => {
    setScreen("home");
    setActiveGroupId(null);
    setChallenge(null);
    setRoundInSession(1);
    setPlaySession(null);
    setChallengeQueue([]);
    setSessionRounds([]);
    setShareError(null);
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

  const openCommunities = useCallback(() => {
    setScreen("communities");
    setChallenge(null);
    setShareError(null);
  }, []);

  const startSession = useCallback(
    (first: GameChallenge, session: PlaySession, queue: string[]) => {
      setChallengeQueue(queue);
      setSessionRounds([]);
      setChallenge(first);
      setRoundInSession(1);
      setPlaySession(session);
      setScreen("play");
    },
    [],
  );

  const startCommunityQuiz = useCallback(
    (communityId: string, quizId: string, viaShareLink = false) => {
      const community = getCommunity(communityId);
      const quiz = getQuiz(quizId);
      if (!community || !quiz || quiz.communityId !== communityId) {
        setShareError("This invite link is invalid or expired.");
        setScreen("home");
        return;
      }

      const access = canAccessCommunity(community, address, { viaShareLink });
      if (!access.allowed) {
        setShareError(access.reason);
        setScreen("communities");
        return;
      }

      const queue = quiz.challengeIds.filter((id) => getChallengeById(id));
      if (queue.length === 0) {
        setShareError("This quiz has no valid challenges.");
        return;
      }

      const first = getChallengeById(queue[0]);
      if (!first) return;

      setShareError(null);
      startSession(first, {
        kind: "community",
        communityId,
        quizId,
        quizTitle: quiz.title,
        communityName: community.name,
      }, queue);
    },
    [address, startSession],
  );

  useEffect(() => {
    if (!pendingShare) return;
    startCommunityQuiz(
      pendingShare.communityId,
      pendingShare.quizId,
      true,
    );
    setPendingShare(null);
    window.history.replaceState({}, "", window.location.pathname);
  }, [pendingShare, startCommunityQuiz]);

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
      openCommunities,
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
      openCommunities,
      openCategory,
      challenge?.id,
    ],
  );

  const totalInSession = challengeQueue.length || 1;

  const sessionLabel =
    playSession?.kind === "community"
      ? `${playSession.communityName ?? "Circle"} · ${playSession.quizTitle ?? "Quiz"}`
      : playSession?.kind === "campaign"
        ? getCampaign(playSession.campaignId!)?.title
        : playSession?.kind === "daily"
          ? "Daily"
          : playSession?.kind === "pack"
            ? getPack(playSession.packId!)?.name
            : undefined;

  return (
    <PlayNavigationProvider value={navValue}>
      <Layout>
        {shareError && screen === "home" && (
          <p className="mb-4 rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
            {shareError}
          </p>
        )}

        {screen === "home" && (
          <HomeScreen
            onStartCampaign={startCampaign}
            onPlayPack={startPack}
          />
        )}

        {screen === "profile" && <PlayerProfileScreen />}

        {screen === "communities" && (
          <CommunitiesScreen onPlayQuiz={startCommunityQuiz} />
        )}

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
