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

  function goHome() {
    setScreen("home");
    setChallenge(null);
  }

  function startMode(type: ChallengeType) {
    if (type === "city_history") {
      setScreen("city_pick");
      return;
    }
    setChallenge(pickRandomChallenge(type));
    setScreen("play");
  }

  function startPlaceGuess() {
    startMode("place_guess");
  }

  function startRandom() {
    setChallenge(pickRandomChallenge());
    setScreen("play");
  }

  function handleCitySelect(city: string) {
    const picked = pickCityChallenge(city);
    if (picked) {
      setChallenge(picked);
      setScreen("play");
    }
  }

  function handleNextChallenge() {
    if (!challenge) return;
    setChallenge(pickRandomChallenge(challenge.type, challenge.id));
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
          challengeIndex={0}
          totalInMode={poolSize}
          onHome={goHome}
          onNext={handleNextChallenge}
        />
      )}
    </Layout>
  );
}
