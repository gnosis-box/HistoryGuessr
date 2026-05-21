# Create the HIST Circles Group (operator guide)

History Guessr uses **group currency `HIST`**, not personal CRC, for quest rewards.

## Prerequisites

- Gnosis Chain wallet with CRC (for group registration & treasury)
- Node 22+
- `@aboutcircles/sdk` (already in project dependencies)
- Read: [Garage kickoff workshop PDF](https://garage.aboutcircles.com/circles-kickoff-workshop-may19.pdf)
- [SDK npm docs](https://www.npmjs.com/package/@aboutcircles/sdk)

## 1. Register the group (one-time)

From the repo (operator wallet on Gnosis, CRC for gas):

```bash
OPERATOR_PRIVATE_KEY=0xYOUR_KEY npm run hist:register-group
```

The script prints `VITE_HIST_GROUP_ADDRESS=0x…` — add it to **Vercel** and redeploy.

Optional for Garage demos without trust paths: `VITE_DEV_RELAX_TRUST=true`.

See `scripts/register-hist-group.mjs` (not runnable inside the miniapp iframe).

## 2. Configure the deployed app

```env
VITE_HIST_GROUP_ADDRESS=0xYourGroupAddress
```

Redeploy History Guessr on `history-guessr.thp.gnosis.box`.

## 3. Fund treasury

Deposit CRC (or collateral) into the group treasury so rewards can be distributed. Check balances via [RPC tools](https://aboutcircles.github.io/CirclesTools/rpcQueryView.html) or:

```typescript
const collateral = await sdk.groups.getCollateral(group.address);
```

## 4. Membership & vouching

- Add trusted builders as members (`sdk.groups` / group admin UI when available)
- App checks membership via `sdk.groups.getMembers` → full HIST claim eligibility
- Trust anchor: [Gnosis Group](https://docs.aboutcircles.com) `0xc19bc204eb1c1d5b3fe500e5e5dfabab625f286c`

## 5. Distribute HIST to players

Miniapp users **earn HIST in the app ledger** after each quest. On-chain transfer requires the **group operator** to batch-pay winners (weekly or on claim threshold).

Pattern:

```typescript
// From group owner runner — NOT from miniapp sendTransactions
await groupOwnerAvatar.transfer.direct(playerAddress, histAmount);
```

See `scripts/distribute-hist-rewards.mjs` (template).

## 6. Garage submission

- Live URL: `https://history-guessr.thp.gnosis.box/`
- Repo: `gnosis-box/history-guessr`
- Mention: 11 challenge modes, HIST group currency, trust API, Circles playground

https://garage.aboutcircles.com/register
