import type { GameChallenge } from "@/types/game";

export const parisPack: GameChallenge[] = [
  {
    id: "city-paris-conciergerie",
    type: "city_history",
    title: "Conciergerie",
    clue:
      "In Paris, Marie-Antoinette and many revolutionaries were imprisoned in this former royal palace on the Île de la Cité.",
    city: "Paris",
    answerLabel: "Conciergerie, Paris",
    latitude: 48.8556,
    longitude: 2.346,
    explanation:
      "The Conciergerie became a notorious revolutionary prison after 1792.",
    difficulty: "medium",
    tags: ["Paris", "Revolution", "France"],
    status: "mvp",
  },
  {
    id: "city-paris-tuileries",
    type: "city_history",
    title: "Tuileries Palace",
    clue:
      "In Paris, revolutionaries stormed this royal residence in August 1792, ending the monarchy.",
    city: "Paris",
    answerLabel: "Tuileries Palace, Paris",
    latitude: 48.8634,
    longitude: 2.3275,
    explanation: "The Tuileries storming (10 August 1792) marked a radical turn in the Revolution.",
    difficulty: "medium",
    tags: ["Paris", "Revolution"],
    status: "mvp",
  },
  {
    id: "place-paris-concorde",
    type: "place_guess",
    title: "Place de la Concorde",
    clue:
      "In Paris, a guillotine stood here during the Terror — today a vast square between the Champs-Élysées and the Seine.",
    period: "18th century",
    answerLabel: "Place de la Concorde, Paris",
    latitude: 48.8656,
    longitude: 2.3212,
    explanation:
      "Then Place de la Révolution — site of Louis XVI's execution in 1793.",
    difficulty: "medium",
    tags: ["Paris", "Revolution"],
    status: "mvp",
  },
  {
    id: "path-varennes-flight",
    type: "map_path",
    title: "Flight to Varennes",
    clue:
      "Place 3 points: Paris area → eastern route → town where Louis XVI was arrested (1791).",
    answerLabel: "Paris region → Meaux area → Varennes",
    steps: [
      { lat: 48.8566, lng: 2.3522, label: "Tuileries / Paris" },
      { lat: 48.96, lng: 3.0, label: "Eastward flight" },
      { lat: 49.0833, lng: 5.1333, label: "Varennes-en-Argonne" },
    ],
    explanation:
      "The royal family's failed escape ended with arrest at Varennes in June 1791.",
    difficulty: "expert",
    tags: ["Paris", "Revolution", "Journey"],
    status: "mvp",
  },
  {
    id: "source-marie-brioche",
    type: "source_detective",
    title: "Source Detective",
    clue: "Which quotation or attribution is most doubtful?",
    claimCategory: "misattribution",
    answerLabel: "Let them eat cake",
    statements: [
      {
        id: "a",
        text: "Marie-Antoinette was executed by guillotine in 1793.",
        verdict: "correct",
      },
      {
        id: "b",
        text: "She famously said “Let them eat cake” when told the poor had no bread.",
        verdict: "misattribution",
      },
      {
        id: "c",
        text: "She was queen consort of Louis XVI.",
        verdict: "correct",
      },
    ],
    targetVerdict: "misattribution",
    explanation:
      "No reliable contemporary source attributes the phrase to her; it appears in later revolutionary pamphlets.",
    difficulty: "easy",
    tags: ["Paris", "Revolution", "Sources"],
    status: "mvp",
  },
  {
    id: "quote-revolution-liberty",
    type: "quote_guess",
    title: "Quote Guess",
    clue: "Which revolutionary document does this line echo?",
    quote: "Men are born and remain free and equal in rights.",
    answerLabel: "Declaration of the Rights of Man (1789)",
    options: [
      { id: "a", label: "Declaration of the Rights of Man, 1789" },
      { id: "b", label: "U.S. Constitution, 1787" },
      { id: "c", label: "Magna Carta, 1215" },
      { id: "d", label: "Treaty of Westphalia, 1648" },
    ],
    correctOptionId: "a",
    sourceConfidence: "verified",
    explanation: "Article 1 of the 1789 Declaration — foundational text of the Revolution.",
    difficulty: "medium",
    tags: ["Paris", "Revolution", "Quotes"],
    status: "mvp",
  },
];
