import type { SourceClaimCategory, SourceStatementVerdict } from "@/types/game";

export const claimCategoryLabels: Record<SourceClaimCategory, string> = {
  myth: "Popular myth",
  propaganda: "Propaganda",
  misattribution: "Misattribution",
  anachronism: "Anachronism",
  simplification: "Oversimplification",
};

export const verdictLabels: Record<SourceStatementVerdict, string> = {
  correct: "Supported",
  misleading: "Misleading",
  false: "False",
  legend: "Legend",
  myth: "Myth",
  propaganda: "Propaganda",
  misattribution: "Misattributed",
  anachronism: "Anachronism",
  simplification: "Oversimplified",
};

export function clueForCategory(category: SourceClaimCategory): string {
  const map: Record<SourceClaimCategory, string> = {
    myth: "Which claim is more legend than established fact?",
    propaganda: "Which statement reads most like political propaganda?",
    misattribution: "Which quotation or attribution is most doubtful?",
    anachronism: "Which claim could not have been true in that period?",
    simplification: "Which statement is true but dangerously oversimplified?",
  };
  return map[category];
}
