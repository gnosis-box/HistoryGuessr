import { useState } from "react";
import { allPlayModes } from "@/data/playModes";
import { getPlayModeLabel } from "@/data/playModes";
import { buildChallengeFromDraft } from "@/lib/challenges/buildFromDraft";
import {
  createCustomChallengeId,
  saveCustomChallenge,
} from "@/lib/challenges/customStorage";
import type { BuilderChallengeType, ChallengeDraft } from "@/types/challengeDraft";
import { emptyDraft } from "@/types/challengeDraft";
import type {
  SourceClaimCategory,
  SourceStatementVerdict,
} from "@/types/game";
import { claimCategoryLabels, verdictLabels } from "@/utils/sourceLabels";
import { MapPointPicker } from "./MapPointPicker";
import { builderInputClass } from "./builder-input-class";

const builderModes = allPlayModes.filter((m) => m.type !== "friend_challenge");

interface ChallengeBuilderProps {
  communityId: string;
  createdBy: string;
  onSaved: (challengeId: string) => void;
  onCancel: () => void;
}

export function ChallengeBuilder({
  communityId,
  createdBy,
  onSaved,
  onCancel,
}: ChallengeBuilderProps) {
  const [draft, setDraft] = useState<ChallengeDraft>(() =>
    emptyDraft("place_guess"),
  );
  const [error, setError] = useState<string | null>(null);

  function patch(partial: Partial<ChallengeDraft>) {
    setDraft((d) => ({ ...d, ...partial }));
  }

  function setType(type: BuilderChallengeType) {
    setDraft(emptyDraft(type));
    setError(null);
  }

  function handleSave() {
    const id = createCustomChallengeId();
    const { challenge, error: buildError } = buildChallengeFromDraft(draft, id);
    if (!challenge || buildError) {
      setError(buildError ?? "Could not build challenge.");
      return;
    }
    saveCustomChallenge({
      id,
      communityId,
      createdBy,
      createdAt: new Date().toISOString(),
      challenge,
    });
    onSaved(id);
  }

  return (
    <div className="glass-card space-y-4 rounded-2xl border border-[var(--map-green)]/30 p-5">
      <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
        Create a challenge
      </h3>
      <p className="text-xs text-[var(--text-secondary)]">
        Same game modes as History Guessr — your clue, your map points, your
        quotes and images.
      </p>

      <div className="flex flex-wrap gap-2">
        {builderModes.map((m) => (
          <button
            key={m.type}
            type="button"
            onClick={() => setType(m.type as BuilderChallengeType)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              draft.type === m.type
                ? "bg-[var(--gold)] text-[var(--bg-main)]"
                : "border border-[var(--border-subtle)] text-[var(--text-secondary)]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-[var(--gold-soft)]">
        Mode: {getPlayModeLabel(draft.type)}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          Title
          <input
            value={draft.title}
            onChange={(e) => patch({ title: e.target.value })}
            className={builderInputClass}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          Clue / question
          <textarea
            value={draft.clue}
            onChange={(e) => patch({ clue: e.target.value })}
            rows={3}
            className={builderInputClass}
          />
        </label>
        <label className="block text-sm">
          Correct answer (label)
          <input
            value={draft.answerLabel}
            onChange={(e) => patch({ answerLabel: e.target.value })}
            className={builderInputClass}
          />
        </label>
        <label className="block text-sm">
          Period (optional)
          <input
            value={draft.period}
            onChange={(e) => patch({ period: e.target.value })}
            className={builderInputClass}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          Explanation (shown after the round)
          <textarea
            value={draft.explanation}
            onChange={(e) => patch({ explanation: e.target.value })}
            rows={2}
            className={builderInputClass}
          />
        </label>
        <label className="block text-sm">
          Difficulty
          <select
            value={draft.difficulty}
            onChange={(e) =>
              patch({
                difficulty: e.target.value as ChallengeDraft["difficulty"],
              })
            }
            className={builderInputClass}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
        </label>
        <label className="block text-sm">
          Tags (comma-separated)
          <input
            value={draft.tags}
            onChange={(e) => patch({ tags: e.target.value })}
            placeholder="France, Revolution, Avignon"
            className={builderInputClass}
          />
        </label>
      </div>

      {draft.type === "place_guess" && (
        <MapPointPicker
          label="Where did it happen?"
          lat={draft.latitude}
          lng={draft.longitude}
          onChange={(latitude, longitude) => patch({ latitude, longitude })}
        />
      )}

      {draft.type === "city_history" && (
        <>
          <label className="block text-sm">
            City name
            <input
              value={draft.city}
              onChange={(e) => patch({ city: e.target.value })}
              className={builderInputClass}
            />
          </label>
          <MapPointPicker
            label="Landmark on the map"
            lat={draft.latitude}
            lng={draft.longitude}
            onChange={(latitude, longitude) => patch({ latitude, longitude })}
          />
        </>
      )}

      {draft.type === "date_guess" && (
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            Correct year
            <input
              type="number"
              value={draft.correctYear}
              onChange={(e) => patch({ correctYear: Number(e.target.value) })}
              className={builderInputClass}
            />
          </label>
          <label className="block text-sm">
            Slider min
            <input
              type="number"
              value={draft.yearMin}
              onChange={(e) => patch({ yearMin: Number(e.target.value) })}
              className={builderInputClass}
            />
          </label>
          <label className="block text-sm">
            Slider max
            <input
              type="number"
              value={draft.yearMax}
              onChange={(e) => patch({ yearMax: Number(e.target.value) })}
              className={builderInputClass}
            />
          </label>
        </div>
      )}

      {draft.type === "who_is_it" && (
        <>
          <label className="block text-sm">
            Clues (one per line, shown in order)
            <textarea
              value={draft.clues}
              onChange={(e) => patch({ clues: e.target.value })}
              rows={4}
              placeholder={"Born in Corsica\nEmperor of France\n…"}
              className={builderInputClass}
            />
          </label>
          <label className="block text-sm">
            Accepted answers (comma or newline)
            <input
              value={draft.acceptedAnswers}
              onChange={(e) => patch({ acceptedAnswers: e.target.value })}
              className={builderInputClass}
            />
          </label>
        </>
      )}

      {(draft.type === "quote_guess" ||
        draft.type === "image_guess" ||
        draft.type === "battle_guess") && (
        <McqSection draft={draft} patch={patch} />
      )}

      {draft.type === "quote_guess" && (
        <label className="block text-sm">
          Quote text
          <textarea
            value={draft.quote}
            onChange={(e) => patch({ quote: e.target.value })}
            rows={3}
            className={builderInputClass}
          />
        </label>
      )}

      {draft.type === "image_guess" && (
        <>
          <label className="block text-sm">
            Image URL
            <input
              value={draft.imageUrl}
              onChange={(e) => patch({ imageUrl: e.target.value })}
              placeholder="https://…"
              className={builderInputClass}
            />
          </label>
          {draft.imageUrl.startsWith("http") && (
            <img
              src={draft.imageUrl}
              alt={draft.imageAlt}
              className="max-h-40 rounded-lg object-cover"
            />
          )}
          <label className="block text-sm">
            Image description (accessibility)
            <input
              value={draft.imageAlt}
              onChange={(e) => patch({ imageAlt: e.target.value })}
              className={builderInputClass}
            />
          </label>
        </>
      )}

      {draft.type === "battle_guess" && (
        <MapPointPicker
          label="Battle location (optional)"
          lat={draft.latitude}
          lng={draft.longitude}
          onChange={(latitude, longitude) => patch({ latitude, longitude })}
        />
      )}

      {draft.type === "timeline_order" && (
        <TimelineSection draft={draft} patch={patch} />
      )}

      {draft.type === "map_path" && (
        <MapPathSection draft={draft} patch={patch} />
      )}

      {draft.type === "source_detective" && (
        <SourceSection draft={draft} patch={patch} />
      )}

      {error && (
        <p className="text-sm text-[var(--danger)]">{error}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={handleSave}>
          Save challenge
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function McqSection({
  draft,
  patch,
}: {
  draft: ChallengeDraft;
  patch: (p: Partial<ChallengeDraft>) => void;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-[var(--border-subtle)] p-3">
      <p className="text-xs font-semibold text-[var(--text-muted)]">
        Answer choices
      </p>
      {draft.options.map((opt, i) => (
        <div key={opt.id} className="flex flex-wrap items-center gap-2">
          <input
            type="radio"
            name="correct-opt"
            checked={draft.correctOptionId === opt.id}
            onChange={() => patch({ correctOptionId: opt.id })}
          />
          <input
            value={opt.label}
            onChange={(e) => {
              const options = [...draft.options];
              options[i] = { ...opt, label: e.target.value };
              patch({ options });
            }}
            placeholder={`Option ${i + 1}`}
            className="min-w-0 flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-1 text-sm"
          />
        </div>
      ))}
      {draft.options.length < 5 && (
        <button
          type="button"
          className="text-xs text-[var(--gold)]"
          onClick={() =>
            patch({
              options: [
                ...draft.options,
                { id: `opt-${draft.options.length + 1}`, label: "" },
              ],
            })
          }
        >
          + Add option
        </button>
      )}
    </div>
  );
}

function TimelineSection({
  draft,
  patch,
}: {
  draft: ChallengeDraft;
  patch: (p: Partial<ChallengeDraft>) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--text-muted)]">
        Events to reorder (players see them shuffled)
      </p>
      {draft.events.map((ev, i) => (
        <div key={ev.id} className="flex flex-wrap gap-2">
          <input
            value={ev.label}
            onChange={(e) => {
              const events = [...draft.events];
              events[i] = { ...ev, label: e.target.value };
              patch({ events });
            }}
            placeholder="Event label"
            className="min-w-[140px] flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-1 text-sm"
          />
          <input
            type="number"
            value={ev.year}
            onChange={(e) => {
              const events = [...draft.events];
              events[i] = { ...ev, year: Number(e.target.value) };
              patch({ events });
            }}
            className="w-24 rounded border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-1 text-sm"
          />
        </div>
      ))}
      {draft.events.length < 6 && (
        <button
          type="button"
          className="text-xs text-[var(--gold)]"
          onClick={() =>
            patch({
              events: [
                ...draft.events,
                {
                  id: `ev-${draft.events.length + 1}`,
                  label: "",
                  year: 1900,
                },
              ],
            })
          }
        >
          + Add event
        </button>
      )}
    </div>
  );
}

function MapPathSection({
  draft,
  patch,
}: {
  draft: ChallengeDraft;
  patch: (p: Partial<ChallengeDraft>) => void;
}) {
  return (
    <div className="space-y-4">
      {draft.steps.map((step, i) => (
        <div
          key={i}
          className="rounded-lg border border-[var(--border-subtle)] p-3"
        >
          <p className="mb-2 text-xs font-medium text-[var(--gold-soft)]">
            Waypoint {i + 1}
          </p>
          <input
            value={step.label}
            onChange={(e) => {
              const steps = [...draft.steps];
              steps[i] = { ...step, label: e.target.value };
              patch({ steps });
            }}
            className={`${builderInputClass} mb-2`}
          />
          <MapPointPicker
            label=""
            lat={step.lat}
            lng={step.lng}
            onChange={(lat, lng) => {
              const steps = [...draft.steps];
              steps[i] = { ...step, lat, lng };
              patch({ steps });
            }}
          />
        </div>
      ))}
      {draft.steps.length < 5 && (
        <button
          type="button"
          className="text-xs text-[var(--gold)]"
          onClick={() =>
            patch({
              steps: [
                ...draft.steps,
                {
                  lat: 48.85,
                  lng: 2.35,
                  label: `Step ${draft.steps.length + 1}`,
                },
              ],
            })
          }
        >
          + Add waypoint
        </button>
      )}
    </div>
  );
}

function SourceSection({
  draft,
  patch,
}: {
  draft: ChallengeDraft;
  patch: (p: Partial<ChallengeDraft>) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm">
        What should players hunt for?
        <select
          value={draft.claimCategory}
          onChange={(e) =>
            patch({ claimCategory: e.target.value as SourceClaimCategory })
          }
          className={builderInputClass}
        >
          {(Object.keys(claimCategoryLabels) as SourceClaimCategory[]).map(
            (k) => (
              <option key={k} value={k}>
                {claimCategoryLabels[k]}
              </option>
            ),
          )}
        </select>
      </label>
      <label className="block text-sm">
        Correct statement type to pick
        <select
          value={draft.targetVerdict}
          onChange={(e) =>
            patch({
              targetVerdict: e.target.value as SourceStatementVerdict,
            })
          }
          className={builderInputClass}
        >
          {(Object.keys(verdictLabels) as SourceStatementVerdict[]).map((k) => (
            <option key={k} value={k}>
              {verdictLabels[k]}
            </option>
          ))}
        </select>
      </label>
      {draft.statements.map((st, i) => (
        <label key={st.id} className="block text-sm">
          Statement {i + 1}
          <textarea
            value={st.text}
            onChange={(e) => {
              const statements = [...draft.statements];
              statements[i] = { ...st, text: e.target.value };
              patch({ statements });
            }}
            rows={2}
            className={builderInputClass}
          />
          <select
            value={st.verdict}
            onChange={(e) => {
              const statements = [...draft.statements];
              statements[i] = {
                ...st,
                verdict: e.target.value as SourceStatementVerdict,
              };
              patch({ statements });
            }}
            className={`${builderInputClass} mt-1`}
          >
            {(Object.keys(verdictLabels) as SourceStatementVerdict[]).map(
              (k) => (
                <option key={k} value={k}>
                  {verdictLabels[k]}
                </option>
              ),
            )}
          </select>
        </label>
      ))}
    </div>
  );
}
