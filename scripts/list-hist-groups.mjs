#!/usr/bin/env node
/**
 * List Circles groups owned by your operator / Safe wallets.
 * Groups cannot be deleted on-chain — this script helps pick the keeper.
 *
 * Usage:
 *   node --env-file=.env.local scripts/list-hist-groups.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { Sdk } from "@aboutcircles/sdk";
import { createCirclesRunner } from "./circles-runner.mjs";

function loadEnvAddress(key) {
  if (process.env[key]?.startsWith("0x")) return process.env[key];
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    const match = readFileSync(file, "utf8").match(
      new RegExp(`${key}=(0x[a-fA-F0-9]+)`),
    );
    if (match) return match[1];
  }
  return null;
}

const keeper = loadEnvAddress("VITE_HIST_GROUP_ADDRESS");
const safe = loadEnvAddress("SAFE_ADDRESS");

let operator = process.env.OPERATOR_ADDRESS;
if (!operator?.startsWith("0x")) {
  try {
    const { account } = createCirclesRunner();
    operator = account.address;
  } catch {
    operator = null;
  }
}

const owners = [...new Set([operator, safe].filter(Boolean))];
if (owners.length === 0) {
  console.error(
    "Set OPERATOR_PRIVATE_KEY or SAFE_ADDRESS in .env.local to scan owners.",
  );
  process.exit(1);
}

const sdk = new Sdk();

console.log("Scanning Circles groups on Gnosis…\n");
console.log("Keeper (VITE_HIST_GROUP_ADDRESS):", keeper ?? "(not set)");
console.log("Owners scanned:", owners.join(", "));
console.log("");

async function fetchOwned() {
  const res = await sdk.rpc.group.findGroups(100, { ownerIn: owners }, null);
  return res.results ?? res ?? [];
}

async function fetchHistSymbol() {
  const res = await sdk.rpc.group.findGroups(100, { symbolStartsWith: "HIST" }, null);
  return res.results ?? res ?? [];
}

function formatRow(g) {
  const addr = g.group ?? g.address;
  const isKeeper =
    keeper && addr?.toLowerCase() === keeper.toLowerCase() ? " ✅ KEEP" : "";
  const owned = owners.some(
    (o) => o.toLowerCase() === (g.owner ?? "").toLowerCase(),
  )
    ? " yours"
    : "";
  return {
    addr,
    name: g.name ?? "?",
    symbol: g.symbol ?? "?",
    owner: g.owner ?? "?",
    members: g.memberCount ?? "?",
    tag: `${isKeeper}${owned}`,
  };
}

try {
  const [owned, histNamed] = await Promise.all([fetchOwned(), fetchHistSymbol()]);

  const byAddr = new Map();
  for (const g of [...owned, ...histNamed]) {
    const row = formatRow(g);
    if (row.addr) byAddr.set(row.addr.toLowerCase(), row);
  }

  const rows = [...byAddr.values()].sort((a, b) =>
    a.addr.localeCompare(b.addr),
  );

  if (rows.length === 0) {
    console.log("No groups found for these owners / HIST symbol.");
    process.exit(0);
  }

  console.log(`Found ${rows.length} group(s):\n`);
  for (const r of rows) {
    console.log(`${r.tag.trim() || "—"}  ${r.name} (${r.symbol})`);
    console.log(`     address: ${r.addr}`);
    console.log(`     owner:   ${r.owner}`);
    console.log(`     members: ${r.members}`);
    console.log("");
  }

  const duplicates = rows.filter(
    (r) => !r.tag.includes("KEEP") && r.tag.includes("yours"),
  );
  if (duplicates.length > 0) {
    console.log("—".repeat(60));
    console.log(
      "⚠️  On-chain groups cannot be deleted in Circles.",
    );
    console.log(
      "   Keep ONE address in VITE_HIST_GROUP_ADDRESS (marked KEEP).",
    );
    console.log("   For the others: stop trusting them / do not use them.");
    console.log("   In the Circles app: ignore them in your group list.");
  }

  if (!keeper) {
    console.log("\nSuggestion: pick the right group and add:");
    console.log("  VITE_HIST_GROUP_ADDRESS=0x…");
  }
} catch (err) {
  console.error("Scan failed:", err instanceof Error ? err.message : err);
  process.exit(1);
}
