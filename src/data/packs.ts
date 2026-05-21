export interface ContentPack {
  id: string;
  name: string;
  tagline: string;
  description: string;
  challengeIds: string[];
  accent: "gold" | "map" | "critical" | "empire";
}

export const contentPacks: ContentPack[] = [
  {
    id: "avignon",
    name: "Avignon",
    tagline: "The century of the popes",
    description:
      "Papacy, Palais des Papes, bridge, schism, Petrarch, and source checks.",
    challengeIds: [
      "avignon-papacy",
      "city-avignon-palais",
      "place-avignon-bridge",
      "city-avignon-chartreuse",
      "date-avignon-papacy",
      "who-petrarch-avignon",
      "timeline-schism",
      "source-avignon-walls",
      "friend-avignon",
    ],
    accent: "gold",
  },
  {
    id: "paris-revolution",
    name: "Paris Revolution",
    tagline: "1789 and its aftermath",
    description:
      "Bastille, Tuileries, Conciergerie, Varennes, rights of man, and misquotes.",
    challengeIds: [
      "city-paris-bastille",
      "image-tennis-court",
      "date-french-revolution",
      "city-paris-conciergerie",
      "city-paris-tuileries",
      "place-paris-concorde",
      "path-varennes-flight",
      "source-marie-brioche",
      "quote-revolution-liberty",
    ],
    accent: "map",
  },
  {
    id: "myths-lies",
    name: "Myths & Lies",
    tagline: "What can you trust?",
    description:
      "Napoleon, Vikings, Newton, Galileo, pyramids, gladiators, Dark Ages — source detective only.",
    challengeIds: [
      "source-napoleon",
      "source-vikings",
      "source-newton-apple",
      "source-galileo-towers",
      "source-pyramids-slaves",
      "source-gladiators-death",
      "source-dark-ages",
      "source-napoleon-height",
      "quote-joan",
    ],
    accent: "critical",
  },
  {
    id: "empires",
    name: "Empires",
    tagline: "Capitals of power",
    description: "Rome, Vienna, Moscow, London, Carthage, Beijing, and Austerlitz.",
    challengeIds: [
      "place-rome-colosseum",
      "constantinople-fall",
      "place-vienna-congress",
      "place-moscow-1812",
      "place-london-westminster",
      "place-carthage-site",
      "place-beijing-forbidden",
      "battle-austerlitz",
    ],
    accent: "empire",
  },
];

export function getPack(id: string): ContentPack | undefined {
  return contentPacks.find((p) => p.id === id);
}
