import type {
  FriendChallenge,
  GameChallenge,
  PlaceGuessChallenge,
  CityHistoryChallenge,
} from "@/types/game";

export function createFriendChallengeFrom(
  source: GameChallenge,
  opponentScore: number,
  opponentName: string,
): FriendChallenge | null {
  if (source.type === "place_guess") {
    const s = source as PlaceGuessChallenge;
    return {
      ...s,
      id: `friend-${s.id}-${Date.now()}`,
      type: "friend_challenge",
      title: `Beat ${opponentName} — ${s.title}`,
      clue: `${opponentName} scored ${opponentScore}/1000 on this clue. Can you do better on the map?`,
      opponentName,
      opponentScore,
    };
  }
  if (source.type === "city_history") {
    const s = source as CityHistoryChallenge;
    return {
      ...s,
      id: `friend-${s.id}-${Date.now()}`,
      type: "friend_challenge",
      title: `Beat ${opponentName} — ${s.city}`,
      clue: `${opponentName} scored ${opponentScore}/1000 in ${s.city}. Place it more accurately.`,
      opponentName,
      opponentScore,
    };
  }
  return null;
}

export function isGeoChallenge(
  c: GameChallenge,
): c is PlaceGuessChallenge | CityHistoryChallenge | FriendChallenge {
  return (
    c.type === "place_guess" ||
    c.type === "city_history" ||
    c.type === "friend_challenge"
  );
}
