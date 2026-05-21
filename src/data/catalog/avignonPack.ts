import type { GameChallenge } from "@/types/game";

export const avignonPack: GameChallenge[] = [
  {
    id: "place-avignon-bridge",
    type: "place_guess",
    title: "Pont Saint-Bénézet",
    clue:
      "A famous broken bridge over the Rhône, linked to a medieval children's song and the papal city.",
    period: "12th–17th century",
    answerLabel: "Pont Saint-Bénézet, Avignon",
    latitude: 43.9534,
    longitude: 4.805,
    explanation:
      "The bridge was repeatedly damaged by floods; four arches remain of the original structure.",
    difficulty: "medium",
    tags: ["Avignon", "France", "Medieval"],
    status: "mvp",
  },
  {
    id: "city-avignon-chartreuse",
    type: "city_history",
    title: "Chartreuse du Val de Bénédiction",
    clue:
      "Across the Rhône from Avignon, this vast Carthusian monastery was founded in the 14th century.",
    city: "Avignon",
    answerLabel: "Chartreuse du Val de Bénédiction, Villeneuve-lès-Avignon",
    latitude: 43.966,
    longitude: 4.793,
    explanation:
      "The largest Carthusian monastery in France — facing Avignon from Villeneuve-lès-Avignon.",
    difficulty: "hard",
    tags: ["Avignon", "France", "Religion"],
    status: "mvp",
  },
  {
    id: "date-avignon-papacy",
    type: "date_guess",
    title: "Papacy moves to Avignon",
    clue: "Pope Clement V established the papal court in Avignon, beginning the Avignon papacy.",
    answerLabel: "1309",
    correctYear: 1309,
    yearMin: 1200,
    yearMax: 1500,
    explanation: "Clement V settled in Avignon in 1309; popes remained until 1377.",
    difficulty: "medium",
    tags: ["Avignon", "Religion"],
    status: "mvp",
  },
  {
    id: "who-petrarch-avignon",
    type: "who_is_it",
    title: "Who am I?",
    clue: "A poet who witnessed the papal court in Avignon.",
    answerLabel: "Petrarch",
    clues: [
      "I helped shape Italian humanism and the sonnet form.",
      "I called Avignon the Babylon of the West in my letters.",
      "I climbed Mont Ventoux and wrote about the experience.",
    ],
    acceptedAnswers: ["petrarch", "francesco petrarca", "petrarca"],
    explanation:
      "Petrarch (1304–1374) spent years near the papal court and criticized its worldliness.",
    difficulty: "hard",
    tags: ["Avignon", "Italy", "Literature"],
    status: "mvp",
  },
  {
    id: "timeline-schism",
    type: "timeline_order",
    title: "Great Western Schism",
    clue: "Order these moments in the papal crisis of the 14th–15th centuries.",
    answerLabel: "Avignon papacy → Return to Rome → Two popes → Council resolves",
    events: [
      { id: "a", label: "Papacy resident in Avignon", year: 1309 },
      { id: "b", label: "Papacy returns to Rome", year: 1377 },
      { id: "c", label: "Western Schism: rival popes", year: 1378 },
      { id: "d", label: "Council of Constance ends schism", year: 1417 },
    ],
    explanation:
      "Avignon → Rome → dual claimants → 1417 restoration of a single papacy.",
    difficulty: "expert",
    tags: ["Avignon", "Religion", "Timeline"],
    status: "mvp",
  },
  {
    id: "source-avignon-walls",
    type: "source_detective",
    title: "Source Detective",
    clue: "Which claim is more legend than established fact?",
    claimCategory: "myth",
    answerLabel: "Avignon was never besieged",
    statements: [
      {
        id: "a",
        text: "Avignon's walls were built because the city was repeatedly attacked.",
        verdict: "correct",
      },
      {
        id: "b",
        text: "The papal palace was always the largest Gothic palace in Europe.",
        verdict: "simplification",
      },
      {
        id: "c",
        text: "No army ever threatened Avignon during the papal period.",
        verdict: "myth",
      },
    ],
    targetVerdict: "myth",
    explanation:
      "Avignon faced real military pressure; its walls reflect genuine threats, not mere decoration.",
    difficulty: "medium",
    tags: ["Avignon", "Sources"],
    status: "mvp",
  },
];
