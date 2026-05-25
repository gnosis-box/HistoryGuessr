#!/usr/bin/env node
/**
 * Batch-pay HIST from operator wallet to players (Gnosis Chain).
 *
 * Usage:
 *   OPERATOR_PRIVATE_KEY=0x... HIST_GROUP=0x... npm run hist:distribute
 *   OPERATOR_PRIVATE_KEY=0x... npm run hist:distribute -- ./hist-ledger-export.json
 *
 * Export format (from Profile → Export HIST ledger):
 *   { "v": 1, "playerAddress": "0x...", "pending": 12.5, "entries": [...] }
 *
 * Or array of payouts:
 *   [{ "address": "0x...", "amount": 12.5 }]
 */
import { readFileSync, existsSync } from "node:fs";
import { Sdk } from "@aboutcircles/sdk";
import { createCirclesRunner, histToAtto } from "./circles-runner.mjs";

function loadGroupAddress() {
  if (process.env.HIST_GROUP?.startsWith("0x")) return process.env.HIST_GROUP;
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    const match = readFileSync(file, "utf8").match(
      /VITE_HIST_GROUP_ADDRESS=(0x[a-fA-F0-9]+)/,
    );
    if (match) return match[1];
  }
  return null;
}

function loadPayouts(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);

  if (Array.isArray(data)) {
    return data.map((row) => ({
      address: row.address ?? row.playerAddress,
      amount: Number(row.amount ?? row.pending),
    }));
  }

  if (data.playerAddress && data.pending > 0) {
    return [{ address: data.playerAddress, amount: Number(data.pending) }];
  }

  if (Array.isArray(data.payouts)) {
    return data.payouts.map((row) => ({
      address: row.address,
      amount: Number(row.amount),
    }));
  }

  throw new Error("Unrecognized ledger export format");
}

const group = loadGroupAddress();
if (!group) {
  console.error("Set HIST_GROUP=0x… or VITE_HIST_GROUP_ADDRESS in .env.local");
  process.exit(1);
}

const ledgerPath = process.argv[2] ?? "./hist-ledger-export.json";
if (!existsSync(ledgerPath)) {
  console.error(`Missing ${ledgerPath} — export from Profile in the app first.`);
  process.exit(1);
}

const payouts = loadPayouts(ledgerPath).filter(
  (p) => p.address?.startsWith("0x") && p.amount > 0,
);

if (payouts.length === 0) {
  console.log("No pending payouts in export file.");
  process.exit(0);
}

const { account, rpc, contractRunner } = createCirclesRunner();
console.log("Operator:", account.address);
console.log("RPC:", rpc);
console.log("HIST group:", group);
console.log(`Paying ${payouts.length} recipient(s)…\n`);

const sdk = new Sdk(undefined, contractRunner);
const operator = await sdk.getAvatar(account.address);

for (const row of payouts) {
  const amount = histToAtto(row.amount);
  console.log(`→ ${row.address} · ${row.amount} HIST`);
  try {
    const receipt = await operator.transfer.direct(
      row.address,
      amount,
      group,
    );
    console.log(`  ✅ tx ${receipt.transactionHash ?? receipt.hash ?? "ok"}`);
  } catch (err) {
    console.error(
      `  ❌ ${err instanceof Error ? err.message : err}`,
    );
  }
}

console.log("\nDone. Ask players to refresh Profile / claim in miniapp.");
