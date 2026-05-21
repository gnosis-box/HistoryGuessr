# Create the HIST Circles Group (operator guide)

History Guessr uses **group currency `HIST`**, not personal CRC, for quest rewards.

## Prerequisites

- Gnosis Chain wallet with CRC (for group registration & treasury)
- Node 22+
- `@aboutcircles/sdk` (already in project dependencies)
- Read: [Garage kickoff workshop PDF](https://garage.aboutcircles.com/circles-kickoff-workshop-may19.pdf)
- [SDK npm docs](https://www.npmjs.com/package/@aboutcircles/sdk)

## 1. Register the group (one-time)

Use a **script with contract runner** (private key or Safe owner) — not from the miniapp iframe.

```typescript
import { Sdk } from "@aboutcircles/sdk";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { gnosis } from "viem/chains";

const account = privateKeyToAccount(process.env.OPERATOR_PRIVATE_KEY as `0x${string}`);
const walletClient = createWalletClient({
  account,
  chain: gnosis,
  transport: http(),
});

const sdk = new Sdk(undefined, walletClient);

const group = await sdk.register.asGroup(
  account.address,           // owner
  account.address,           // service (can match owner for MVP)
  account.address,           // feeCollection
  [],                        // initialConditions
  "History Guessr",          // name (≤19 chars)
  "HIST",                    // symbol
  {
    name: "History Guessr",
    description: "Group currency for cultural quests, sources, and curation.",
  },
);

console.log("HIST group address:", group.address);
```

Save the printed address → `VITE_HIST_GROUP_ADDRESS` in Coolify.

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
