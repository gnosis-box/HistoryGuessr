// src/components/circles/CirclesHubScreen.tsx
import { useState } from "react";
import { useCircles } from "@/hooks/use-circles";
import { circlesHubContent } from "@/lib/circles/hubContent";
import { CirclesWalletBadge } from "@/components/CirclesWalletBadge";
import { CommunityCirclesSection } from "@/components/communities/CommunityCirclesSection";
import { CirclesHubSteps } from "./CirclesHubSteps";
import { CirclesQuickActions } from "./CirclesQuickActions";
import { CirclesRedeemPanel } from "./CirclesRedeemPanel";
import { TrustFriendsPanel } from "./TrustFriendsPanel";

type HubTab = "overview" | "circles" | "friends" | "redeem";

interface CirclesHubScreenProps {
  onPlayQuiz: (communityId: string, quizId: string) => void;
  onOpenTrustDuel: () => void;
  onOpenHist: () => void;
}

export function CirclesHubScreen({
  onPlayQuiz,
  onOpenTrustDuel,
  onOpenHist,
}: CirclesHubScreenProps) {
  const { isConnected, address } = useCircles();
  const [tab, setTab] = useState<HubTab>("overview");
  const [focusCreateCircle, setFocusCreateCircle] = useState(false);

  const tabs: { id: HubTab; label: string }[] = [
    { id: "overview", label: circlesHubContent.tabs.overview },
    { id: "circles", label: circlesHubContent.tabs.circles },
    { id: "friends", label: circlesHubContent.tabs.friends },
    { id: "redeem", label: circlesHubContent.tabs.redeem },
  ];

  function goCircles() {
    setTab("circles");
    setFocusCreateCircle(true);
    window.setTimeout(() => setFocusCreateCircle(false), 800);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-up">
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--map-green)]">
              Circles protocol
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-[var(--text-primary)]">
              {circlesHubContent.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
              {circlesHubContent.subtitle}
            </p>
          </div>
          <CirclesWalletBadge />
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          {isConnected
            ? `${circlesHubContent.wallet.connected}: ${address?.slice(0, 6)}…${address?.slice(-4)}`
            : circlesHubContent.wallet.guest}
        </p>

        <div
          className="flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-1"
          role="tablist"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-[var(--bg-card)] text-[var(--gold-soft)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {tab === "overview" && (
        <div className="space-y-8">
          <CirclesHubSteps />
          <CirclesQuickActions
            onDuel={onOpenTrustDuel}
            onCreateCircle={goCircles}
            onCreateQuiz={() => setTab("circles")}
            onHist={onOpenHist}
          />
        </div>
      )}

      {tab === "circles" && (
        <div
          className={
            focusCreateCircle
              ? "ring-2 ring-[var(--gold)]/40 ring-offset-2 ring-offset-[var(--bg-main)] rounded-2xl"
              : undefined
          }
        >
          <CommunityCirclesSection onPlayQuiz={onPlayQuiz} />
        </div>
      )}

      {tab === "friends" && (
        <TrustFriendsPanel onChallengePeer={onOpenTrustDuel} />
      )}

      {tab === "redeem" && <CirclesRedeemPanel onOpenHist={onOpenHist} />}
    </div>
  );
}
