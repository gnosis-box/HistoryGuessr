# History Guessr

**Guess where history happened.**

> History Guessr is a social historical guessing game. Players explore the past through places, dates, figures, quotes, images, sources and journeys.

The first playable mode is **Place Guess**: read a clue, click the map, score by distance.

The larger vision is a **modular platform for historical challenges** — locate events, order timelines, identify figures, reconstruct routes, detect false claims, or challenge someone from your trust graph.
  
> **Circles provides the social trust.**  
> **History Guessr provides the game.**

Built for [Circles](https://aboutcircles.com) miniapps and [circles/garage](https://garage.aboutcircles.com/).

## Challenge types (all playable)

| Mode | Gameplay |
| ---- | -------- |
| **Place Guess** | Map click + distance score |
| **Date Guess** | Year slider |
| **Timeline Order** | Reorder events (↑↓) |
| **Who Is It?** | Progressive clues + text answer |
| **Quote Guess** | Multiple choice + source confidence |
| **Battle Guess** | Multiple choice |
| **Map Path** | Place N points on map in order |
| **Image Guess** | Image + multiple choice |
| **Source Detective** | Pick misleading / legendary claim |
| **City History** | Pick city → local map quest |
| **Friend Challenge** | Beat a mock friend’s map score |

Catalog: `src/data/catalog.ts` (~25 challenges). Each mode card on the home page has **Play**.

**Circles SDK:** wallet injection + profile (name, CRC, trust) via `@aboutcircles/miniapp-sdk` and `@aboutcircles/sdk`. Guest mode when opened outside the host.

### Test in Circles playground

1. `npm run build && npm run preview` (or deploy to HTTPS)
2. Open [Circles playground](https://circles.gnosis.io/playground?url=<your-https-url>)
3. Header shows your Safe address, CRC balance, and trust count when connected

### Deploy on Vercel (recommended)

See **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** — import the GitHub repo, deploy, then open the Circles playground with your `*.vercel.app` URL.

### Deploy on gnosis.box (Coolify)

See **[DEPLOY.md](./DEPLOY.md)** — alternative for `*.thp.gnosis.box`.

See `src/lib/circles/README.md` for listing in CirclesMiniapps and Garage registration.

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 · MapLibre GL JS
- No backend

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 → **Play Place Guess**

## Project structure

```
src/
  types/game.ts           # ChallengeType, HistoricalChallenge, …
  data/
    challenges.ts         # Playable place_guess challenges
    challengeModes.ts     # All 11 modes (catalog / pitch)
  components/
    ChallengeModesSection.tsx
    HowItWorksSection.tsx
    GameMap.tsx             # Place Guess only (MVP)
  lib/circles/            # Future SDK integration
```

## Circles

- [Documentation](https://docs.aboutcircles.com/)
- [Embedded miniapp boilerplate](https://github.com/aboutcircles/embedded-miniapp-boilerplate)
- [Garage program](https://garage.aboutcircles.com/)

## License

MIT
