#!/usr/bin/env node
/**
 * Register HIST using a Gnosis Safe (Circles avatar) + signer private key.
 *
 * Your Circles address 0xD55a… is a Safe — use THIS script, not hist:register-group.
 *
 * Usage:
 *   SAFE_ADDRESS=0xD55a912aF5639a6769AE5c1894C0c7BFB5Bf539E \
 *   SIGNER_PRIVATE_KEY=0x... \
 *   npm run hist:register-group-safe
 */
import { readFileSync, existsSync } from "node:fs";
import { Sdk } from "@aboutcircles/sdk";
import { SafeContractRunner } from "@aboutcircles/sdk-runner";
import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { gnosis } from "viem/chains";

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const PRIVATE_KEY_RE = /^0x[a-fA-F0-9]{64}$/;

function loadEnvAddress(name, fallback) {
  const raw = process.env[name]?.trim();
  if (raw && ADDRESS_RE.test(raw)) return raw;
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    const match = readFileSync(file, "utf8").match(
      new RegExp(`${name}=(0x[a-fA-F0-9]{40})`, "m"),
    );
    if (match) return match[1];
  }
  return fallback;
}

function diagnoseEnvFiles() {
  const hints = [];
  for (const file of [".env.local", ".env.example", ".env"]) {
    if (!existsSync(file)) continue;
    const text = readFileSync(file, "utf8");
    const commented = text.match(/#\s*SIGNER_PRIVATE_KEY=(0x[a-fA-F0-9]+)/);
    if (commented) {
      const hexLen = commented[1].length - 2;
      hints.push(
        `${file}: SIGNER_PRIVATE_KEY is commented (#). Remove # at line start.`,
      );
      if (hexLen === 40) {
        hints.push(
          `${file}: value looks like an ADDRESS (40 hex) — need MetaMask private key (64 hex).`,
        );
      }
    }
    const wrongLen = text.match(/^SIGNER_PRIVATE_KEY=(0x[a-fA-F0-9]{40})\s*$/m);
    if (wrongLen) {
      hints.push(
        `${file}: SIGNER_PRIVATE_KEY has 40 hex chars (address). Need 64 hex chars.`,
      );
    }
  }
  if (
    existsSync(".env.example") &&
    existsSync(".env.local") &&
    !readFileSync(".env.local", "utf8").includes("SIGNER_PRIVATE_KEY=0x") &&
    readFileSync(".env.example", "utf8").includes("SIGNER_PRIVATE_KEY")
  ) {
    hints.push(
      "Key may be in .env.example — npm script only loads .env.local. Copy to .env.local.",
    );
  }
  return hints;
}

function loadSignerPrivateKey() {
  const raw = process.env.SIGNER_PRIVATE_KEY?.trim().replace(/^["']|["']$/g, "");
  if (raw) return raw;
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    const match = readFileSync(file, "utf8").match(
      /^SIGNER_PRIVATE_KEY=(0x[a-fA-F0-9]{64})\s*$/m,
    );
    if (match) return match[1];
  }
  return null;
}

function validateSignerKey(key, safeAddress) {
  if (!key) {
    return "SIGNER_PRIVATE_KEY is missing.";
  }
  if (key.split(/\s+/).length > 1) {
    return "You pasted a seed phrase — use the hex private key (0x + 64 hex chars), not the recovery phrase.";
  }
  if (!PRIVATE_KEY_RE.test(key)) {
    if (ADDRESS_RE.test(key)) {
      return "This looks like a wallet ADDRESS (40 hex chars). You need the SIGNER private key (64 hex chars after 0x), usually from MetaMask.";
    }
    return `Invalid format: expected 0x + 64 hex characters (66 total), got length ${key.length}.`;
  }
  if (key.toLowerCase() === safeAddress.toLowerCase()) {
    return "SIGNER_PRIVATE_KEY must not be the Safe address — use the MetaMask/signer key that controls the Safe.";
  }
  try {
    privateKeyToAccount(key);
  } catch {
    return "Key has correct length but is not a valid secp256k1 private key.";
  }
  return null;
}

const safeAddress = loadEnvAddress("SAFE_ADDRESS", null);
const signerKey = loadSignerPrivateKey();

if (!safeAddress?.startsWith("0x")) {
  console.error(`
Missing SAFE_ADDRESS.

Option A — edit .env.local (then only run npm run hist:register-group-safe):
  SAFE_ADDRESS=0xD55a912aF5639a6769AE5c1894C0c7BFB5Bf539E
  SIGNER_PRIVATE_KEY=0x<64_hex_MetaMask_signer>

Option B — one-shot:
  SAFE_ADDRESS=0xD55a912aF5639a6769AE5c1894C0c7BFB5Bf539E \\
  SIGNER_PRIVATE_KEY=0x... npm run hist:register-group-safe
`);
  process.exit(1);
}

const keyError = validateSignerKey(signerKey, safeAddress);
if (keyError) {
  const hints = diagnoseEnvFiles();
  console.error(`\n❌ ${keyError}\n`);
  if (hints.length > 0) {
    console.error("Diagnostics:");
    for (const h of hints) console.error(`  • ${h}`);
    console.error("");
  }
  console.error(`Fix .env.local (loaded via --env-file=.env.local):

  SAFE_ADDRESS=0xD55a912aF5639a6769AE5c1894C0c7BFB5Bf539E
  SIGNER_PRIVATE_KEY=0x<64_hex_chars_from_MetaMask>

  No # at the start of SIGNER_PRIVATE_KEY line.
  Not .env.example — only .env.local is read.

See scripts/WALLET-GNOSIS-HIST.md
`);
  process.exit(1);
}

let signerAddress;
try {
  signerAddress = privateKeyToAccount(signerKey).address;
} catch {
  signerAddress = "(unknown)";
}
console.log("Signer EOA:", signerAddress);

const rpc = process.env.GNOSIS_RPC_URL ?? "https://rpc.gnosischain.com";
const publicClient = createPublicClient({ chain: gnosis, transport: http(rpc) });

const runner = new SafeContractRunner(
  publicClient,
  signerKey,
  rpc,
  safeAddress,
);

console.log("Safe (Circles avatar):", safeAddress);
console.log("RPC:", rpc);
console.log("Initializing Safe runner…\n");

await runner.init();

const sdk = new Sdk(undefined, runner);

const groupAvatar = await sdk.register.asGroup(
  safeAddress,
  safeAddress,
  safeAddress,
  [],
  "History Guessr",
  "HIST",
  {
    name: "History Guessr",
    description:
      "Group currency for cultural quests, sources, and curation on History Guessr.",
  },
);

console.log("✅ HIST group deployed\n");
console.log("Group address:", groupAvatar.address);
console.log("\nAdd to .env.local and Vercel, then redeploy:\n");
console.log(`VITE_HIST_GROUP_ADDRESS=${groupAvatar.address}`);
console.log("\nVerify: HIST_GROUP=" + groupAvatar.address + " npm run hist:check");
