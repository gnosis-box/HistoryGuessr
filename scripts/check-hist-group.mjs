#!/usr/bin/env node
/**
 * Read-only HIST group health check (no private key).
 *
 * Usage:
 *   HIST_GROUP=0x... npm run hist:check
 *   # or VITE_HIST_GROUP_ADDRESS from .env.local
 */
import { readFileSync, existsSync } from "node:fs";
import { Sdk } from "@aboutcircles/sdk";

function loadGroupAddress() {
  if (process.env.HIST_GROUP?.startsWith("0x")) {
    return process.env.HIST_GROUP;
  }
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    const match = readFileSync(file, "utf8").match(
      /VITE_HIST_GROUP_ADDRESS=(0x[a-fA-F0-9]+)/,
    );
    if (match) return match[1];
  }
  return null;
}

const group = loadGroupAddress();
if (!group) {
  console.error(`
Set HIST_GROUP=0x… or VITE_HIST_GROUP_ADDRESS in .env.local

Example:
  HIST_GROUP=0xYourGroup npm run hist:check
`);
  process.exit(1);
}

console.log("Checking Circles group:", group);
console.log("RPC: Gnosis (default)\n");

const sdk = new Sdk();

try {
  const type = await sdk.groups.getType(group);
  console.log("Group type:", type ?? "unknown");

  const collateral = await sdk.groups.getCollateral(group);
  console.log("\nTreasury collateral:");
  if (collateral.length === 0) {
    console.log("  (empty — fund with CRC before paying rewards)");
  } else {
    for (const row of collateral) {
      console.log(
        `  ${row.isGroup ? "GROUP" : "CRC"} · ${row.crc ?? row.circles ?? "0"}`,
      );
    }
  }

  const members = await sdk.groups.getMembers(group, 20);
  console.log(`\nMembers (first page): ${members.results.length}`);
  for (const m of members.results.slice(0, 8)) {
    console.log(`  ${m.member}`);
  }
  if (members.results.length > 8) {
    console.log(`  … +${members.results.length - 8} more`);
  }

  console.log("\n✅ Group reachable on Circles RPC");
  console.log("\nNext:");
  console.log("  1. VITE_HIST_GROUP_ADDRESS=" + group);
  console.log("  2. npm run dev → Circles playground");
  console.log("  3. Trust this group address in the Circles app");
  console.log("  4. npm run hist:distribute (after ledger export)");
} catch (err) {
  console.error("❌ Check failed:", err instanceof Error ? err.message : err);
  process.exit(1);
}
