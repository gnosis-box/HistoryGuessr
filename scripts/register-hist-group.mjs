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
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { gnosis } from "viem/chains";

const pk = process.env.OPERATOR_PRIVATE_KEY;
if (!pk?.startsWith("0x")) {
  console.error(`
Missing OPERATOR_PRIVATE_KEY (0x… hex).

Example:
  OPERATOR_PRIVATE_KEY=0xYOUR_KEY npm run hist:register-group

Requirements:
  - Wallet on Gnosis Chain with CRC for gas
  - Operator should already be registered in Circles (human/org avatar)
`);
  process.exit(1);
}

const rpc = process.env.GNOSIS_RPC_URL ?? "https://rpc.gnosischain.com";
const account = privateKeyToAccount(pk);

const publicClient = createPublicClient({
  chain: gnosis,
  transport: http(rpc),
});

const walletClient = createWalletClient({
  account,
  chain: gnosis,
  transport: http(rpc),
});

/** Minimal ContractRunner for @aboutcircles/sdk register.asGroup */
const contractRunner = {
  address: account.address,
  publicClient,
  async init() {},
  async sendTransaction(txs) {
    let receipt;
    for (const tx of txs) {
      const hash = await walletClient.sendTransaction({
        account,
        chain: gnosis,
        to: tx.to,
        data: tx.data,
        value: tx.value ?? 0n,
      });
      receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") {
        throw new Error(`Transaction reverted: ${hash}`);
      }
    }
    return receipt;
  },
};

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
