# Handoff summary — History Guessr (OpenCircles)

## Project

**History Guessr** — cultural GeoGuessr-style miniapp for [Circles](https://aboutcircles.com) / [Garage](https://garage.aboutcircles.com/). Repo path: `/root/OpenCircles`. Stack: React 19, TypeScript, Vite 8, Tailwind v4, MapLibre GL, `@aboutcircles/miniapp-sdk`, `@aboutcircles/sdk`.

**Tagline:** Guess where history happened.

---

## User goals (cumulative)

1. Playable MVP with map-based place guessing, score, share, elegant dark/gold UI.
2. **Platform vision:** 11 modular challenge types (not only place guess).
3. **Circles integration:** wallet via miniapp host, profile (CRC, trust), Garage-ready deploy.
4. **HIST group currency** (not personal CRC for rewards) — Sandipan/builder advice; trust-gated, vouching, anti-spam.
5. Deploy on **gnosis.box** via Coolify (`history-guessr.thp.gnosis.box`), GitHub org **gnosis-box**.
6. **Honorific reputation** separate from HIST: badges (Archiviste, Cartographe, Source Hunter, etc.) — gamified, flattering, not purchasable.

---

## What was built

### Core game
- `src/data/catalog.ts` — ~25 challenges across 11 types
- `src/components/ChallengeSession.tsx` — routes UI per `challenge.type`
- `src/components/play/*` — DateGuess, Timeline, WhoIsIt, Mcq, SourceDetective, CityPicker, GameMap (multi-point for map_path)
- `src/App.tsx` — `roundInSession` counter (fixed bug: was hardcoded `challengeIndex={0}`)
- `src/utils/distance.ts`, `src/utils/scoring.ts`, `src/utils/share.ts`

### Circles / HIST (money layer)
- `src/lib/circles/CirclesProvider.tsx` — `onWalletChange`, `getProfileView`, trust API, HIST ledger
- `src/lib/circles/rewards.ts` — `calculateHistReward`, daily cap 30, min score 400
- `src/lib/circles/trust.ts` — relative trust vs Gnosis Group `0xc19bc204eb1c1d5b3fe500e5e5dfabab625f286c`
- `src/lib/circles/vouching.ts`, `groups.ts` (membership), `profiles.ts` (search)
- `src/components/RewardPanel.tsx`, `CirclesWalletBadge.tsx`
- `src/lib/circles/config.ts` — `VITE_HIST_GROUP_ADDRESS` optional

### Deploy
- `Dockerfile`, `nginx.conf` (CSP `frame-ancestors` for `*.gnosis.io`)
- `DEPLOY.md`, `scripts/setup-hist-group.md`, `deploy/coolify-deploy-key.pub` (gitignored)
- `src/components/BuilderResourcesPanel.tsx`

### Reputation (started, may need wiring)
- `src/lib/reputation/badges.ts` — honorific badges + prestige titles
- `src/lib/reputation/engine.ts` — `getRoundHonorific`, `recordRoundReputation`, localStorage
- `src/lib/reputation/ReputationProvider.tsx`
- `src/components/ReputationPanel.tsx`, updated `ScoreBadge.tsx` with honorific headlines

**Likely incomplete:** `ReputationProvider` not yet wrapped in `main.tsx`; `ResultPanel` may not call `recordRound` / show `ReputationPanel` yet. Run `npm run build` and finish integration.

---

## Bugs fixed

1. **MapLibre `getLayer` crash** on challenge change/unmount — safe `removeResultOverlay`, refs, don’t call map methods after `map.remove()`.
2. **Challenge X/Y stuck at 1** — `roundInSession` increments on next challenge in `App.tsx`.

---

## Key architecture

| Layer | Responsibility |
|-------|----------------|
| **Reputation** | Badges, honorific titles, prestige — localStorage, not buyable |
| **HIST** | Group currency rewards — ledger + future on-chain via group operator |
| **CRC** | Personal Circles money — profile display only |
| **Circles host** | Wallet inject, `signMessage`, future `sendTransactions` |

**Payout note:** Miniapp `sendTransactions` signs from **user Safe**, not group treasury. On-chain HIST = operator batch (`scripts/distribute-hist-rewards.mjs`).

---

## Git / deploy state

- Remote likely `gnosis-box/history-guessr` (user pushing from local)
- Last commit message style: `HistoryGuessr - 11 playable modes + Circles SDK`
- Suggested next commit: `Add HIST group rewards, trust gates, and Garage builder resources`
- Uncommitted work: HIST layer, reputation files, DEPLOY updates, `deploy/` gitignored

## Coolify guidance given

- User on **shared Coolify** via Zet invite — usually **no new Server**; create **Application** on existing server
- Deploy key: add public key to GitHub **Deploy keys** (not in repo)
- Domain: `history-guessr.thp.gnosis.box`
- Playground: `https://circles.gnosis.io/playground?url=https://history-guessr.thp.gnosis.box/`

---

## Resources (for user)

- https://garage.aboutcircles.com/ · https://garage.aboutcircles.com/register
- https://garage.aboutcircles.com/circles-kickoff-workshop-may19.pdf
- https://www.npmjs.com/package/@aboutcircles/sdk
- https://aboutcircles.github.io/CirclesTools/rpcQueryView.html?method=circles_searchProfiles
- Trust analytics API (documented in `src/lib/circles/RESOURCES.md`)

---

## Remaining work (priority)

1. **Finish reputation integration** — wrap `ReputationProvider` in `main.tsx`, hook `ResultPanel` after each round, optional badge gallery on home.
2. **Verify build** — `npm run build`
3. **Create HIST group on-chain** — `scripts/setup-hist-group.md`, set `VITE_HIST_GROUP_ADDRESS`
4. **Garage submit** — live URL + repo
5. Optional: friend search via `searchCirclesProfiles`, PR to CirclesMiniapps `miniapps.json`
