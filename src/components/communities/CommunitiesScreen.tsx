// src/components/communities/CommunitiesScreen.tsx
/** @deprecated Use CirclesHubScreen — kept for imports/tests */
import { CirclesHubScreen } from "@/components/circles/CirclesHubScreen";
import { usePlayNavigation } from "@/context/PlayNavigation";

interface CommunitiesScreenProps {
  onPlayQuiz: (communityId: string, quizId: string) => void;
}

export function CommunitiesScreen({ onPlayQuiz }: CommunitiesScreenProps) {
  const { openHist, openTrustDuel } = usePlayNavigation();
  return (
    <CirclesHubScreen
      onPlayQuiz={onPlayQuiz}
      onOpenTrustDuel={openTrustDuel}
      onOpenHist={openHist}
    />
  );
}
