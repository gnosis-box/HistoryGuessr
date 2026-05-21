import type { GameChallenge } from "@/types/game";

export const mythsPack: GameChallenge[] = [
  {
    id: "source-newton-apple",
    type: "source_detective",
    title: "Source Detective",
    clue: "Which claim is more legend than established fact?",
    claimCategory: "myth",
    answerLabel: "Apple fell on Newton's head",
    statements: [
      {
        id: "a",
        text: "Newton published principia on gravitation in 1687.",
        verdict: "correct",
      },
      {
        id: "b",
        text: "An apple fell on his head and instantly revealed gravity to him.",
        verdict: "myth",
      },
      {
        id: "c",
        text: "He worked at Cambridge on planetary motion.",
        verdict: "correct",
      },
    ],
    targetVerdict: "myth",
    explanation:
      "Newton told a story about watching an apple fall — not being struck on the head.",
    difficulty: "easy",
    tags: ["Science", "Myths", "Sources"],
    status: "mvp",
  },
  {
    id: "source-galileo-towers",
    type: "source_detective",
    title: "Source Detective",
    clue: "Which quotation or attribution is most doubtful?",
    claimCategory: "misattribution",
    answerLabel: "And yet it moves",
    statements: [
      {
        id: "a",
        text: "Galileo was tried by the Inquisition in 1633.",
        verdict: "correct",
      },
      {
        id: "b",
        text: "After recanting, he muttered “And yet it moves” about the Earth.",
        verdict: "misattribution",
      },
      {
        id: "c",
        text: "He used telescopic observations of Jupiter's moons.",
        verdict: "correct",
      },
    ],
    targetVerdict: "misattribution",
    explanation:
      "The famous phrase appears only in later anecdotes — not in trial records.",
    difficulty: "medium",
    tags: ["Science", "Myths", "Sources"],
    status: "mvp",
  },
  {
    id: "source-pyramids-slaves",
    type: "source_detective",
    title: "Source Detective",
    clue: "Which statement is true but dangerously oversimplified?",
    claimCategory: "simplification",
    answerLabel: "Built only by slaves",
    statements: [
      {
        id: "a",
        text: "The Great Pyramid of Giza was built in the Old Kingdom.",
        verdict: "correct",
      },
      {
        id: "b",
        text: "It was built entirely by Hebrew slaves like in Exodus.",
        verdict: "simplification",
      },
      {
        id: "c",
        text: "Archaeology shows organized labor crews with rations.",
        verdict: "correct",
      },
    ],
    targetVerdict: "simplification",
    explanation:
      "Evidence points to paid laborers and corvée — not biblical slavery as popular films suggest.",
    difficulty: "medium",
    tags: ["Egypt", "Myths", "Sources"],
    status: "mvp",
  },
  {
    id: "source-gladiators-death",
    type: "source_detective",
    title: "Source Detective",
    clue: "Which claim is more legend than established fact?",
    claimCategory: "myth",
    answerLabel: "Gladiators always fought to the death",
    statements: [
      {
        id: "a",
        text: "Gladiatorial games were expensive to stage in Rome.",
        verdict: "correct",
      },
      {
        id: "b",
        text: "Every gladiator fight ended with a mandatory killing.",
        verdict: "myth",
      },
      {
        id: "c",
        text: "Referees could stop a fight if a fighter surrendered.",
        verdict: "correct",
      },
    ],
    targetVerdict: "myth",
    explanation:
      "Training fighters were valuable assets; many bouts ended without death.",
    difficulty: "easy",
    tags: ["Rome", "Myths", "Sources"],
    status: "mvp",
  },
  {
    id: "source-dark-ages",
    type: "source_detective",
    title: "Source Detective",
    clue: "Which statement reads most like political propaganda?",
    claimCategory: "propaganda",
    answerLabel: "Nothing happened for 1000 years",
    statements: [
      {
        id: "a",
        text: "Monasteries preserved classical manuscripts in Europe.",
        verdict: "correct",
      },
      {
        id: "b",
        text: "The Middle Ages were a thousand years without science, art, or learning.",
        verdict: "propaganda",
      },
      {
        id: "c",
        text: "Islamic scholars translated and advanced Greek medicine.",
        verdict: "correct",
      },
    ],
    targetVerdict: "propaganda",
    explanation:
      "The “Dark Ages” label is a later polemical simplification — medieval Europe was not static.",
    difficulty: "medium",
    tags: ["Medieval", "Myths", "Sources"],
    status: "mvp",
  },
  {
    id: "source-napoleon-height",
    type: "source_detective",
    title: "Source Detective",
    clue: "Which statement reads most like political propaganda?",
    claimCategory: "propaganda",
    answerLabel: "Napoleon was a tiny man",
    statements: [
      {
        id: "a",
        text: "British cartoons mocked Napoleon’s stature to belittle him.",
        verdict: "propaganda",
      },
      {
        id: "b",
        text: "He was crowned at Notre-Dame in 1804.",
        verdict: "correct",
      },
      {
        id: "c",
        text: "He was born in Corsica in 1769.",
        verdict: "correct",
      },
    ],
    targetVerdict: "propaganda",
    explanation:
      "The “tiny tyrant” image was amplified by enemy caricature more than by measurement.",
    difficulty: "medium",
    tags: ["Napoleon", "Myths", "Sources"],
    status: "mvp",
  },
];
