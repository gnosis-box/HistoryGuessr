#!/usr/bin/env node
/**
 * Register the History Guessr HIST Circles group on Gnosis Chain.
 *
 * Usage (never commit the private key):
 *   OPERATOR_PRIVATE_KEY=0x... npm run hist:register-group
 *
 * Optional:
 *   GNOSIS_RPC_URL=https://rpc.gnosischain.com
 */
import { Sdk } from "@aboutcircles/sdk";
import { createCirclesRunner } from "./circles-runner.mjs";

const { account, rpc, contractRunner } = createCirclesRunner();

console.log("Operator:", account.address);
console.log("RPC:", rpc);
console.log("Registering group History Guessr (HIST)…\n");

const sdk = new Sdk(undefined, contractRunner);

const groupAvatar = await sdk.register.asGroup(
  account.address,
  account.address,
  account.address,
  [],
  "History Guessr",
  "HIST",
  {
    name: "History Guessr",
    description:
      "Group currency for cultural quests, sources, and curation on History Guessr.",
  },
);

const groupAddress = groupAvatar.address;

console.log("✅ HIST group deployed\n");
console.log("Group address:", groupAddress);
console.log("\nAdd to Vercel → Environment Variables → Redeploy:\n");
console.log(`VITE_HIST_GROUP_ADDRESS=${groupAddress}`);
console.log("\nOptional for Garage demos (remove in production):");
console.log("VITE_DEV_RELAX_TRUST=true");
console.log("\nFund the group treasury with CRC, then add members via Circles / SDK.");
