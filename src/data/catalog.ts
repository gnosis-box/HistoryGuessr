import type { CityHistoryChallenge, GameChallenge } from "@/types/game";

export const challengeCatalog: GameChallenge[] = [
  // —— Place Guess (8) ——
  {
    id: "avignon-papacy",
    type: "place_guess",
    title: "The Avignon Papacy",
    clue:
      "In 1309, the seat of Western Christianity moved here, reshaping the religious and political map of Europe.",
    period: "14th century",
    answerLabel: "Avignon, France",
    latitude: 43.9493,
    longitude: 4.8055,
    year: 1309,
    explanation:
      "Pope Clement V settled in Avignon in 1309, beginning nearly seven decades when the papacy resided outside Rome.",
    difficulty: "medium",
    tags: ["Religion", "France", "Medieval", "Avignon"],
    status: "mvp",
  },
  {
    id: "napoleon-coronation",
    type: "place_guess",
    title: "Napoleon's Coronation",
    clue: "In 1804, a French general crowned himself emperor in this cathedral.",
    period: "Early 19th century",
    answerLabel: "Notre-Dame de Paris, France",
    latitude: 48.853,
    longitude: 2.3499,
    explanation:
      "Napoleon crowned himself Emperor at Notre-Dame on 2 December 1804.",
    difficulty: "easy",
    tags: ["France", "Paris", "Empire"],
    status: "mvp",
  },
  {
    id: "constantinople-fall",
    type: "place_guess",
    title: "Fall of Constantinople",
    clue:
      "In 1453, an ancient imperial capital fell, marking a turning point between medieval and early modern worlds.",
    period: "15th century",
    answerLabel: "Istanbul, Turkey",
    latitude: 41.0082,
    longitude: 28.9784,
    explanation: "Constantinople fell to the Ottomans on 29 May 1453.",
    difficulty: "medium",
    tags: ["Byzantium", "Ottoman", "Istanbul"],
    status: "mvp",
  },
  {
    id: "declaration-independence-place",
    type: "place_guess",
    title: "Declaration of Independence",
    clue: "In 1776, representatives gathered here to declare a new nation independent.",
    period: "18th century",
    answerLabel: "Philadelphia, USA",
    latitude: 39.9489,
    longitude: -75.15,
    explanation:
      "The Declaration was adopted in Philadelphia on 4 July 1776.",
    difficulty: "easy",
    tags: ["USA", "Revolution", "Philadelphia"],
    status: "mvp",
  },
  {
    id: "waterloo-battle-place",
    type: "place_guess",
    title: "A Famous Battlefield",
    clue:
      "In 1815, a decisive battle near this Belgian town ended a French emperor's comeback.",
    period: "19th century",
    answerLabel: "Waterloo, Belgium",
    latitude: 50.7147,
    longitude: 4.3991,
    explanation:
      "The Battle of Waterloo on 18 June 1815 ended Napoleon's Hundred Days.",
    difficulty: "medium",
    tags: ["Napoleon", "Belgium"],
    status: "mvp",
  },

  // —— Date Guess ——
  {
    id: "date-constantinople",
    type: "date_guess",
    title: "Fall of Constantinople",
    clue: "The city of Constantinople fell to the Ottoman Empire.",
    answerLabel: "1453",
    correctYear: 1453,
    yearMin: 1200,
    yearMax: 1800,
    explanation: "Constantinople fell on 29 May 1453.",
    difficulty: "medium",
    tags: ["Byzantium", "Ottoman"],
    status: "mvp",
  },
  {
    id: "date-magna-carta",
    type: "date_guess",
    title: "Magna Carta",
    clue: "King John of England sealed limits to royal power at Runnymede.",
    answerLabel: "1215",
    correctYear: 1215,
    yearMin: 1000,
    yearMax: 1600,
    explanation: "Magna Carta was sealed in June 1215.",
    difficulty: "medium",
    tags: ["England", "Law"],
    status: "mvp",
  },
  {
    id: "date-french-revolution",
    type: "date_guess",
    title: "Storming of the Bastille",
    clue: "Parisians stormed a royal fortress, a symbol of the old regime.",
    answerLabel: "1789",
    correctYear: 1789,
    yearMin: 1600,
    yearMax: 1900,
    explanation: "The Bastille was stormed on 14 July 1789.",
    difficulty: "easy",
    tags: ["France", "Revolution", "Paris"],
    status: "mvp",
  },

  // —— Timeline Order ——
  {
    id: "timeline-early-modern",
    type: "timeline_order",
    title: "Early modern turning points",
    clue: "Arrange these events from earliest to latest.",
    answerLabel: "Constantinople → Columbus → Luther → French Revolution",
    events: [
      { id: "a", label: "Fall of Constantinople", year: 1453 },
      { id: "b", label: "Columbus reaches the Americas", year: 1492 },
      { id: "c", label: "Luther's 95 Theses", year: 1517 },
      { id: "d", label: "French Revolution begins", year: 1789 },
    ],
    explanation:
      "1453 → 1492 → 1517 → 1789 traces the shift from medieval empires to Atlantic exploration, Reformation, and revolution.",
    difficulty: "medium",
    tags: ["World", "Timeline"],
    status: "mvp",
  },
  {
    id: "timeline-ww2-pacific",
    type: "timeline_order",
    title: "Second World War (Pacific arc)",
    clue: "Order these Pacific-war milestones chronologically.",
    answerLabel: "Pearl Harbor → Midway → Hiroshima",
    events: [
      { id: "a", label: "Attack on Pearl Harbor", year: 1941 },
      { id: "b", label: "Battle of Midway", year: 1942 },
      { id: "c", label: "Atomic bombing of Hiroshima", year: 1945 },
    ],
    explanation: "1941 entry of the US → 1942 turning point → 1945 endgame.",
    difficulty: "hard",
    tags: ["WWII", "Timeline"],
    status: "mvp",
  },

  // —— Who Is It ——
  {
    id: "who-napoleon",
    type: "who_is_it",
    title: "Who am I?",
    clue: "Guess the historical figure from progressive clues.",
    answerLabel: "Napoleon Bonaparte",
    clues: [
      "I was born on an island in the Mediterranean.",
      "I became emperor of France.",
      "I was defeated in 1815 at Waterloo.",
    ],
    acceptedAnswers: ["napoleon", "napoleon bonaparte", "bonaparte"],
    explanation: "Napoleon Bonaparte (1769–1821), Emperor of the French.",
    difficulty: "easy",
    tags: ["France", "Empire"],
    status: "mvp",
  },
  {
    id: "who-joan",
    type: "who_is_it",
    title: "Who am I?",
    clue: "A figure from the Hundred Years' War.",
    answerLabel: "Joan of Arc",
    clues: [
      "I heard voices urging me to save France.",
      "I lifted the siege of Orléans.",
      "I was tried and burned in Rouen in 1431.",
    ],
    acceptedAnswers: ["joan of arc", "jeanne d arc", "jeanne d'arc", "joan"],
    explanation: "Joan of Arc (c. 1412–1431), national heroine of France.",
    difficulty: "medium",
    tags: ["France", "Medieval"],
    status: "mvp",
  },

  // —— Quote Guess ——
  {
    id: "quote-joan",
    type: "quote_guess",
    title: "Quote Guess",
    clue: "Who is this quotation most closely associated with?",
    quote: "I am not afraid… I was born to do this.",
    answerLabel: "Joan of Arc (attributed)",
    options: [
      { id: "a", label: "Joan of Arc" },
      { id: "b", label: "Catherine the Great" },
      { id: "c", label: "Queen Elizabeth I" },
      { id: "d", label: "Hildegard of Bingen" },
    ],
    correctOptionId: "a",
    sourceConfidence: "attributed",
    explanation:
      "Often attributed to Joan of Arc; exact wording is debated among historians.",
    difficulty: "medium",
    tags: ["Quotes", "France"],
    status: "mvp",
  },
  {
    id: "quote-lincoln",
    type: "quote_guess",
    title: "Quote Guess",
    clue: "Identify the speaker of this line.",
    quote:
      "Government of the people, by the people, for the people, shall not perish from the earth.",
    answerLabel: "Abraham Lincoln",
    options: [
      { id: "a", label: "Thomas Jefferson" },
      { id: "b", label: "Abraham Lincoln" },
      { id: "c", label: "Winston Churchill" },
      { id: "d", label: "Franklin D. Roosevelt" },
    ],
    correctOptionId: "b",
    sourceConfidence: "verified",
    explanation: "From the Gettysburg Address, 19 November 1863.",
    difficulty: "easy",
    tags: ["USA", "Quotes"],
    status: "mvp",
  },

  // —— Map Path ——
  {
    id: "path-napoleon-hundred-days",
    type: "map_path",
    title: "Napoleon's Hundred Days",
    clue:
      "Place 3 points on the map tracing Napoleon's return from Elba toward Paris (simplified route).",
    answerLabel: "Elba → Lyon area → Paris",
    steps: [
      { lat: 42.8, lng: 10.3, label: "Elba (departure)" },
      { lat: 45.75, lng: 4.85, label: "Lyon region" },
      { lat: 48.8566, lng: 2.3522, label: "Paris" },
    ],
    explanation:
      "In 1815 Napoleon escaped Elba, marched through eastern France, and entered Paris before Waterloo.",
    difficulty: "expert",
    tags: ["Napoleon", "France", "Journey"],
    status: "mvp",
  },

  // —— Image Guess ——
  {
    id: "image-tennis-court",
    type: "image_guess",
    title: "Image Guess",
    clue: "What event does this painting depict?",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Lejeune_-_Serment_du_Jeu_de_Paume.jpg/640px-Lejeune_-_Serment_du_Jeu_de_Paume.jpg",
    imageAlt: "Tennis Court Oath at Versailles",
    answerLabel: "Tennis Court Oath (1789)",
    options: [
      { id: "a", label: "Tennis Court Oath, 1789" },
      { id: "b", label: "Coronation of Napoleon, 1804" },
      { id: "c", label: "Storming of the Bastille, 1789" },
      { id: "d", label: "Congress of Vienna, 1815" },
    ],
    correctOptionId: "a",
    explanation:
      "Jacques-Louis David's depiction of the 20 June 1789 oath at Versailles.",
    difficulty: "medium",
    tags: ["France", "Revolution", "Art"],
    status: "mvp",
  },
  {
    id: "image-moon-landing",
    type: "image_guess",
    title: "Image Guess",
    clue: "What historical milestone is shown?",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/640px-Aldrin_Apollo_11_original.jpg",
    imageAlt: "Buzz Aldrin on the Moon",
    answerLabel: "Apollo 11 Moon landing (1969)",
    options: [
      { id: "a", label: "Apollo 11 Moon landing, 1969" },
      { id: "b", label: "Sputnik launch, 1957" },
      { id: "c", label: "First ISS module, 1998" },
      { id: "d", label: "Hubble deployment, 1990" },
    ],
    correctOptionId: "a",
    explanation: "Neil Armstrong and Buzz Aldrin landed on the Moon in July 1969.",
    difficulty: "easy",
    tags: ["Space", "20th century"],
    status: "mvp",
  },

  // —— Battle Guess ——
  {
    id: "battle-waterloo",
    type: "battle_guess",
    title: "Battle Guess",
    clue:
      "A decisive battle in 1815 ended the ambitions of a French emperor.",
    answerLabel: "Battle of Waterloo",
    options: [
      { id: "a", label: "Battle of Austerlitz" },
      { id: "b", label: "Battle of Waterloo" },
      { id: "c", label: "Battle of Leipzig" },
      { id: "d", label: "Battle of Borodino" },
    ],
    correctOptionId: "b",
    latitude: 50.7147,
    longitude: 4.3991,
    explanation: "Waterloo ended Napoleon's rule during the Hundred Days.",
    difficulty: "easy",
    tags: ["Napoleon", "Belgium"],
    status: "mvp",
  },
  {
    id: "battle-hastings",
    type: "battle_guess",
    title: "Battle Guess",
    clue:
      "In 1066, William the Conqueror defeated Harold II in this English battle.",
    answerLabel: "Battle of Hastings",
    options: [
      { id: "a", label: "Battle of Hastings" },
      { id: "b", label: "Battle of Agincourt" },
      { id: "c", label: "Battle of Bosworth" },
      { id: "d", label: "Battle of Culloden" },
    ],
    correctOptionId: "a",
    latitude: 50.9147,
    longitude: 0.4869,
    explanation: "The Norman conquest of England began after Hastings.",
    difficulty: "medium",
    tags: ["England", "Medieval"],
    status: "mvp",
  },

  // —— City History ——
  {
    id: "city-avignon-palais",
    type: "city_history",
    title: "Palais des Papes",
    clue:
      "In Avignon, this fortress-palace became the seat of popes in the 14th century.",
    city: "Avignon",
    answerLabel: "Palais des Papes, Avignon",
    latitude: 43.9509,
    longitude: 4.8075,
    explanation:
      "The Palais des Papes dominates Avignon — symbol of the Avignon papacy.",
    difficulty: "medium",
    tags: ["Avignon", "France", "Medieval", "Religion"],
    status: "mvp",
  },
  {
    id: "city-paris-bastille",
    type: "city_history",
    title: "Place de la Bastille",
    clue:
      "In Paris, revolutionaries stormed a fortress prison here in July 1789.",
    city: "Paris",
    answerLabel: "Bastille, Paris",
    latitude: 48.8532,
    longitude: 2.3692,
    explanation: "The Bastille storming ignited the French Revolution.",
    difficulty: "easy",
    tags: ["Paris", "France", "Revolution"],
    status: "mvp",
  },

  // —— Source Detective ——
  {
    id: "source-napoleon",
    type: "source_detective",
    title: "Source Detective",
    clue: "Which statement is the most misleading?",
    answerLabel: "“Napoleon was unusually short”",
    statements: [
      {
        id: "a",
        text: "Napoleon was unusually short for his time.",
        verdict: "misleading",
      },
      {
        id: "b",
        text: "Napoleon was crowned emperor in Notre-Dame.",
        verdict: "correct",
      },
      {
        id: "c",
        text: "Napoleon was born in Corsica.",
        verdict: "correct",
      },
    ],
    targetVerdict: "misleading",
    explanation:
      "Napoleon was about average height; the “short” myth grew from British propaganda and unit confusion (French vs English inches).",
    difficulty: "medium",
    tags: ["Napoleon", "Sources"],
    status: "mvp",
  },
  {
    id: "source-vikings",
    type: "source_detective",
    title: "Source Detective",
    clue: "Which claim is more legend than established fact?",
    answerLabel: "Vikings wore horned helmets daily",
    statements: [
      {
        id: "a",
        text: "Viking raiders reached North America before Columbus.",
        verdict: "correct",
      },
      {
        id: "b",
        text: "Vikings routinely wore horned helmets in battle.",
        verdict: "legend",
      },
      {
        id: "c",
        text: "Viking ships could navigate open seas.",
        verdict: "correct",
      },
    ],
    targetVerdict: "legend",
    explanation:
      "Horned helmets are largely a 19th-century romantic image, not typical Viking gear.",
    difficulty: "easy",
    tags: ["Vikings", "Sources"],
    status: "mvp",
  },

  // —— Friend Challenge (uses map like place guess) ——
  {
    id: "friend-avignon",
    type: "friend_challenge",
    title: "Beat your friend — Avignon",
    clue:
      "Your friend scored 842 on this clue. Can you place the Avignon papacy more accurately?",
    answerLabel: "Avignon, France",
    opponentName: "Guest Historian",
    opponentScore: 842,
    latitude: 43.9493,
    longitude: 4.8055,
    explanation: "Same event as the Avignon papacy — compare scores with your circle.",
    difficulty: "medium",
    tags: ["Avignon", "Social", "Circles"],
    status: "mvp",
  },
];

export function getChallengesByType(type: GameChallenge["type"]): GameChallenge[] {
  return challengeCatalog.filter((c) => c.type === type);
}

export function getChallengeById(id: string): GameChallenge | undefined {
  return challengeCatalog.find((c) => c.id === id);
}

export function pickRandomChallenge(
  type?: GameChallenge["type"],
  excludeId?: string,
): GameChallenge {
  const pool = type
    ? getChallengesByType(type)
    : challengeCatalog;
  const filtered = excludeId ? pool.filter((c) => c.id !== excludeId) : pool;
  const list = filtered.length > 0 ? filtered : pool;
  return list[Math.floor(Math.random() * list.length)];
}

export const cityList = ["Avignon", "Paris", "Istanbul", "Philadelphia"] as const;

export function pickCityChallenge(city: string): CityHistoryChallenge | undefined {
  const pool = getChallengesByType("city_history").filter(
    (c): c is CityHistoryChallenge =>
      c.type === "city_history" && c.city === city,
  );
  if (pool.length === 0) {
    const fallback = getChallengesByType("place_guess").filter((c) =>
      c.tags.some((t) => t.toLowerCase() === city.toLowerCase()),
    );
    if (fallback[0] && fallback[0].type === "place_guess") {
      return {
        ...fallback[0],
        type: "city_history",
        city,
      };
    }
    return undefined;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
