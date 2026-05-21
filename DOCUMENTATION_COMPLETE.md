# History Guessr — Documentation complète

**Version du dépôt :** MVP jouable · 24 défis · 11 modes · intégration Circles  
**Tagline :** *Guess where history happened.*

Ce document résume l’architecture du code, les mécaniques de jeu, le scoring, l’intégration Circles/Gnosis, la réputation, et **l’intégralité du contenu des énigmes** tel qu’il est codé dans `src/data/catalog.ts`.

---

## 1. Vision produit

History Guessr est un **GeoGuessr culturel** : le joueur lit un indice historique et répond par un lieu, une date, un ordre chronologique, une figure, une citation, une image, un parcours sur carte, ou en détectant une affirmation trompeuse.

| Pilier | Rôle |
|--------|------|
| **Jeu** | 11 types de défis modulaires, catalogue statique, pas de backend |
| **Circles** | Wallet miniapp, profil CRC, trust graph, monnaie de groupe **HIST** |
| **Réputation** | Badges et titres honorifiques (non achetables), séparés de HIST |

> *Circles provides the social trust. History Guessr provides the game.*

---

## 2. Stack technique

| Couche | Technologie |
|--------|-------------|
| UI | React 19, TypeScript, Vite 8 |
| Styles | Tailwind CSS v4, thème sombre / or |
| Carte | MapLibre GL JS |
| Circles | `@aboutcircles/miniapp-sdk`, `@aboutcircles/sdk` |
| Données | Fichiers TS statiques (`catalog.ts`, `challengeModes.ts`) |
| Persistance client | `localStorage` (réputation, ledger HIST, vouching) |

**Scripts :** `npm run dev` · `npm run build` · `npm run preview` · Docker + nginx pour Coolify (`history-guessr.thp.gnosis.box`).

**CSP iframe :** `vite.config.ts` autorise l’embedding depuis `circles.gnosis.io` et domaines Gnosis.

---

## 3. Architecture du code

```
src/
├── main.tsx                 # CirclesProvider → ReputationProvider → App
├── App.tsx                  # Navigation : home | city_pick | play
├── types/game.ts            # Types des 11 modes + interfaces de défi
├── data/
│   ├── catalog.ts           # 24 défis (source de vérité du contenu)
│   └── challengeModes.ts    # Métadonnées des 11 modes (cartes accueil)
├── components/
│   ├── HomeScreen.tsx
│   ├── ChallengeSession.tsx # Routeur de gameplay par type
│   ├── ChallengeCard.tsx
│   ├── ResultPanel.tsx      # Score + HIST + réputation + partage
│   ├── GameMap.tsx
│   ├── Header.tsx / CirclesWalletBadge.tsx
│   └── play/                # DateGuess, Timeline, WhoIsIt, Mcq, SourceDetective, CityPicker
├── hooks/
│   ├── use-circles.ts
│   └── use-reputation.ts
├── utils/
│   ├── distance.ts          # Haversine + score géographique
│   ├── scoring.ts           # Scores par mode
│   └── share.ts             # Copie résultat presse-papiers
└── lib/
    ├── circles/             # Wallet, profil, trust, HIST, vouching, payout
    └── reputation/          # Badges, titres, engine localStorage
```

### 3.1 Flux applicatif

1. **Accueil** — choix d’un mode ou « Random challenge ».
2. **City History** — écran intermédiaire `CityPicker` (Avignon, Paris, Istanbul, Philadelphia).
3. **Jeu** — `ChallengeSession` affiche la carte indice + UI du mode.
4. **Résultat** — score /1000, explication, `RewardPanel` (HIST), `ReputationPanel`, bouton partage, « Next challenge » (même mode, autre défi aléatoire).

Le compteur de manche (`roundInSession`) s’incrémente à chaque « Next » ; le pool affiché est la taille du mode courant.

### 3.2 Routage des modes (`ChallengeSession`)

| Type | Composant / mécanique |
|------|------------------------|
| `place_guess`, `city_history`, `friend_challenge` | `GameMap` — clic unique, validation distance |
| `date_guess` | `DateGuessPlay` — slider d’année |
| `timeline_order` | `TimelineOrderPlay` — réordonnancement ↑↓ |
| `who_is_it` | `WhoIsItPlay` — indices progressifs + texte |
| `quote_guess`, `battle_guess`, `image_guess` | `McqPlay` — QCM |
| `map_path` | `GameMap` multi-points (N clics ordonnés) |
| `source_detective` | `SourceDetectivePlay` — choix d’affirmation |

---

## 4. Les 11 modes de jeu

| # | Type | Nom affiché | Principe | Score |
|---|------|-------------|----------|-------|
| 1 | `place_guess` | Place Guess | Indice → clic carte | Distance Haversine (0–1000) |
| 2 | `date_guess` | Date Guess | Indice → année (slider) | Écart en années (exponentiel + paliers) |
| 3 | `timeline_order` | Timeline Order | Réordonner des événements | % positions correctes × 1000 |
| 4 | `who_is_it` | Who Is It? | Indices → nom de figure | 1000 / 700 / 400 / 250 selon nb d’indices |
| 5 | `quote_guess` | Quote Guess | Citation → auteur (QCM) | 1000 ou 0 |
| 6 | `map_path` | Map Path | N points sur un itinéraire | Moyenne des scores distance par étape |
| 7 | `image_guess` | Image Guess | Image + QCM événement | 1000 ou 0 |
| 8 | `battle_guess` | Battle Guess | Indice bataille → QCM | 1000 ou 0 |
| 9 | `city_history` | City History | Ville → carte locale (comme place guess) | Idem place guess |
| 10 | `source_detective` | Source Detective | Repérer affirmation trompeuse / légendaire | 1000 ou 0 |
| 11 | `friend_challenge` | Friend Challenge | Même carte qu’un ami + score à battre | Idem place guess + comparaison |

**Villes disponibles (City History) :** Avignon, Paris, Istanbul, Philadelphia.

---

## 5. Système de notation

### 5.1 Score géographique (`distance.ts`)

- Formule : `1000 × exp(-distance_km / 1200)`, plafonné à 0 si > 5000 km.
- Paliers bonus : < 1 km → 1000 ; < 10 km → ≥ 950 ; < 50 km → ≥ 850 ; < 100 km → ≥ 750.

### 5.2 Date Guess

- 0 si écart > 500 ans.
- Sinon exponentiel ; bonus si écart ≤ 5 / 25 / 75 ans.

### 5.3 Timeline Order

- `score = round(1000 × correct_positions / total_events)`.

### 5.4 Who Is It?

- Réponse acceptée si normalisation (minuscules, sans accents) correspond à une entrée de `acceptedAnswers`.
- Tiers : 1er indice → 1000, 2e → 700, 3e → 400, 4e+ → 250 ; échec → 0.

### 5.5 QCM (quote, battle, image, source)

- Bonne réponse → 1000 ; sinon 0.

### 5.6 Map Path

- Score moyen des N segments (chaque segment = score Haversine vers le waypoint attendu).

---

## 6. Catalogue des défis (24)

Répartition : **Place Guess 5** · **Date 3** · **Timeline 2** · **Who 2** · **Quote 2** · **Map Path 1** · **Image 2** · **Battle 2** · **City 2** · **Source 2** · **Friend 1**.

---

### 6.1 Place Guess (5)

#### `avignon-papacy` — The Avignon Papacy (medium)
- **Indice :** *In 1309, the seat of Western Christianity moved here, reshaping the religious and political map of Europe.*
- **Période :** 14th century
- **Réponse :** Avignon, France (43.9493, 4.8055) · année 1309
- **Explication :** Pope Clement V settled in Avignon in 1309…
- **Tags :** Religion, France, Medieval, Avignon

#### `napoleon-coronation` — Napoleon's Coronation (easy)
- **Indice :** *In 1804, a French general crowned himself emperor in this cathedral.*
- **Réponse :** Notre-Dame de Paris, France (48.853, 2.3499)
- **Explication :** Napoleon crowned himself at Notre-Dame on 2 December 1804.
- **Tags :** France, Paris, Empire

#### `constantinople-fall` — Fall of Constantinople (medium)
- **Indice :** *In 1453, an ancient imperial capital fell…*
- **Réponse :** Istanbul, Turkey (41.0082, 28.9784)
- **Explication :** Constantinople fell to the Ottomans on 29 May 1453.
- **Tags :** Byzantium, Ottoman, Istanbul

#### `declaration-independence-place` — Declaration of Independence (easy)
- **Indice :** *In 1776, representatives gathered here to declare a new nation independent.*
- **Réponse :** Philadelphia, USA (39.9489, -75.15)
- **Tags :** USA, Revolution, Philadelphia

#### `waterloo-battle-place` — A Famous Battlefield (medium)
- **Indice :** *In 1815, a decisive battle near this Belgian town ended a French emperor's comeback.*
- **Réponse :** Waterloo, Belgium (50.7147, 4.3991)
- **Tags :** Napoleon, Belgium

---

### 6.2 Date Guess (3)

#### `date-constantinople` (medium)
- **Indice :** *The city of Constantinople fell to the Ottoman Empire.*
- **Réponse :** **1453** (slider 1200–1800)

#### `date-magna-carta` (medium)
- **Indice :** *King John of England sealed limits to royal power at Runnymede.*
- **Réponse :** **1215** (slider 1000–1600)

#### `date-french-revolution` (easy)
- **Indice :** *Parisians stormed a royal fortress, a symbol of the old regime.*
- **Réponse :** **1789** (slider 1600–1900)

---

### 6.3 Timeline Order (2)

#### `timeline-early-modern` (medium)
- **Consigne :** *Arrange these events from earliest to latest.*
- **Événements :**
  1. Fall of Constantinople — **1453**
  2. Columbus reaches the Americas — **1492**
  3. Luther's 95 Theses — **1517**
  4. French Revolution begins — **1789**
- **Ordre correct :** a → b → c → d

#### `timeline-ww2-pacific` (hard)
- **Consigne :** *Order these Pacific-war milestones chronologically.*
- **Événements :**
  1. Attack on Pearl Harbor — **1941**
  2. Battle of Midway — **1942**
  3. Atomic bombing of Hiroshima — **1945**

---

### 6.4 Who Is It? (2)

#### `who-napoleon` (easy)
- **Indice général :** *Guess the historical figure from progressive clues.*
- **Indices :**
  1. *I was born on an island in the Mediterranean.*
  2. *I became emperor of France.*
  3. *I was defeated in 1815 at Waterloo.*
- **Réponse :** Napoleon Bonaparte  
- **Réponses acceptées :** `napoleon`, `napoleon bonaparte`, `bonaparte`

#### `who-joan` (medium)
- **Indice général :** *A figure from the Hundred Years' War.*
- **Indices :**
  1. *I heard voices urging me to save France.*
  2. *I lifted the siege of Orléans.*
  3. *I was tried and burned in Rouen in 1431.*
- **Réponse :** Joan of Arc  
- **Réponses acceptées :** `joan of arc`, `jeanne d arc`, `jeanne d'arc`, `joan`

---

### 6.5 Quote Guess (2)

#### `quote-joan` (medium) — confiance source : **attributed**
- **Citation :** *"I am not afraid… I was born to do this."*
- **Question :** Who is this quotation most closely associated with?
- **Options :** Joan of Arc ✓ · Catherine the Great · Queen Elizabeth I · Hildegard of Bingen
- **Explication :** Often attributed to Joan of Arc; exact wording is debated.

#### `quote-lincoln` (easy) — confiance source : **verified**
- **Citation :** *"Government of the people, by the people, for the people, shall not perish from the earth."*
- **Options :** Jefferson · **Abraham Lincoln** ✓ · Churchill · FDR
- **Explication :** Gettysburg Address, 19 November 1863.

---

### 6.6 Map Path (1)

#### `path-napoleon-hundred-days` (expert)
- **Indice :** *Place 3 points on the map tracing Napoleon's return from Elba toward Paris (simplified route).*
- **Waypoints attendus :**
  1. Elba (departure) — 42.8, 10.3
  2. Lyon region — 45.75, 4.85
  3. Paris — 48.8566, 2.3522
- **Explication :** Escape Elba 1815 → march through France → Paris before Waterloo.

---

### 6.7 Image Guess (2)

#### `image-tennis-court` (medium)
- **Image :** Serment du Jeu de Paume (Wikimedia)
- **Question :** What event does this painting depict?
- **Options :** **Tennis Court Oath, 1789** ✓ · Coronation of Napoleon · Storming of the Bastille · Congress of Vienna
- **Explication :** David's depiction of 20 June 1789 at Versailles.

#### `image-moon-landing` (easy)
- **Image :** Buzz Aldrin on the Moon (Apollo 11)
- **Options :** **Apollo 11 Moon landing, 1969** ✓ · Sputnik 1957 · ISS 1998 · Hubble 1990

---

### 6.8 Battle Guess (2)

#### `battle-waterloo` (easy)
- **Indice :** *A decisive battle in 1815 ended the ambitions of a French emperor.*
- **Options :** Austerlitz · **Waterloo** ✓ · Leipzig · Borodino
- **Coordonnées :** Waterloo (50.7147, 4.3991)

#### `battle-hastings` (medium)
- **Indice :** *In 1066, William the Conqueror defeated Harold II in this English battle.*
- **Options :** **Hastings** ✓ · Agincourt · Bosworth · Culloden
- **Coordonnées :** Hastings (50.9147, 0.4869)

---

### 6.9 City History (2)

#### `city-avignon-palais` — Palais des Papes (medium)
- **Ville :** Avignon
- **Indice :** *In Avignon, this fortress-palace became the seat of popes in the 14th century.*
- **Réponse :** Palais des Papes, Avignon (43.9509, 4.8075)

#### `city-paris-bastille` — Place de la Bastille (easy)
- **Ville :** Paris
- **Indice :** *In Paris, revolutionaries stormed a fortress prison here in July 1789.*
- **Réponse :** Bastille, Paris (48.8532, 2.3692)

*Note :* Istanbul et Philadelphia n’ont pas encore de défi `city_history` dédié ; le picker peut retomber sur un `place_guess` tagué avec la ville.

---

### 6.10 Source Detective (2)

#### `source-napoleon` (medium)
- **Consigne :** *Which statement is the most misleading?*
- **Affirmations :**
  - a) *Napoleon was unusually short for his time.* → **misleading** ✓
  - b) *Napoleon was crowned emperor in Notre-Dame.* → correct
  - c) *Napoleon was born in Corsica.* → correct
- **Explication :** Height myth from propaganda and inch units confusion.

#### `source-vikings` (easy)
- **Consigne :** *Which claim is more legend than established fact?*
- **Affirmations :**
  - a) Vikings reached North America before Columbus → correct
  - b) Vikings routinely wore horned helmets in battle → **legend** ✓
  - c) Viking ships could navigate open seas → correct

---

### 6.11 Friend Challenge (1)

#### `friend-avignon` (medium)
- **Titre :** Beat your friend — Avignon
- **Indice :** *Your friend scored 842 on this clue. Can you place the Avignon papacy more accurately?*
- **Adversaire mock :** Guest Historian — **842/1000**
- **Réponse :** Avignon, France (même coords que `avignon-papacy`)
- **Explication :** Compare scores with your circle.

---

## 7. Intégration Circles

### 7.1 Connexion wallet

- `host.ts` → `onWalletChange` du **miniapp SDK**.
- Hors iframe Circles → **Guest mode** (pas d’adresse).
- Dans le **playground** (`https://circles.gnosis.io/playground?url=…`) → adresse Safe, CRC, boutons Refresh / Sign in.

### 7.2 Profil

- `profile.ts` → `Sdk().rpc.sdk.getProfileView(address)` : nom, avatar, solde CRC, stats de confiance.

### 7.3 Monnaie HIST (groupe)

| Paramètre | Valeur |
|-----------|--------|
| Symbole | HIST |
| Seuil de score | ≥ 400 / 1000 |
| Plafond journalier | 30 HIST |
| Multiplicateurs difficulté | easy 1× · medium 1.15× · hard 1.35× · expert 1.6× |
| Formule | `(score/100) × multiplicateur`, arrondi 0.1 |

**Trust gate :** API analytics vs **Gnosis Group** `0xc19bc204eb1c1d5b3fe500e5e5dfabab625f286c` ; modes stricts (`source_detective`, `map_path`) exigent un trust score ≥ 0.15 ou appartenance au groupe HIST (`VITE_HIST_GROUP_ADDRESS`).

**Ledger :** `localStorage` clés `history-guessr-hist-ledger` et `history-guessr-hist-daily`. Payout on-chain prévu via script opérateur (`scripts/distribute-hist-rewards.mjs`) — pas encore tirage direct depuis le wallet utilisateur.

### 7.4 Vouching (prévu)

- Statuts : `none` | `pending` | `member` — local + futur on-chain peer validation.

---

## 8. Réputation (honorifiques)

Séparée de HIST · stockée dans `history-guessr-reputation`.

### 8.1 Badges (14)

| ID | Titre | Tier | Condition |
|----|-------|------|-----------|
| archivist | Archivist | gold | score ≥ 940, ≥ 8 manches |
| cartographer | Cartographer | gold | ≥ 900, modes carte, ≥ 5 manches |
| source-hunter | Source Hunter | legendary | ≥ 970, source/quote, ≥ 6 manches |
| debater | Debater | silver | ≥ 880, source/quote/who, ≥ 4 manches |
| curator | Curator | gold | ≥ 920, ≥ 12 manches |
| confirmed-historian | Confirmed Historian | legendary | ≥ 990, ≥ 10 manches |
| human-chronometer | Human Chronometer | gold | ≥ 900, date/timeline, ≥ 5 manches |
| shadow-seer | Shadow Seer | legendary | ≥ 950, who_is_it, ≥ 4 manches |
| courteous-duelist | Courteous Duelist | gold | ≥ 920, friend_challenge, ≥ 3 manches |
| curators-eye | Curator's Eye | gold | ≥ 900, image_guess, ≥ 4 manches |
| field-strategist | Field Strategist | silver | ≥ 900, battle_guess, ≥ 4 manches |
| path-conqueror | Path Conqueror | legendary | ≥ 920, map_path, ≥ 5 manches |

**Règle** : au plus **un** badge honorifique par manche (le plus exigeant parmi ceux éligibles).

### 8.2 Titres de prestige (4)

| ID | Titre | Déblocage (prestige cumulé) |
|----|-------|----------------------------|
| title-novice | Curious of the Past | défaut |
| title-scholar | Scholar in the Making | prestige ≥ 12 |
| title-master | Master of Memory | ≥ 30 |
| title-legend | Keeper of Centuries | ≥ 55 |

### 8.3 Headlines de manche (exemples)

| Score | Headline |
|-------|----------|
| ≥ 950 | Imperial Memory |
| ≥ 900 | Legendary Precision |
| ≥ 800 | Radiant Scholar |
| ≥ 700 | Elite Recall |
| ≥ 500 | Sharp Historical Instinct |
| ≥ 400 | Almost on the Map |
| ≥ 200 | Flâneur of the Past |
| < 200 | Lost in Time |

---

## 9. UI et écrans

| Écran | Contenu |
|-------|---------|
| **Home** | Hero, How it works, Hall of reputation (12 badges), grille 11 modes, panneau Circles futur, liens Garage |
| **City pick** | Sélection ville → défi city_history |
| **Play** | Carte indice + zone de jeu + sidebar `FutureCirclesPanel` (desktop) |
| **Result** | Score, explication, partage clipboard, HIST, réputation, Next challenge |

**Header :** titre honorifique courant, badge Circles connected / Guest, lien Playground.

---

## 10. Déploiement et tests

| Cible | URL / commande |
|-------|----------------|
| Production prévue | `https://history-guessr.thp.gnosis.box/` |
| Playground Circles | `https://circles.gnosis.io/playground?url=<https-url>/` |
| Repo | `gnosis-box/history-guessr` |
| Doc deploy | `DEPLOY.md` |

**Test Circles complet :** build + HTTPS + playground. En local seul : guest mode uniquement ; SDK profil testable en CLI (`getProfileView`).

---

## 11. Évolutions prévues (non implémentées)

- Groupe HIST on-chain + distribution batch opérateur
- Friend Challenge réel via trust graph Circles (au lieu de `Guest Historian`)
- Packs de villes communautaires (Groups locaux)
- Vouching pair-à-pair pour valider sources
- Plus de défis dans `catalog.ts` (cible ~25+ mentionnée en README)

---

## 12. Fichiers de référence rapide

| Besoin | Fichier |
|--------|---------|
| Ajouter un défi | `src/data/catalog.ts` |
| Texte mode accueil | `src/data/challengeModes.ts` |
| Logique score | `src/utils/scoring.ts`, `distance.ts` |
| Règles HIST | `src/lib/circles/config.ts`, `rewards.ts` |
| Badges | `src/lib/reputation/badges.ts` |
| Circles README | `src/lib/circles/README.md`, `REWARDS.md`, `RESOURCES.md` |

---

*Document généré pour le dépôt OpenCircles / History Guessr. Contenu des énigmes aligné sur `src/data/catalog.ts` au moment de la rédaction.*
