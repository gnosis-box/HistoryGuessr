import { createContext, useContext, type ReactNode } from "react";
import type { ChallengeType } from "@/types/game";

export type AppScreen =
  | "home"
  | "category"
  | "city_pick"
  | "trust_duel"
  | "play"
  | "session_complete"
  | "profile"
  | "hist"
  | "communities";

interface PlayNavigationValue {
  screen: AppScreen;
  activeGroupId: string | null;
  activeMode: ChallengeType | null;
  goHome: () => void;
  openProfile: () => void;
  openHist: () => void;
  openCommunities: () => void;
  openTrustDuel: () => void;
  openCategory: (groupId: string) => void;
  startMode: (type: ChallengeType) => void;
  startDaily: () => void;
  startRandom: () => void;
}

const PlayNavigationContext = createContext<PlayNavigationValue | null>(null);

export function PlayNavigationProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: PlayNavigationValue;
}) {
  return (
    <PlayNavigationContext.Provider value={value}>
      {children}
    </PlayNavigationContext.Provider>
  );
}

export function usePlayNavigation(): PlayNavigationValue {
  const ctx = useContext(PlayNavigationContext);
  if (!ctx) {
    throw new Error("usePlayNavigation must be used within PlayNavigationProvider");
  }
  return ctx;
}
