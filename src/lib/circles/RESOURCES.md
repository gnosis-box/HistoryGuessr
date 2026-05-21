# Circles resources for History Guessr

Curated links from Garage, workshops, and builder channels.

## Garage & submission

| Resource | URL |
|----------|-----|
| **Garage program** | https://garage.aboutcircles.com/ |
| **Sign up (GitHub)** | https://garage.aboutcircles.com/signup |
| **Submit mini-app** | https://garage.aboutcircles.com/register |
| **Leaderboard** | https://garage.aboutcircles.com/leaderboard |
| **Builder SKILL.md** | https://garage.aboutcircles.com/SKILL.md |
| **Kickoff workshop PDF (May 19)** | https://garage.aboutcircles.com/circles-kickoff-workshop-may19.pdf |
| **Workshop recording** | https://vimeo.com/1193867453 |
| **Builders Telegram** | https://t.me/about_circles/499 |

**Judging weights:** Circles primitives depth, non-crypto UX, referrals, weekly activity in Circles app.

## SDK & miniapps

| Resource | URL |
|----------|-----|
| **@aboutcircles/sdk (npm)** | https://www.npmjs.com/package/@aboutcircles/sdk |
| **SDK repo** | https://github.com/aboutcircles/sdk |
| **Miniapp developers** | https://miniapps.aboutcircles.com/developers |
| **Circles docs** | https://docs.aboutcircles.com/ |
| **Embedded boilerplate** | https://github.com/aboutcircles/embedded-miniapp-boilerplate |
| **CirclesMiniapps catalog** | https://github.com/aboutcircles/CirclesMiniapps |
| **Playground** | https://circles.gnosis.io/playground |

## RPC & analytics

| Resource | URL |
|----------|-----|
| **RPC Query Builder** | https://aboutcircles.github.io/CirclesTools/rpcQueryView.html |
| **Search profiles** | https://aboutcircles.github.io/CirclesTools/rpcQueryView.html?method=circles_searchProfiles |
| **Trust analytics API** | https://squid-app-3gxnl.ondigitalocean.app/aboutcircles-advanced-analytics2/docs#/Scoring |
| **Gnosis Group (trust anchor)** | `0xc19bc204eb1c1d5b3fe500e5e5dfabab625f286c` |

## Workshop / drive assets

| Resource | URL |
|----------|-----|
| **Google Drive asset** | https://drive.google.com/file/d/1MwWsxJKfkPk_ppn6SNeoBSS97mT7KnCL/view |

Download workshop PDF and drive files locally for offline reference.

## HIST group setup (on-chain)

See `scripts/setup-hist-group.md` and `.env.example`.

1. Register **Base Group** via `sdk.register.asGroup(...)` with symbol `HIST` (≤19 char name, short symbol).
2. Fund group **treasury** with CRC for reward distribution.
3. Set `VITE_HIST_GROUP_ADDRESS` in Coolify / `.env`.
4. Run periodic `scripts/distribute-hist-rewards.mjs` from group operator wallet (batch payouts).

**Note:** Miniapp `sendTransactions` signs from the **user’s Safe**, not the group treasury. In-game HIST is accrued in a ledger; on-chain payout is typically a **group operator batch** or future faucet contract.
