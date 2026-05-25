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

function normalizePrivateKey(raw) {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/^["']|["']$/g, "").replace(/\s/g, "");
  if (/^0x[a-fA-F0-9]{64}$/.test(cleaned)) return cleaned;
  if (/^[a-fA-F0-9]{64}$/.test(cleaned)) return `0x${cleaned}`;
  return cleaned;
}

function loadSignerPrivateKey() {
  const fromEnv = normalizePrivateKey(process.env.SIGNER_PRIVATE_KEY);
  if (fromEnv) return fromEnv;

  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    const line = readFileSync(file, "utf8").match(
      /^SIGNER_PRIVATE_KEY=(.+)\s*$/m,
    );
    if (!line) continue;
    const normalized = normalizePrivateKey(line[1]);
    if (normalized) return normalized;
  }
  return null;
}

function validateSignerKey(key, safeAddress) {
  if (!key) {
    return { error: "SIGNER_PRIVATE_KEY is missing.", key: null };
  }
  if (key.split(/\s+/).length > 1) {
    return {
      error:
        "You pasted a seed phrase — use the hex private key (64 hex chars), not the recovery phrase.",
      key: null,
    };
  }

  const validKey = normalizePrivateKey(key);
  if (!validKey || !PRIVATE_KEY_RE.test(validKey)) {
    if (ADDRESS_RE.test(key) || ADDRESS_RE.test(validKey ?? "")) {
      return {
        error:
          "This looks like a wallet ADDRESS (40 hex chars). You need the SIGNER private key (64 hex chars), usually from MetaMask.",
        key: null,
      };
    }
    return {
      error: `Invalid format: need 64 hex chars (MetaMask often omits 0x — both work). Got length ${key.length}.`,
      key: null,
    };
  }

  if (validKey.toLowerCase() === safeAddress.toLowerCase()) {
    return {
      error:
        "SIGNER_PRIVATE_KEY must not be the Safe address — use the MetaMask/signer key that controls the Safe.",
      key: null,
    };
  }

  try {
    privateKeyToAccount(validKey);
  } catch {
    return {
      error: "Key has correct length but is not a valid secp256k1 private key.",
      key: null,
    };
  }

  return { error: null, key: validKey };
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

const { error: keyError, key: signerKeyNormalized } = validateSignerKey(
  signerKey,
  safeAddress,
);
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
  SIGNER_PRIVATE_KEY=<64_hex_from_MetaMask>   # 0x prefix optional

  No # at the start of SIGNER_PRIVATE_KEY line.
  Not .env.example — only .env.local is read.

See scripts/WALLET-GNOSIS-HIST.md
`);
  process.exit(1);
}

let signerAddress;
try {
  signerAddress = privateKeyToAccount(signerKeyNormalized).address;
} catch {
  signerAddress = "(unknown)";
}
console.log("Signer EOA:", signerAddress);

const rpc = process.env.GNOSIS_RPC_URL ?? "https://rpc.gnosischain.com";
const publicClient = createPublicClient({ chain: gnosis, transport: http(rpc) });

const runner = new SafeContractRunner(
  publicClient,
  signerKeyNormalized,
  rpc,
  safeAddress,
);

console.log("Safe (Circles avatar):", safeAddress);
console.log("RPC:", rpc);
console.log("Initializing Safe runner…\n");

await runner.init();

const sdk = new Sdk(undefined, runner);

let groupAvatar;
try {
  groupAvatar = await sdk.register.asGroup(
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
} catch (err) {
  const msg = err?.shortMessage ?? err?.message ?? String(err);
  if (/insufficient funds/i.test(msg)) {
    console.error(`
❌ Gas insuffisant sur le signataire MetaMask (pas sur le Safe Circles).

Le script paie le gas avec l'EOA signataire: ${signerAddress}

Envoie ~0.01 xDAI sur Gnosis Chain à cette adresse, puis relance:
  npm run hist:register-group-safe
`);
    process.exit(1);
  }
  throw err;
}

console.log("✅ HIST group deployed\n");
console.log("Group address:", groupAvatar.address);
console.log("\nAdd to .env.local and Vercel, then redeploy:\n");
console.log(`VITE_HIST_GROUP_ADDRESS=${groupAvatar.address}`);
console.log("\nVerify: HIST_GROUP=" + groupAvatar.address + " npm run hist:check");
