import { useState } from "react";
import { useCircles } from "@/hooks/use-circles";
import { useCommunities } from "@/hooks/use-communities";
import { canAccessCommunity } from "@/lib/communities/access";
import { buildQuizShareUrl, copyShareLink } from "@/lib/communities/share";
import { CreateCommunityForm } from "./CreateCommunityForm";
import { CreateQuizForm } from "./CreateQuizForm";

interface CommunitiesScreenProps {
  onPlayQuiz: (communityId: string, quizId: string) => void;
}

export function CommunitiesScreen({ onPlayQuiz }: CommunitiesScreenProps) {
  const { address, isConnected } = useCircles();
  const { communities, addCommunity, addQuiz, getQuizzesForCommunity } =
    useCommunities();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [creatingQuizFor, setCreatingQuizFor] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const founder = address ?? "";

  async function handleCopyLink(communityId: string, quizId: string) {
    const url = buildQuizShareUrl(communityId, quizId);
    try {
      await copyShareLink(url);
      setCopyStatus(quizId);
      window.setTimeout(() => setCopyStatus(null), 2000);
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-up">
      <header>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)]">
          Trusted circles
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Create a community, invite wallets you trust, build a custom quiz from
          the catalog, and share a link — others open it in History Guessr or the
          Circles playground.
        </p>
      </header>

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
        <p className="text-sm text-[var(--text-muted)]">
          No circles yet — create one above.
        </p>
      ) : (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Your circles ({communities.length})
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
                      {community.description || "No description"}
                    </p>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      {community.visibility === "private"
                        ? "Private"
                        : "Open link"}{" "}
                      · {community.inviteAddresses.length} invite
                      {community.inviteAddresses.length === 1 ? "" : "s"} ·{" "}
                      {quizzes.length} quiz
                      {quizzes.length === 1 ? "" : "zes"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : community.id)
                    }
                  >
                    {isExpanded ? "Collapse" : "Manage"}
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
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn-primary text-sm"
                          onClick={() => setCreatingQuizFor(community.id)}
                        >
                          + Create quiz
                        </button>
                      </div>
                    )}

                    {quizzes.length === 0 && creatingQuizFor !== community.id && (
                      <p className="text-xs text-[var(--text-muted)]">
                        Create challenges in the quiz builder, then publish a
                        quiz for your circle.
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
                              {quiz.challengeIds.length} questions
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="btn-primary text-sm"
                                onClick={() =>
                                  onPlayQuiz(community.id, quiz.id)
                                }
                              >
                                Play
                              </button>
                              <button
                                type="button"
                                className="btn-secondary text-sm"
                                onClick={() =>
                                  void handleCopyLink(community.id, quiz.id)
                                }
                              >
                                {copyStatus === quiz.id
                                  ? "Link copied!"
                                  : "Copy invite link"}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className="text-xs text-[var(--text-muted)]">
                      {access.reason}
                      {!isConnected &&
                        " Connect Circles to attach quizzes to your wallet."}
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
