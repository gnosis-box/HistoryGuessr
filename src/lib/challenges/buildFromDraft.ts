import type { GameChallenge } from "@/types/game";
import type { ChallengeDraft } from "@/types/challengeDraft";
import { createCustomChallengeId } from "./customStorage";

function parseTags(raw: string): string[] {
  return raw
    .split(/[,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function baseFromDraft(draft: ChallengeDraft, id: string) {
  return {
    id,
    title: draft.title.trim(),
    clue: draft.clue.trim(),
    period: draft.period.trim() || undefined,
    answerLabel: draft.answerLabel.trim(),
    explanation: draft.explanation.trim(),
    difficulty: draft.difficulty,
    tags: parseTags(draft.tags),
    status: "mvp" as const,
  };
}

export function buildChallengeFromDraft(
  draft: ChallengeDraft,
  id = createCustomChallengeId(),
): { challenge: GameChallenge | null; error?: string } {
  if (!draft.title.trim() || !draft.clue.trim() || !draft.answerLabel.trim()) {
    return { challenge: null, error: "Title, clue, and answer are required." };
  }

  const base = baseFromDraft(draft, id);

  switch (draft.type) {
    case "place_guess":
      return {
        challenge: {
          ...base,
          type: "place_guess",
          latitude: draft.latitude,
          longitude: draft.longitude,
        },
      };

    case "city_history":
      return {
        challenge: {
          ...base,
          type: "city_history",
          city: draft.city.trim() || "Custom city",
          latitude: draft.latitude,
          longitude: draft.longitude,
        },
      };

    case "date_guess":
      return {
        challenge: {
          ...base,
          type: "date_guess",
          correctYear: draft.correctYear,
          yearMin: Math.min(draft.yearMin, draft.correctYear - 50),
          yearMax: Math.max(draft.yearMax, draft.correctYear + 50),
        },
      };

    case "timeline_order": {
      const events = draft.events
        .filter((e) => e.label.trim())
        .map((e) => ({
          id: e.id,
          label: e.label.trim(),
          year: e.year,
        }));
      if (events.length < 3) {
        return { challenge: null, error: "Add at least 3 timeline events." };
      }
      return { challenge: { ...base, type: "timeline_order", events } };
    }

    case "who_is_it": {
      const clues = draft.clues
        .split("\n")
        .map((c) => c.trim())
        .filter(Boolean);
      const acceptedAnswers = draft.acceptedAnswers
        .split(/[,;\n]+/)
        .map((a) => a.trim())
        .filter(Boolean);
      if (clues.length < 1 || acceptedAnswers.length < 1) {
        return {
          challenge: null,
          error: "Add at least one clue and one accepted answer.",
        };
      }
      return {
        challenge: {
          ...base,
          type: "who_is_it",
          clues,
          acceptedAnswers,
        },
      };
    }

    case "quote_guess": {
      const options = draft.options.filter((o) => o.label.trim());
      if (!draft.quote.trim() || options.length < 2) {
        return { challenge: null, error: "Quote and at least 2 options required." };
      }
      return {
        challenge: {
          ...base,
          type: "quote_guess",
          quote: draft.quote.trim(),
          options,
          correctOptionId: draft.correctOptionId,
        },
      };
    }

    case "image_guess": {
      const options = draft.options.filter((o) => o.label.trim());
      if (!draft.imageUrl.trim() || options.length < 2) {
        return {
          challenge: null,
          error: "Image URL and at least 2 options required.",
        };
      }
      return {
        challenge: {
          ...base,
          type: "image_guess",
          imageUrl: draft.imageUrl.trim(),
          imageAlt: draft.imageAlt.trim() || draft.title,
          options,
          correctOptionId: draft.correctOptionId,
        },
      };
    }

    case "battle_guess": {
      const options = draft.options.filter((o) => o.label.trim());
      if (options.length < 2) {
        return { challenge: null, error: "At least 2 battle options required." };
      }
      return {
        challenge: {
          ...base,
          type: "battle_guess",
          options,
          correctOptionId: draft.correctOptionId,
          latitude: draft.latitude,
          longitude: draft.longitude,
        },
      };
    }

    case "map_path": {
      const steps = draft.steps.filter((s) => s.label.trim());
      if (steps.length < 2) {
        return { challenge: null, error: "Add at least 2 waypoints on the route." };
      }
      return { challenge: { ...base, type: "map_path", steps } };
    }

    case "source_detective": {
      const statements = draft.statements
        .filter((s) => s.text.trim())
        .map((s) => ({
          id: s.id,
          text: s.text.trim(),
          verdict: s.verdict,
        }));
      if (statements.length < 3) {
        return { challenge: null, error: "Add at least 3 source statements." };
      }
      return {
        challenge: {
          ...base,
          type: "source_detective",
          statements,
          targetVerdict: draft.targetVerdict,
          claimCategory: draft.claimCategory,
        },
      };
    }

    default:
      return { challenge: null, error: "Unknown challenge type." };
  }
}
