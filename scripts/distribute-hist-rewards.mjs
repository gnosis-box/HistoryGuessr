#!/usr/bin/env node
/**
 * Template: batch-distribute pending HIST from operator wallet.
 * Run locally with OPERATOR_PRIVATE_KEY + VITE_HIST_GROUP_ADDRESS — never commit keys.
 *
 * Usage:
 *   OPERATOR_PRIVATE_KEY=0x... HIST_GROUP=0x... node scripts/distribute-hist-rewards.mjs
 */
import { readFileSync } from "node:fs";

console.log(`
History Guessr — HIST distribution (manual step)

1. Export pending rewards from app ledger (or maintain a server-side DB).
2. Use @aboutcircles/sdk with a wallet client on Gnosis.
3. For each winner: groupOwner.transfer.direct(player, amount)

This repo stores pending HIST in browser localStorage per device.
For production, move the ledger to your backend and run this script weekly.

Resources:
- https://www.npmjs.com/package/@aboutcircles/sdk
- https://garage.aboutcircles.com/
- scripts/setup-hist-group.md
`);

if (process.env.HIST_GROUP) {
  console.log("Target group:", process.env.HIST_GROUP);
}

try {
  const ledger = readFileSync("./hist-ledger-export.json", "utf8");
  const entries = JSON.parse(ledger);
  console.log(`Loaded ${entries.length} payout rows from hist-ledger-export.json`);
} catch {
  console.log("No hist-ledger-export.json — create from app analytics or backend.");
}
