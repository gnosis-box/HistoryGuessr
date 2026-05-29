// src/components/communities/CommunityCirclesSection.tsx
import { useState } from "react";
import { useCircles } from "@/hooks/use-circles";
import { useCommunities } from "@/hooks/use-communities";
import { canAccessCommunity } from "@/lib/communities/access";
import { buildQuizShareUrl, copyShareLink } from "@/lib/communities/share";
import { buildQuizShareBundle } from "@/lib/communities/shareBundle";
import { getCustomChallengesForCommunity } from "@/lib/challenges/customStorage";
import { circlesHubContent } from "@/lib/circles/hubContent";
import { CreateCommunityForm } from "./CreateCommunityForm";
import { CreateQuizForm } from "./CreateQuizForm";

interface CommunityCirclesSectionProps {
  onPlayQuiz: (communityId: string, quizId: string) => void;
  /** When set, scroll focus / expand after navigation from hub quick actions */
  initialExpandId?: string | null;
}

export function CommunityCirclesSection({
  onPlayQuiz,
  initialExpandId = null,
}: CommunityCirclesSectionProps) {
  const { address, isConnected } = useCircles();
  const { communities, addCommunity, addQuiz, getQuizzesForCommunity } =
    useCommunities();
  const [expandedId, setExpandedId] = useState<string | null>(
    initialExpandId,
  );
  const [creatingQuizFor, setCreatingQuizFor] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const founder = address ?? "";

  async function handleCopyLink(communityId: string, quizId: string) {
    const bundle = buildQuizShareBundle(
      communityId,
      quizId,
      getCustomChallengesForCommunity(communityId),
    );
    const url = buildQuizShareUrl(communityId, quizId, bundle);
    try {
      await copyShareLink(url);
      setCopyStatus(quizId);
      window.setTimeout(() => setCopyStatus(null), 2000);
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <div className="space-y-6">
      <CreateCommunityForm
        founderAddress={founder}
        onCreated={(input) => {
          const c = addCommunity({
            ...input,
            founderAddress: founder || "guest",
          });
          setExpandedId(c.id);
        }}
      />

      {communities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] p-8 text-center">
          <p className="font-display text-lg text-[var(--gold-soft)]">
            Aucun cercle pour l’instant
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Créez un cercle ci-dessus, invitez des amis de confiance (onglet
            « {circlesHubContent.tabs.friends} »), puis publiez votre premier
            quiz.
          </p>
        </div>
      ) : (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Vos cercles ({communities.length})
          </h2>
          {communities.map((community) => {
            const quizzes = getQuizzesForCommunity(community.id);
            const access = canAccessCommunity(community, address);
            const isExpanded = expandedId === community.id;

            return (
              <article
                key={community.id}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[var(--gold-soft)]">
                      {community.name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {community.description || "Pas de description"}
                    </p>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      {community.visibility === "private"
                        ? "Privé (liste d’invités)"
                        : "Lien ouvert"}{" "}
                      · {community.inviteAddresses.length} invité
                      {community.inviteAddresses.length === 1 ? "" : "s"} ·{" "}
                      {quizzes.length} quiz
                      {quizzes.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : community.id)
                    }
                  >
                    {isExpanded ? "Réduire" : "Gérer"}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-[var(--border-subtle)] pt-4">
                    {creatingQuizFor === community.id ? (
                      <CreateQuizForm
                        communityId={community.id}
                        communityName={community.name}
                        founderAddress={founder}
                        onCreated={(input) => {
                          addQuiz({
                            communityId: community.id,
                            ...input,
                            createdBy: founder || "guest",
                          });
                          setCreatingQuizFor(null);
                        }}
                        onCancel={() => setCreatingQuizFor(null)}
                      />
                    ) : (
                      <button
                        type="button"
                        className="btn-primary text-sm"
                        onClick={() => setCreatingQuizFor(community.id)}
                      >
                        + Créer un quiz
                      </button>
                    )}

                    {quizzes.length === 0 &&
                      creatingQuizFor !== community.id && (
                        <p className="text-xs text-[var(--text-muted)]">
                          Ajoutez des questions dans le builder, puis publiez
                          le quiz et partagez le lien à votre cercle.
                        </p>
                      )}

                    {quizzes.length > 0 && (
                      <ul className="space-y-3">
                        {quizzes.map((quiz) => (
                          <li
                            key={quiz.id}
                            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 p-4"
                          >
                            <p className="font-display font-semibold text-[var(--text-primary)]">
                              {quiz.title}
                            </p>
                            {quiz.description && (
                              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                                {quiz.description}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                              {quiz.challengeIds.length} question
                              {quiz.challengeIds.length === 1 ? "" : "s"}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="btn-primary text-sm"
                                onClick={() =>
                                  onPlayQuiz(community.id, quiz.id)
                                }
                              >
                                Jouer
                              </button>
                              <button
                                type="button"
                                className="btn-secondary text-sm"
                                onClick={() =>
                                  void handleCopyLink(community.id, quiz.id)
                                }
                              >
                                {copyStatus === quiz.id
                                  ? "Lien copié !"
                                  : "Copier le lien d’invitation"}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className="text-xs text-[var(--text-muted)]">
                      {access.reason}
                      {!isConnected &&
                        " Connectez Circles pour lier les quiz à votre wallet."}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
