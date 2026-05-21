// src/App.tsx
import { useState } from "react";
import {
  getChallengesByType,
  pickCityChallenge,
  pickRandomChallenge,
} from "@/data/catalog";
import { Layout } from "@/components/Layout";
import { HomeScreen } from "@/components/HomeScreen";
import { ChallengeSession } from "@/components/ChallengeSession";
import { CityPicker } from "@/components/play/CityPicker";
import type { ChallengeType, GameChallenge } from "@/types/game";

type Screen = "home" | "city_pick" | "play";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [challenge, setChallenge] = useState<GameChallenge | null>(null);
  const [roundInSession, setRoundInSession] = useState(1);

  function goHome() {
    setScreen("home");
    setChallenge(null);
    setRoundInSession(1);
  }

  function beginChallenge(next: GameChallenge) {
    setChallenge(next);
    setRoundInSession(1);
    setScreen("play");
  }

  function startMode(type: ChallengeType) {
    if (type === "city_history") {
      setScreen("city_pick");
      return;
    }
    beginChallenge(pickRandomChallenge(type));
  }

  function startPlaceGuess() {
    startMode("place_guess");
  }

  function startRandom() {
    beginChallenge(pickRandomChallenge());
  }

  function handleCitySelect(city: string) {
    const picked = pickCityChallenge(city);
    if (picked) beginChallenge(picked);
  }

  function handleNextChallenge() {
    if (!challenge) return;
    setChallenge(pickRandomChallenge(challenge.type, challenge.id));
    setRoundInSession((r) => r + 1);
  }

  const poolSize = challenge
    ? getChallengesByType(challenge.type).length
    : 0;

  return (
    <Layout>
      {screen === "home" && (
        <HomeScreen
          onStart={startPlaceGuess}
          onRandom={startRandom}
          onPlayMode={startMode}
        />
      )}

      {screen === "city_pick" && (
        <div className="space-y-4">
          <CityPicker onSelect={handleCitySelect} />
          <button type="button" className="btn-secondary text-sm" onClick={goHome}>
            ← Back to home
          </button>
        </div>
      )}

      {screen === "play" && challenge && (
        <ChallengeSession
          key={challenge.id}
          challenge={challenge}
          challengeNumber={roundInSession}
          totalInMode={poolSize}
          onHome={goHome}
          onNext={handleNextChallenge}
        />
      )}
    </Layout>
  );
}
